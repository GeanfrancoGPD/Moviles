import RecipeRepository from "./RecipeRepository.js";
import Session from "../../components/session.js";
import UtilBycript from "../../util/bycript.js";
import Validator from "../../util/validator.js";

export class RecipeBO {
  constructor() {
    this.repository = RecipeRepository;
    this.session = Session;
    this.bcrypt = UtilBycript;
    this.validator = Validator;
  }

  getValidationMessage(validation) {
    return validation?.error?.issues?.[0]?.message || "Dato inválido";
  }

  async login(req, res) {
    const { gmail, password } = req.body;

    if (!gmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Correo electrónico y contraseña son requeridos",
      });
    }

    const emailValidation = await this.validator.validateEmail(gmail);
    if (!emailValidation.success) {
      return res.status(400).json({
        success: false,
        message: this.getValidationMessage(emailValidation),
      });
    }

    const passwordValidation = await this.validator.validatePassword(password);
    if (!passwordValidation.success) {
      return res.status(400).json({
        success: false,
        message: this.getValidationMessage(passwordValidation),
      });
    }

    const user = await this.repository.getUserByEmail(gmail);

    if (!user.length) {
      return res.status(401).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    const valid = await this.bcrypt.compare(password, user[0].password);

    if (!valid) {
      return res.status(401).json({
        success: false,
        message: "Contraseña incorrecta",
      });
    }

    await this.session.createSession({ request: req, response: res }, user);
  }

  async register(req, res) {
    const { nombre, gmail, password } = req.body;

    if (!nombre || !gmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Todos los datos son requeridos",
      });
    }

    const nameValidation = await this.validator.validateUsername(nombre);
    if (!nameValidation.success) {
      return res.status(400).json({
        success: false,
        message: this.getValidationMessage(nameValidation),
      });
    }

    const emailValidation = await this.validator.validateEmail(gmail);
    if (!emailValidation.success) {
      return res.status(400).json({
        success: false,
        message: this.getValidationMessage(emailValidation),
      });
    }

    const passwordValidation = await this.validator.validatePassword(password);
    if (!passwordValidation.success) {
      return res.status(400).json({
        success: false,
        message: this.getValidationMessage(passwordValidation),
      });
    }

    const existingUser = await this.repository.getUserByEmail(gmail);
    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "El correo electrónico ya está registrado",
      });
    }

    const hashedPassword = await this.bcrypt.hash(password);

    await this.repository.createUser(nombre, gmail, hashedPassword);

    return res.status(201).json({
      success: true,
      message: "Se ha creado el usuario correctamente",
    });
  }

  async logout(req, res) {
    return this.session.destroySession({ request: req, response: res });
  }

  getValidationMessage(validation) {
    return validation?.error?.issues?.[0]?.message || "Dato inválido";
  }

  async validateRecipePayload(params) {
    const titleValidation = await this.validator.validateRecipeTitle(
      params?.titulo,
    );
    if (!titleValidation.success) {
      return {
        success: false,
        message: this.getValidationMessage(titleValidation),
      };
    }

    const descriptionValidation =
      await this.validator.validateRecipeDescription(params?.descripcion ?? "");
    if (!descriptionValidation.success) {
      return {
        success: false,
        message: this.getValidationMessage(descriptionValidation),
      };
    }

    const imageValidation = await this.validator.validateRecipeImageKey(
      params?.imagen_key ?? "default",
    );
    if (!imageValidation.success) {
      return {
        success: false,
        message: this.getValidationMessage(imageValidation),
      };
    }

    const timeValidation = await this.validator.validateRecipeTime(
      params?.tiempo_coccion,
    );
    if (!timeValidation.success) {
      return {
        success: false,
        message: this.getValidationMessage(timeValidation),
      };
    }

    const difficultyValidation = await this.validator.validateRecipeDifficulty(
      params?.dificultad,
    );
    if (!difficultyValidation.success) {
      return {
        success: false,
        message: this.getValidationMessage(difficultyValidation),
      };
    }

    const caloriesValidation = await this.validator.validateRecipeCalories(
      params?.calorias,
    );
    if (!caloriesValidation.success) {
      return {
        success: false,
        message: this.getValidationMessage(caloriesValidation),
      };
    }

    const servingsValidation = await this.validator.validateRecipeServings(
      params?.porciones,
    );
    if (!servingsValidation.success) {
      return {
        success: false,
        message: this.getValidationMessage(servingsValidation),
      };
    }

    const visibilityValidation = await this.validator.validateRecipeVisibility(
      params?.is_public,
    );
    if (!visibilityValidation.success) {
      return {
        success: false,
        message: this.getValidationMessage(visibilityValidation),
      };
    }

    if (
      !Array.isArray(params?.ingredients) ||
      params.ingredients.length === 0
    ) {
      return {
        success: false,
        message: "Debes enviar al menos un ingrediente",
      };
    }

    for (const ingredient of params.ingredients) {
      const ingredientNameValidation =
        await this.validator.validateRecipeIngredientName(ingredient?.nombre);
      if (!ingredientNameValidation.success) {
        return {
          success: false,
          message: this.getValidationMessage(ingredientNameValidation),
        };
      }

      const ingredientQuantityValidation =
        await this.validator.validateRecipeIngredientQuantity(
          ingredient?.cantidad,
        );
      if (!ingredientQuantityValidation.success) {
        return {
          success: false,
          message: this.getValidationMessage(ingredientQuantityValidation),
        };
      }
    }

    if (!Array.isArray(params?.steps) || params.steps.length === 0) {
      return { success: false, message: "Debes enviar al menos un paso" };
    }

    for (const step of params.steps) {
      const stepValidation = await this.validator.validateRecipeStepDescription(
        step?.descripcion,
      );
      if (!stepValidation.success) {
        return {
          success: false,
          message: this.getValidationMessage(stepValidation),
        };
      }
    }

    return { success: true };
  }

  async normalizeRecipeParams(params) {
    return {
      ...params,
      imagen_key: params.imagen_key ?? "default",
      tiempo_coccion: Number(params.tiempo_coccion),
      calorias: Number(params.calorias),
      porciones: Number(params.porciones),
      is_public: Boolean(params.is_public),
      usuario_id: Number(params.usuario_id),
      id: params.id !== undefined ? Number(params.id) : params.id,
    };
  }

  // NUEVA FUNCIÓN: Verificar si el usuario es dueño de la receta
  async userOwnsRecipe(usuarioId, recipeId) {
    const result = await this.DBPool.executeQuery(
      "SELECT id FROM recetas WHERE id = $1 AND usuario_id = $2",
      [recipeId, usuarioId],
    );
    return result.length > 0;
  }
}

export class AuthBO extends RecipeBO {}

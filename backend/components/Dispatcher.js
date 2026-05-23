import { DB } from "./DBComponent.js";
import { Session } from "./session.js";
import UtilBycript from "../util/bycript.js";
import Validator from "../util/validator.js";

export class Dispatcher {
  constructor() {
    this.DBPool = new DB();
    this.sessionComponent = new Session();
    this.utilBycript = new UtilBycript();
    this.validator = new Validator();
  }

  init(app) {
    this.DBPool.init();
    this.app = app;
    this.registerRoutes();
  }

  registerRoutes() {
    this.app.post("/api/login", async (req, res) => {
      await this.login({ request: req, response: res });
    });

    this.app.post("/api/register", async (req, res) => {
      await this.registerUser({ request: req, response: res });
    });

    this.app.post("/api/logout", (req, res) => {
      this.destroy({ request: req, response: res });
    });

    this.app.post("/api/toProccess", (req, res) => {
      this.toProccess({ request: req, response: res });
    });
  }

  existSession(sessionObject) {
    return this.sessionComponent.sessionExist(sessionObject);
  }

  async login(sessionObject) {
    const { gmail, email, password } = sessionObject.request.body;
    const userEmail = gmail ?? email;

    if (!userEmail || !password) {
      return sessionObject.response.status(400).json({
        success: false,
        message: "Correo electrónico y contraseña son requeridos",
      });
    }

    if (!this.validator.validateEmail(userEmail)) {
      return sessionObject.response.status(400).json({
        success: false,
        mensaje: "Email inválido",
      });
    }
    const user = await this.DBPool.excecuteNameQuery("getUser", {
      gmail: userEmail,
    });
    if (user.length === 0) {
      return sessionObject.response
        .status(401)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    const isPasswordValid = await this.utilBycript.compare(
      password,
      user[0].password,
    );

    if (!isPasswordValid) {
      return sessionObject.response.status(401).json({
        success: false,
        message: "contraseña incorrecta",
      });
    }

    await this.sessionComponent.createSession(sessionObject, user);
  }

  async registerUser(sessionObject) {
    const { nombre, gmail, email, password } = sessionObject.request.body;
    const userEmail = gmail ?? email;
    console.log("datos:", nombre, userEmail, password);

    if (!userEmail || !password || !nombre) {
      return sessionObject.response.status(402).json({
        success: false,
        message: "Todos los datos son requeridos",
      });
    }

    const hashedPassword = await this.utilBycript.hash(password);

    await this.DBPool.executeQuery(
      "INSERT INTO usuarios (nombre, gmail, password) VALUES ($1, $2, $3)",
      [nombre, userEmail, hashedPassword],
    );

    sessionObject.response.json({
      success: true,
      message: "Se ha creado el usuario correctamente",
    });
  }

  // NUEVA FUNCIÓN: Verificar si el usuario es dueño de la receta
  async userOwnsRecipe(usuarioId, recipeId) {
    const result = await this.DBPool.executeQuery(
      "SELECT id FROM recetas WHERE id = $1 AND usuario_id = $2",
      [recipeId, usuarioId]
    );
    return result.length > 0;
  }

  async toProccess(sessionObject) {
    // Si quieres habilitar la verificación de sesión, descomenta esto:
    // if (!this.existSession(sessionObject)) {
    //   return sessionObject.response.status(401).json({
    //     success: false,
    //     message: "No autorizado",
    //   });
    // }

    const { namequery, params } = sessionObject.request.body;

    try {
      // Verificar propiedad para deleteRecipe
      if (namequery === 'deleteRecipe') {
        if (!params.id || !params.usuario_id) {
          return sessionObject.response.status(400).json({
            success: false,
            message: "Faltan parámetros para eliminar la receta"
          });
        }
        
        const owns = await this.userOwnsRecipe(params.usuario_id, params.id);
        if (!owns) {
          return sessionObject.response.status(403).json({
            success: false,
            message: "No tienes permiso para eliminar esta receta"
          });
        }
      }
      
      // Verificar propiedad para updateRecipe (si existe en el futuro)
      if (namequery === 'updateRecipe') {
        if (!params.id || !params.usuario_id) {
          return sessionObject.response.status(400).json({
            success: false,
            message: "Faltan parámetros para actualizar la receta"
          });
        }
        
        const owns = await this.userOwnsRecipe(params.usuario_id, params.id);
        if (!owns) {
          return sessionObject.response.status(403).json({
            success: false,
            message: "No tienes permiso para editar esta receta"
          });
        }
      }

      const result = await this.DBPool.excecuteNameQuery(namequery, params);
      sessionObject.response.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Error en toProccess:", error);
      sessionObject.response.status(500).json({
        success: false,
        message: "Error al ejecutar la consulta",
      });
    }
  }

  destroy(sessionObject) {
    this.sessionComponent.destroySession(sessionObject);
  }
}
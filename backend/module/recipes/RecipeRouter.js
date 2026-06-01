import express from "express";
import { RecipeBO } from "./RecipeBO.js";
import RecipeRepository from "./RecipeRepository.js";
import DB from "../../components/DBComponent.js";
import { authMiddleware } from "./RecipeMiddleware.js";

const router = express.Router();
const recipeBO = new RecipeBO();
const recipeRepository = RecipeRepository;

function resolveUserId(req) {
  const candidate =
    req.session?.user?.id ??
    req.body?.usuario_id ??
    req.body?.usuarioId ??
    req.query?.usuarioId ??
    req.params?.usuarioId;

  const parsed = Number(candidate);
  return Number.isFinite(parsed) ? parsed : null;
}

async function buildRecipeDetail(recipeId) {
  const recipeRows = await recipeRepository.getRecipeById(recipeId);

  if (!recipeRows?.length) {
    return null;
  }

  const recipe = recipeRows[0];
  const ingredientes = await recipeRepository.getIngredientsByRecipe(recipeId);
  const pasos = await recipeRepository.getStepsByRecipe(recipeId);

  return {
    ...recipe,
    ingredientes: Array.isArray(ingredientes) ? ingredientes : [],
    pasos: Array.isArray(pasos) ? pasos : [],
  };
}

router.post("/login", async (req, res) => {
  await recipeBO.login(req, res);
});

router.post("/register", async (req, res) => {
  await recipeBO.register(req, res);
});

router.post("/logout", async (req, res) => {
  await recipeBO.logout(req, res);
});

router.get("/public-recipes", async (req, res) => {
  try {
    const data = await recipeRepository.getPublicRecipes();
    return res.json({ success: true, data: data ?? [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: "No se pudieron cargar las recetas públicas" });
  }
});

router.get("/users/:usuarioId/recipes", authMiddleware, async (req, res) => {
  try {
    const usuarioId = resolveUserId(req);

    if (!usuarioId) {
      return res.status(400).json({ success: false, message: "Usuario inválido" });
    }

    const data = await recipeRepository.getUserRecipes(usuarioId);
    return res.json({ success: true, data: data ?? [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: "No se pudieron cargar las recetas del usuario" });
  }
});

router.get("/users/:usuarioId/groups", authMiddleware, async (req, res) => {
  try {
    const usuarioId = resolveUserId(req);

    if (!usuarioId) {
      return res.status(400).json({ success: false, message: "Usuario inválido" });
    }

    const data = await recipeRepository.getUserGroups(usuarioId);
    return res.json({ success: true, data: data ?? [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: "No se pudieron cargar los grupos del usuario" });
  }
});

router.get("/recipes/:recipeId", async (req, res) => {
  try {
    const recipeId = Number(req.params.recipeId);

    if (!Number.isFinite(recipeId)) {
      return res.status(400).json({ success: false, message: "Receta inválida" });
    }

    const data = await buildRecipeDetail(recipeId);

    if (!data) {
      return res.status(404).json({ success: false, message: "Receta no encontrada" });
    }

    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: "No se pudo cargar la receta" });
  }
});

router.post("/recipes", authMiddleware, async (req, res) => {
  try {
    const usuarioId = resolveUserId(req);

    if (!usuarioId) {
      return res.status(400).json({ success: false, message: "Usuario inválido" });
    }

    const validation = await recipeBO.validateRecipePayload(req.body);
    if (!validation.success) {
      return res.status(400).json(validation);
    }

    const normalized = await recipeBO.normalizeRecipeParams({
      ...req.body,
      usuario_id: usuarioId,
    });

    const createdRecipe = await recipeRepository.createRecipe({
      titulo: normalized.titulo,
      descripcion: normalized.descripcion,
      imagen_key: normalized.imagen_key,
      tiempo_coccion: normalized.tiempo_coccion,
      dificultad: normalized.dificultad,
      calorias: normalized.calorias,
      porciones: normalized.porciones,
      is_public: normalized.is_public,
      usuario_id: normalized.usuario_id,
    });

    const recipeId = createdRecipe?.[0]?.id;
    if (!recipeId) {
      return res.status(500).json({ success: false, message: "No se pudo crear la receta" });
    }

    for (let index = 0; index < req.body.ingredients.length; index += 1) {
      const ingredient = req.body.ingredients[index];
      await recipeRepository.addIngredient({
        receta_id: recipeId,
        nombre: ingredient.nombre,
        cantidad: ingredient.cantidad,
        orden: index + 1,
      });
    }

    for (let index = 0; index < req.body.steps.length; index += 1) {
      const step = req.body.steps[index];
      await recipeRepository.addStep({
        receta_id: recipeId,
        descripcion: step.descripcion,
        orden: index + 1,
      });
    }

    if (req.body.wantsGroup && req.body.groupId) {
      await recipeRepository.addRecipeToGroup({
        receta_id: recipeId,
        grupo_id: req.body.groupId,
      });
    }

    return res.status(201).json({ success: true, data: createdRecipe[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: "No se pudo crear la receta" });
  }
});

router.delete("/recipes/:recipeId", authMiddleware, async (req, res) => {
  try {
    const recipeId = Number(req.params.recipeId);
    const usuarioId = resolveUserId(req);

    if (!Number.isFinite(recipeId) || !usuarioId) {
      return res.status(400).json({ success: false, message: "Datos inválidos" });
    }

    const deleted = await recipeRepository.deleteRecipe(recipeId, usuarioId);

    if (!deleted?.length) {
      return res.status(404).json({ success: false, message: "No se encontró la receta o no pertenece al usuario" });
    }

    return res.json({ success: true, data: deleted[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: "No se pudo eliminar la receta" });
  }
});

router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const usuarioId = resolveUserId(req);

    if (!usuarioId) {
      return res.status(400).json({ success: false, message: "Usuario inválido" });
    }

    const { nombre, gmail } = req.body;
    const data = await DB.excecuteNameQuery("updateUserProfile", {
      nombre,
      gmail,
      id: usuarioId,
    });

    return res.json({ success: true, data: data ?? [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: "No se pudo actualizar el perfil" });
  }
});

router.put("/password", authMiddleware, async (req, res) => {
  try {
    const usuarioId = resolveUserId(req);

    if (!usuarioId) {
      return res.status(400).json({ success: false, message: "Usuario inválido" });
    }

    const { password } = req.body;
    const data = await DB.excecuteNameQuery("updatePassword", {
      password,
      id: usuarioId,
    });

    return res.json({ success: true, data: data ?? [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: "No se pudo actualizar la contraseña" });
  }
});

export default router;

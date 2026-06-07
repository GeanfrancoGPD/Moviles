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

// ==================== AUTENTICACIÓN ====================
router.post("/login", async (req, res) => {
  await recipeBO.login(req, res);
});

router.post("/register", async (req, res) => {
  await recipeBO.register(req, res);
});

router.post("/logout", async (req, res) => {
  await recipeBO.logout(req, res);
});

// ==================== RECETAS PÚBLICAS ====================
router.get("/public-recipes", async (req, res) => {
  try {
    const data = await recipeRepository.getPublicRecipes();
    return res.json({ success: true, data: data ?? [] });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No se pudieron cargar las recetas públicas",
    });
  }
});

router.get("/users/:usuarioId/recipes", authMiddleware, async (req, res) => {
  try {
    const usuarioId = resolveUserId(req);
    if (!usuarioId) {
      return res
        .status(400)
        .json({ success: false, message: "Usuario inválido" });
    }
    const data = await recipeRepository.getUserRecipes(usuarioId);
    return res.json({ success: true, data: data ?? [] });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No se pudieron cargar las recetas del usuario",
    });
  }
});

// ==================== CRUD RECETAS ====================
router.get("/recipes/:recipeId", async (req, res) => {
  try {
    const recipeId = Number(req.params.recipeId);
    if (!Number.isFinite(recipeId)) {
      return res
        .status(400)
        .json({ success: false, message: "Receta inválida" });
    }
    const data = await buildRecipeDetail(recipeId);
    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Receta no encontrada" });
    }
    return res.json({ success: true, data });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "No se pudo cargar la receta" });
  }
});

router.post("/recipes", authMiddleware, async (req, res) => {
  try {
    const usuarioId = resolveUserId(req);
    if (!usuarioId) {
      return res
        .status(400)
        .json({ success: false, message: "Usuario inválido" });
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

    const newRecipeId = createdRecipe?.[0]?.id;
    if (!newRecipeId) {
      return res
        .status(500)
        .json({ success: false, message: "No se pudo crear la receta" });
    }

    for (let i = 0; i < req.body.ingredients.length; i++) {
      const ing = req.body.ingredients[i];
      await recipeRepository.addIngredient({
        receta_id: newRecipeId,
        nombre: ing.nombre,
        cantidad: ing.cantidad,
        orden: i + 1,
      });
    }

    for (let i = 0; i < req.body.steps.length; i++) {
      const step = req.body.steps[i];
      await recipeRepository.addStep({
        receta_id: newRecipeId,
        descripcion: step.descripcion,
        orden: i + 1,
      });
    }

    if (req.body.wantsGroup && req.body.groupId) {
      await recipeRepository.addRecipeToGroup({
        receta_id: newRecipeId,
        grupo_id: req.body.groupId,
      });
    }

    return res.status(201).json({ success: true, data: createdRecipe[0] });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "No se pudo crear la receta" });
  }
});

router.put("/recipes/:recipeId", authMiddleware, async (req, res) => {
  try {
    const recipeIdParam = Number(req.params.recipeId);
    const usuarioId = resolveUserId(req);

    if (!Number.isFinite(recipeIdParam) || !usuarioId) {
      return res
        .status(400)
        .json({ success: false, message: "Datos inválidos" });
    }

    const validation = await recipeBO.validateRecipePayload(req.body);
    if (!validation.success) {
      return res.status(400).json(validation);
    }

    const normalized = await recipeBO.normalizeRecipeParams({
      ...req.body,
      usuario_id: usuarioId,
    });

    const updatedRecipe = await recipeRepository.putRecipe(
      recipeIdParam,
      usuarioId,
      {
        titulo: normalized.titulo,
        descripcion: normalized.descripcion,
        imagen_key: normalized.imagen_key,
        tiempo_coccion: normalized.tiempo_coccion,
        dificultad: normalized.dificultad,
        calorias: normalized.calorias,
        porciones: normalized.porciones,
        is_public: normalized.is_public,
      },
    );

    if (!updatedRecipe?.length) {
      return res.status(404).json({
        success: false,
        message: "No se encontró la receta o no pertenece al usuario",
      });
    }

    const updatedRecipeId = updatedRecipe[0].id;

    console.log("ANTES deleteIngredients");
    await recipeRepository.deleteIngredientsByRecipe(updatedRecipeId);
    console.log("DESPUES deleteIngredients");

    console.log("ANTES deleteSteps");
    await recipeRepository.deleteStepsByRecipe(updatedRecipeId);
    console.log("DESPUES deleteSteps");

    for (let i = 0; i < req.body.ingredients.length; i++) {
      const ing = req.body.ingredients[i];

      console.log("INSERTANDO INGREDIENTE", i, ing);

      await recipeRepository.addIngredient({
        receta_id: updatedRecipeId,
        nombre: ing.nombre,
        cantidad: ing.cantidad,
        orden: i + 1,
      });

      console.log("INGREDIENTE INSERTADO", i);
    }

    for (let i = 0; i < req.body.steps.length; i++) {
      const step = req.body.steps[i];

      console.log("INSERTANDO PASO", i, step);

      await recipeRepository.addStep({
        receta_id: updatedRecipeId,
        descripcion: step.descripcion,
        orden: i + 1,
      });

      console.log("PASO INSERTADO", i);
    }

    return res.json({
      success: true,
      data: updatedRecipe[0],
    });
  } catch (error) {
    console.error("=========== ERROR REAL ===========");
    console.error(error);
    console.error(error.message);
    console.error(error.stack);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.delete("/recipes/:recipeId", authMiddleware, async (req, res) => {
  try {
    const recipeId = Number(req.params.recipeId);
    const usuarioId = resolveUserId(req);

    if (!Number.isFinite(recipeId) || !usuarioId) {
      return res
        .status(400)
        .json({ success: false, message: "Datos inválidos" });
    }

    const deleted = await recipeRepository.deleteRecipe(recipeId, usuarioId);
    if (!deleted?.length) {
      return res.status(404).json({
        success: false,
        message: "No se encontró la receta o no pertenece al usuario",
      });
    }
    return res.json({ success: true, data: deleted[0] });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "No se pudo eliminar la receta" });
  }
});

// ==================== LIKES ====================
router.post("/recipes/:recipeId/like", authMiddleware, async (req, res) => {
  try {
    const recipeId = Number(req.params.recipeId);
    const usuarioId = resolveUserId(req);
    if (!Number.isFinite(recipeId) || !usuarioId) {
      return res
        .status(400)
        .json({ success: false, message: "Datos inválidos" });
    }

    // Verificar si ya existe
    const existing = await recipeRepository.getLikeStatus(recipeId, usuarioId);
    let liked;
    if (existing) {
      await recipeRepository.removeLike(recipeId, usuarioId);
      liked = false;
    } else {
      await recipeRepository.addLike(recipeId, usuarioId);
      liked = true;
    }

    return res.json({ success: true, data: { liked } });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "No se pudo procesar la acción" });
  }
});

router.delete("/recipes/:recipeId/like", authMiddleware, async (req, res) => {
  try {
    const recipeId = Number(req.params.recipeId);
    const usuarioId = resolveUserId(req);
    if (!Number.isFinite(recipeId) || !usuarioId) {
      return res
        .status(400)
        .json({ success: false, message: "Datos inválidos" });
    }
    const data = await recipeRepository.removeLike(recipeId, usuarioId);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "No se encontró la receta o el usuario",
      });
    }
    return res.json({ success: true, data });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "No se pudo procesar la acción" });
  }
});

// ==================== PERFIL ====================
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const usuarioId = resolveUserId(req);
    if (!usuarioId) {
      return res
        .status(400)
        .json({ success: false, message: "Usuario inválido" });
    }
    const { nombre, gmail } = req.body;
    const data = await DB.excecuteNameQuery("updateUserProfile", {
      nombre,
      gmail,
      id: usuarioId,
    });
    return res.json({ success: true, data: data ?? [] });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "No se pudo actualizar el perfil" });
  }
});

router.put("/password", authMiddleware, async (req, res) => {
  try {
    const usuarioId = resolveUserId(req);
    if (!usuarioId) {
      return res
        .status(400)
        .json({ success: false, message: "Usuario inválido" });
    }
    const { password } = req.body;
    const data = await DB.excecuteNameQuery("updatePassword", {
      password,
      id: usuarioId,
    });
    return res.json({ success: true, data: data ?? [] });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "No se pudo actualizar la contraseña" });
  }
});

// ==================== GRUPOS - CRUD COMPLETO ====================
router.get("/users/:usuarioId/groups", authMiddleware, async (req, res) => {
  try {
    const usuarioId = resolveUserId(req);
    if (!usuarioId) {
      return res
        .status(400)
        .json({ success: false, message: "Usuario inválido" });
    }
    const data = await recipeRepository.getUserGroups(usuarioId);
    return res.json({ success: true, data: data ?? [] });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No se pudieron cargar los grupos del usuario",
    });
  }
});

router.post("/groups", authMiddleware, async (req, res) => {
  try {
    const usuarioId = resolveUserId(req);
    if (!usuarioId) {
      return res
        .status(400)
        .json({ success: false, message: "Debe iniciar sesión" });
    }
    const { nombre, descripcion } = req.body;
    const data = await recipeRepository.createGroup({
      nombre,
      descripcion,
      usuario_id: usuarioId,
    });
    return res.status(201).json({ success: true, data: data?.[0] ?? null });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "No se pudo crear el grupo" });
  }
});

router.put("/groups/:groupId", authMiddleware, async (req, res) => {
  try {
    const groupId = Number(req.params.groupId);
    const usuarioId = resolveUserId(req);
    console.log("PUT /groups/:groupId", {
      groupId: req.params.groupId,
      parsedGroupId: groupId,
      usuarioId,
      body: req.body,
    });

    if (!Number.isFinite(groupId) || !usuarioId) {
      console.error("PUT /groups/:groupId - datos inválidos", {
        groupId: req.params.groupId,
        usuarioId,
        body: req.body,
      });
      return res
        .status(400)
        .json({ success: false, message: "Datos inválidos" });
    }
    const { nombre, descripcion } = req.body;
    const data = await recipeRepository.updateGroup(groupId, usuarioId, {
      nombre,
      descripcion,
    });
    console.log("PUT /groups/:groupId result", { data });

    if (!data?.length) {
      console.error("PUT /groups/:groupId - grupo no encontrado o no pertenece", {
        groupId,
        usuarioId,
        body: req.body,
        data,
      });
      return res.status(404).json({
        success: false,
        message: "Grupo no encontrado o no te pertenece",
      });
    }
    return res.json({ success: true, data: data[0] });
  } catch (error) {
    console.error("Error updating group", {
      error,
      params: req.params,
      body: req.body,
    });
    return res
      .status(500)
      .json({ success: false, message: "No se pudo actualizar el grupo" });
  }
});

// Obtener grupo con detalles (incluye conteo de recetas totales y propias)
router.get("/groups/:groupId/details", authMiddleware, async (req, res) => {
  try {
    const groupId = Number(req.params.groupId);
    const usuarioId = resolveUserId(req);
    if (!Number.isFinite(groupId) || !usuarioId) {
      return res
        .status(400)
        .json({ success: false, message: "Datos inválidos" });
    }
    const groupData = await recipeRepository.getGroupDetails(
      groupId,
      usuarioId,
    );
    return res.json({ success: true, data: groupData });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "No se pudo cargar el grupo" });
  }
});

router.delete("/groups/:groupId", authMiddleware, async (req, res) => {
  try {
    const groupId = Number(req.params.groupId);
    const usuarioId = resolveUserId(req);
    const deleteUserRecipes = req.body.deleteUserRecipes === "true"; // true/false desde query

    if (!Number.isFinite(groupId) || !usuarioId) {
      return res
        .status(400)
        .json({ success: false, message: "Datos inválidos" });
    }

    // 1. Si se pide eliminar las recetas del usuario que están SOLO en este grupo,
    //    primero obtener esas recetas y borrarlas físicamente.
    if (deleteUserRecipes) {
      const userRecipesInGroup = await recipeRepository.getUserRecipesInGroup(
        groupId,
        usuarioId,
      );
      for (const recipe of userRecipesInGroup) {
        // Verificar si la receta pertenece a algún otro grupo (opcional, pero si quieres borrar solo si está únicamente en este grupo)
        // Por simplicidad, asumimos que el usuario eligió eliminar sus recetas asociadas a este grupo.
        await recipeRepository.deleteRecipe(recipe.id, usuarioId);
      }
    } else {
      // Si no se eliminan las recetas, solo se desvinculan del grupo
      await recipeRepository.removeOwnedRecipesFromGroup(groupId, usuarioId);
    }

    // 2. Eliminar el grupo
    const deletedGroup = await recipeRepository.deleteGroup(groupId, usuarioId);
    if (!deletedGroup?.length) {
      return res.status(404).json({
        success: false,
        message: "Grupo no encontrado o no te pertenece",
      });
    }

    return res.json({ success: true, data: deletedGroup[0] });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "No se pudo eliminar el grupo" });
  }
});

// Obtener todas las recetas de un grupo (incluye info de si son del usuario)
router.get("/groups/:groupId/all-recipes", authMiddleware, async (req, res) => {
  try {
    const groupId = Number(req.params.groupId);
    const usuarioId = resolveUserId(req);
    if (!Number.isFinite(groupId) || !usuarioId) {
      return res
        .status(400)
        .json({ success: false, message: "Datos inválidos" });
    }
    const recipes = await recipeRepository.getAllGroupRecipes(
      groupId,
      usuarioId,
    );
    return res.json({ success: true, data: recipes ?? [] });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No se pudieron cargar las recetas del grupo",
    });
  }
});

// Agregar una receta a un grupo (desde el like)
router.post("/groups/:groupId/recipes", authMiddleware, async (req, res) => {
  try {
    const groupId = Number(req.params.groupId);
    const usuarioId = resolveUserId(req);
    const { recipeId } = req.body;
    if (!Number.isFinite(groupId) || !usuarioId || !Number.isFinite(recipeId)) {
      return res
        .status(400)
        .json({ success: false, message: "Datos inválidos" });
    }
    const data = await recipeRepository.addRecipeToGroup({
      grupo_id: groupId,
      receta_id: recipeId,
      usuario_id: usuarioId,
    });
    if (!data?.length) {
      return res.status(404).json({
        success: false,
        message: "No se encontró la receta o el grupo",
      });
    }
    return res.status(201).json({ success: true, data: data[0] });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No se pudo agregar la receta al grupo",
    });
  }
});

// Quitar una receta de un grupo (solo si es del usuario)
router.delete(
  "/groups/:groupId/recipes/:recipeId",
  authMiddleware,
  async (req, res) => {
    try {
      const groupId = Number(req.params.groupId);
      const recipeId = Number(req.params.recipeId);
      const usuarioId = resolveUserId(req);
      if (
        !Number.isFinite(groupId) ||
        !Number.isFinite(recipeId) ||
        !usuarioId
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Datos inválidos" });
      }
      const data = await recipeRepository.removeRecipeFromGroup({
        grupo_id: groupId,
        receta_id: recipeId,
        usuario_id: usuarioId,
      });
      if (!data?.length) {
        return res.status(404).json({
          success: false,
          message: "No se encontró la relación o no tienes permiso",
        });
      }
      return res.json({ success: true, data: data[0] });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "No se pudo eliminar la receta del grupo",
      });
    }
  },
);

router.get("/groups/:groupId/recipes", authMiddleware, async (req, res) => {
  try {
    const groupId = Number(req.params.groupId);
    const usuarioId = resolveUserId(req);
    if (!Number.isFinite(groupId) || !usuarioId) {
      return res
        .status(400)
        .json({ success: false, message: "Datos inválidos" });
    }
    const data = await recipeRepository.getGroupRecipes(groupId);
    return res.json({ success: true, data: data ?? [] });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No se pudieron cargar las recetas del grupo",
    });
  }
});

export default router;

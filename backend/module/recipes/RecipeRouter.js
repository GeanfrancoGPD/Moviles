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

// ========== AUTENTICACIÓN ==========
router.post("/login", async (req, res) => {
  await recipeBO.login(req, res);
});

router.post("/register", async (req, res) => {
  await recipeBO.register(req, res);
});

router.post("/logout", async (req, res) => {
  await recipeBO.logout(req, res);
});

// ========== RECETAS PÚBLICAS ==========
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

// ========== RECETAS DEL USUARIO ==========
router.get("/users/:usuarioId/recipes", authMiddleware, async (req, res) => {
  try {
    const usuarioId = resolveUserId(req);
    if (!usuarioId) {
      return res.status(400).json({ success: false, message: "Usuario inválido" });
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

// ========== OBTENER UNA RECETA ==========
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

// ========== CREAR RECETA ==========
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
    for (let index = 0; index < req.body.ingredients.length; index++) {
      const ingredient = req.body.ingredients[index];
      await recipeRepository.addIngredient({
        receta_id: recipeId,
        nombre: ingredient.nombre,
        cantidad: ingredient.cantidad,
        orden: index + 1,
      });
    }
    for (let index = 0; index < req.body.steps.length; index++) {
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

// ========== ELIMINAR RECETA ==========
router.delete("/recipes/:recipeId", authMiddleware, async (req, res) => {
  try {
    const recipeId = Number(req.params.recipeId);
    const usuarioId = resolveUserId(req);
    if (!Number.isFinite(recipeId) || !usuarioId) {
      return res.status(400).json({ success: false, message: "Datos inválidos" });
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
    return res.status(500).json({ success: false, message: "No se pudo eliminar la receta" });
  }
});

// ========== ACTUALIZAR PERFIL ==========
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

// ========== ACTUALIZAR CONTRASEÑA ==========
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

// ========== GRUPOS DEL USUARIO ==========
router.get("/users/:usuarioId/groups", authMiddleware, async (req, res) => {
  try {
    const usuarioId = resolveUserId(req);
    if (!usuarioId) {
      return res.status(400).json({ success: false, message: "Usuario inválido" });
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

// ========== CREAR GRUPO ==========
router.post("/groups", authMiddleware, async (req, res) => {
  try {
    const usuarioId = resolveUserId(req);
    if (!usuarioId) {
      return res.status(400).json({ success: false, message: "Debe iniciar sesion" });
    }
    const { nombre, descripcion } = req.body;
    const data = await recipeRepository.createGroup({
      nombre,
      descripcion,
      usuario_id: usuarioId,
    });
    return res.status(201).json({ success: true, data: data?.[0] ?? null });
  } catch (error) {
    return res.status(500).json({ success: false, message: "No se pudo crear el grupo" });
  }
});

// ========== OBTENER GRUPO ==========
router.get("/groups/:groupId", authMiddleware, async (req, res) => {
  try {
    const groupId = Number(req.params.groupId);
    const usuarioId = resolveUserId(req);
    if (!Number.isFinite(groupId) || !usuarioId) {
      return res.status(400).json({ success: false, message: "Datos inválidos" });
    }
    const data = await recipeRepository.getGroupById(groupId, usuarioId);
    return res.json({ success: true, data: data ?? [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: "No se pudo cargar el grupo" });
  }
});

// ========== ELIMINAR GRUPO ==========
router.delete("/groups/:groupId", authMiddleware, async (req, res) => {
  try {
    const groupId = Number(req.params.groupId);
    const usuarioId = resolveUserId(req);
    if (!Number.isFinite(groupId) || !usuarioId) {
      return res.status(400).json({ success: false, message: "Datos inválidos" });
    }
    await recipeRepository.deleteOwnedRecipesFromGroup(groupId, usuarioId);
    const data = await recipeRepository.deleteGroup(groupId, usuarioId);
    if (!data?.length) {
      return res.status(404).json({
        success: false,
        message: "No se encontró el grupo o no pertenece al usuario",
      });
    }
    return res.json({ success: true, data: data[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "No se pudo eliminar el grupo" });
  }
});

// ========== ELIMINAR RECETA DE GRUPO ==========
router.delete("/groups/:groupId/recipes", authMiddleware, async (req, res) => {
  try {
    const groupId = Number(req.params.groupId);
    const usuarioId = resolveUserId(req);
    const { recipeId } = req.body;
    if (!Number.isFinite(groupId) || !usuarioId || !Number.isFinite(recipeId)) {
      return res.status(400).json({ success: false, message: "Datos inválidos" });
    }
    const data = await recipeRepository.removeRecipeFromGroup({
      grupo_id: groupId,
      receta_id: recipeId,
      usuario_id: usuarioId,
    });
    if (!data?.length) {
      return res.status(404).json({
        success: false,
        message: "No se encontró la relación o no pertenece al usuario",
      });
    }
    return res.json({ success: true, data: data[0] });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No se pudo eliminar la receta del grupo",
    });
  }
});

// ========== ELIMINAR TODAS LAS RECETAS DE UN GRUPO ==========
router.delete("/groups/:groupId/recipes/all", authMiddleware, async (req, res) => {
  try {
    const groupId = Number(req.params.groupId);
    const usuarioId = resolveUserId(req);
    if (!Number.isFinite(groupId) || !usuarioId) {
      return res.status(400).json({ success: false, message: "Datos inválidos" });
    }
    const data = await recipeRepository.removeRecipesAllFromGroup({
      grupo_id: groupId,
      usuario_id: usuarioId,
    });
    if (!data?.length) {
      return res.status(404).json({
        success: false,
        message: "No se encontró el grupo o no pertenece al usuario",
      });
    }
    return res.json({ success: true, data: data[0] });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No se pudieron eliminar las recetas del grupo",
    });
  }
});

// ========== RECETAS DE UN GRUPO ==========
router.get("/groups/:groupId/recipes", authMiddleware, async (req, res) => {
  try {
    const groupId = Number(req.params.groupId);
    const usuarioId = resolveUserId(req);
    if (!Number.isFinite(groupId) || !usuarioId) {
      return res.status(400).json({ success: false, message: "Datos inválidos" });
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

// ========== AGREGAR RECETA A GRUPO ==========
router.post("/groups/:groupId/recipes", authMiddleware, async (req, res) => {
  try {
    const groupId = Number(req.params.groupId);
    const usuarioId = resolveUserId(req);
    const { recipeId } = req.body;
    if (!Number.isFinite(groupId) || !usuarioId || !Number.isFinite(recipeId)) {
      return res.status(400).json({ success: false, message: "Datos inválidos" });
    }
    const data = await recipeRepository.addRecipeToGroup({
      grupo_id: groupId,
      receta_id: recipeId,
      usuario_id: usuarioId,
    });
    if (!data?.length) {
      return res.status(404).json({
        success: false,
        message: "No se encontró la receta, el grupo o no pertenece al usuario",
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

// ---------- LIKE (toggle) ----------
router.post("/recipes/:recipeId/like", authMiddleware, async (req, res) => {
  try {
    const recipeId = Number(req.params.recipeId);
    const usuarioId = resolveUserId(req);
    if (!Number.isFinite(recipeId) || !usuarioId) {
      return res.status(400).json({ success: false, message: "Datos inválidos" });
    }
    // Verificar si ya existe el like
    const existing = await DB.executeQuery(
      "SELECT id FROM likes WHERE receta_id = $1 AND usuario_id = $2",
      [recipeId, usuarioId]
    );
    let liked = false;
    if (existing.length > 0) {
      await DB.executeQuery(
        "DELETE FROM likes WHERE receta_id = $1 AND usuario_id = $2",
        [recipeId, usuarioId]
      );
    } else {
      await DB.executeQuery(
        "INSERT INTO likes (receta_id, usuario_id) VALUES ($1, $2)",
        [recipeId, usuarioId]
      );
      liked = true;
    }
    const likeCount = await DB.executeQuery(
      "SELECT COUNT(*) as count FROM likes WHERE receta_id = $1",
      [recipeId]
    );
    return res.json({
      success: true,
      data: {
        liked,
        likes_count: parseInt(likeCount[0].count, 10)
      }
    });
  } catch (error) {
    console.error("Error en toggle like:", error);
    return res.status(500).json({ success: false, message: "No se pudo procesar el like" });
  }
});

// ---------- EDITAR RECETA (PUT) ----------
router.put("/recipes/:recipeId", authMiddleware, async (req, res) => {
  try {
    const recipeId = Number(req.params.recipeId);
    const usuarioId = resolveUserId(req);
    if (!Number.isFinite(recipeId) || !usuarioId) {
      return res.status(400).json({ success: false, message: "Datos inválidos" });
    }
    // Verificar propiedad
    const owns = await recipeRepository.userOwnsRecipe(usuarioId, recipeId);
    if (!owns) {
      return res.status(403).json({ success: false, message: "No tienes permiso" });
    }
    // Validar payload
    const validation = await recipeBO.validateRecipePayload(req.body);
    if (!validation.success) {
      return res.status(400).json(validation);
    }
    const normalized = await recipeBO.normalizeRecipeParams({
      ...req.body,
      usuario_id: usuarioId,
      id: recipeId
    });
    // Actualizar cabecera de la receta
    await DB.executeQuery(
      `UPDATE recetas SET
        titulo = $1,
        descripcion = $2,
        imagen_key = $3,
        tiempo_coccion = $4,
        dificultad = $5,
        calorias = $6,
        porciones = $7,
        is_public = $8
      WHERE id = $9`,
      [
        normalized.titulo,
        normalized.descripcion,
        normalized.imagen_key,
        normalized.tiempo_coccion,
        normalized.dificultad,
        normalized.calorias,
        normalized.porciones,
        normalized.is_public,
        recipeId
      ]
    );
    // Reemplazar ingredientes
    await DB.executeQuery("DELETE FROM ingredientes WHERE receta_id = $1", [recipeId]);
    await DB.executeQuery("DELETE FROM pasos WHERE receta_id = $1", [recipeId]);
    for (let i = 0; i < req.body.ingredients.length; i++) {
      const ing = req.body.ingredients[i];
      await DB.executeQuery(
        "INSERT INTO ingredientes (receta_id, nombre, cantidad, orden) VALUES ($1, $2, $3, $4)",
        [recipeId, ing.nombre, ing.cantidad, i + 1]
      );
    }
    for (let i = 0; i < req.body.steps.length; i++) {
      const step = req.body.steps[i];
      await DB.executeQuery(
        "INSERT INTO pasos (receta_id, descripcion, orden) VALUES ($1, $2, $3)",
        [recipeId, step.descripcion, i + 1]
      );
    }
    const updatedRecipe = await buildRecipeDetail(recipeId);
    return res.json({ success: true, data: updatedRecipe });
  } catch (error) {
    console.error("Error al editar receta:", error);
    return res.status(500).json({ success: false, message: "No se pudo actualizar la receta" });
  }
});

// ---------- ELIMINAR CUENTA DE USUARIO ----------
router.delete("/user", authMiddleware, async (req, res) => {
  try {
    const usuarioId = resolveUserId(req);
    if (!usuarioId) {
      return res.status(400).json({ success: false, message: "Usuario inválido" });
    }
    await DB.executeQuery("DELETE FROM usuarios WHERE id = $1", [usuarioId]);
    req.session.destroy((err) => {
      if (err) console.error("Error al destruir sesión:", err);
    });
    return res.json({ success: true, message: "Cuenta eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar cuenta:", error);
    return res.status(500).json({ success: false, message: "No se pudo eliminar la cuenta" });
  }
});

export default router;
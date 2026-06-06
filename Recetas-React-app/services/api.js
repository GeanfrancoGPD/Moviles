import { API_URL } from "@env";

const RECIPES_API_URL = `${API_URL}`;

async function requestJson(path, options = {}) {
  const response = await fetch(`${RECIPES_API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await response.text();
  let json = {};

  if (text) {
    try {
      json = JSON.parse(text);
    } catch (error) {
      json = { success: false, message: text };
    }
  }

  if (!response.ok || json.success === false) {
    throw new Error(json.message || `Error en el servidor (${response.status})`);
  }

  return json;
}

// ========== AUTENTICACIÓN ==========
export async function login(gmail, password) {
  const data = await requestJson("/login", {
    method: "POST",
    body: JSON.stringify({ gmail, password }),
  });
  return data.user;
}

export async function logout() {
  await requestJson("/logout", { method: "POST" });
}

export async function updateUserProfile({ id, nombre, gmail }) {
  const data = await requestJson("/profile", {
    method: "PUT",
    body: JSON.stringify({ id, nombre, gmail }),
  });
  return data.data;
}

export async function updatePassword({ id, password }) {
  const data = await requestJson("/password", {
    method: "PUT",
    body: JSON.stringify({ id, password }),
  });
  return data.data;
}

export async function deleteUserAccount(userId) {
  const data = await requestJson("/user", {
    method: "DELETE",
    body: JSON.stringify({ id: userId }),
  });
  return data;
}

// ========== RECETAS ==========
export async function getUserRecipes(usuarioId) {
  const data = await requestJson(`/users/${usuarioId}/recipes`);
  return data.data || [];
}

export async function getPublicRecipes(usuarioId) {
  const query = usuarioId ? `?usuarioId=${encodeURIComponent(usuarioId)}` : "";
  const data = await requestJson(`/public-recipes${query}`);
  return data.data || [];
}

export async function getRecipeById(recipeId) {
  const data = await requestJson(`/recipes/${recipeId}`);
  return data.data;
}

export async function createRecipe(recipe, usuarioId) {
  const data = await requestJson("/recipes", {
    method: "POST",
    body: JSON.stringify({
      titulo: recipe.titulo,
      descripcion: recipe.descripcion || "",
      imagen_key: recipe.imagen_key || "default",
      tiempo_coccion: recipe.tiempo_coccion,
      dificultad: recipe.dificultad,
      calorias: recipe.calorias,
      porciones: recipe.porciones,
      is_public: recipe.is_public,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      wantsGroup: recipe.wantsGroup,
      groupId: recipe.groupId,
      usuario_id: usuarioId,
    }),
  });
  return data.data;
}

export async function updateRecipe(recipeId, recipe, usuarioId) {
  const data = await requestJson(`/recipes/${recipeId}`, {
    method: "PUT",
    body: JSON.stringify({
      titulo: recipe.titulo,
      descripcion: recipe.descripcion || "",
      imagen_key: recipe.imagen_key || "default",
      tiempo_coccion: recipe.tiempo_coccion,
      dificultad: recipe.dificultad,
      calorias: recipe.calorias,
      porciones: recipe.porciones,
      is_public: recipe.is_public,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      usuario_id: usuarioId,
    }),
  });
  return data.data;
}

export async function deleteRecipe(recipeId, usuarioId) {
  const data = await requestJson(`/recipes/${recipeId}?usuarioId=${encodeURIComponent(usuarioId)}`, {
    method: "DELETE",
  });
  return data.data;
}

// ========== LIKES ==========
export async function toggleLike(recipeId, usuarioId) {
  const data = await requestJson(`/recipes/${recipeId}/like`, {
    method: "POST",
    body: JSON.stringify({ usuario_id: usuarioId }),
  });
  return data.data;
}

// ========== GRUPOS ==========
export async function getUserGroups(usuarioId) {
  const data = await requestJson(`/users/${usuarioId}/groups`);
  return data.data || [];
}

export async function createGroup(group) {
  const data = await requestJson("/groups", {
    method: "POST",
    body: JSON.stringify({
      nombre: group.nombre,
      descripcion: group.descripcion || "",
    }),
  });
  return data.data;
}

export async function getGroupById(groupId) {
  const data = await requestJson(`/groups/${groupId}`);
  return data.data;
}

export async function getGroupRecipes(groupId) {
  const data = await requestJson(`/groups/${groupId}/recipes`);
  return data.data || [];
}

export async function addRecipeToGroup(groupId, recipeId) {
  const data = await requestJson(`/groups/${groupId}/recipes`, {
    method: "POST",
    body: JSON.stringify({ recipeId }),
  });
  return data.data;
}

export async function addRecipeToMultipleGroups(recipeId, groupIds) {
  const results = await Promise.all(groupIds.map(groupId => addRecipeToGroup(groupId, recipeId)));
  return results;
}

export async function removeRecipeFromGroup(groupId, recipeId) {
  const data = await requestJson(`/groups/${groupId}/recipes/${recipeId}`, {
    method: "DELETE",
  });
  return data.data;
}

export async function deleteGroup(groupId) {
  const data = await requestJson(`/groups/${groupId}`, { method: "DELETE" });
  return data.data;
}
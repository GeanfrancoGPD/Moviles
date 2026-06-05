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
    throw new Error(
      json.message || `Error en el servidor (${response.status})`,
    );
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

// ========== RECETAS ==========
export async function getUserRecipes(usuarioId) {
  console.log("Obteniendo recetas del usuario:", usuarioId);
  const data = await requestJson(`/users/${usuarioId}/recipes`);
  return data.data || [];
}

export async function getPublicRecipes(usuarioId) {
  console.log("Obteniendo recetas publicas");
  const query = usuarioId ? `?usuarioId=${encodeURIComponent(usuarioId)}` : "";
  const data = await requestJson(`/public-recipes${query}`);
  return data.data || [];
}

export async function getRecipeById(recipeId) {
  console.log("Obteniendo receta por ID:", recipeId);
  const data = await requestJson(`/recipes/${recipeId}`);
  return data.data;
}

export async function createRecipe(recipe, usuarioId) {
  console.log("Creando nueva receta para usuario:", usuarioId);
  console.log("Datos de la receta:", recipe);

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

export async function deleteRecipe(recipeId, usuarioId) {
  if (!usuarioId) {
    throw new Error("Usuario no autenticado");
  }
  console.log("Eliminando receta:", recipeId, "usuario:", usuarioId);
  const data = await requestJson(
    `/recipes/${recipeId}?usuarioId=${encodeURIComponent(usuarioId)}`,
    {
      method: "DELETE",
    },
  );

  return data.data;
}

// ========== GRUPOS ==========

export async function getUserGroups(usuarioId) {
  console.log("Obteniendo grupos del usuario:", usuarioId);
  const data = await requestJson(`/users/${usuarioId}/groups`);
  return data.data || [];
}

export async function createGroup(group) {
  console.log("Creando grupo:", group);

  const data = await requestJson("/groups", {
    method: "POST",
    body: JSON.stringify({
      nombre: group.nombre,
      descripcion: group.descripcion || "",
    }),
  });

  return data.data;
}

export async function getGroupRecipes(groupId) {
  console.log("Obteniendo recetas del grupo:", groupId);

  const data = await requestJson(`/groups/${groupId}/recipes`);

  return data.data || [];
}

export async function addRecipeToGroup(groupId, recipeId) {
  console.log("Agregando receta al grupo:", groupId, recipeId);

  const data = await requestJson(`/groups/${groupId}/recipes`, {
    method: "POST",
    body: JSON.stringify({
      recipeId,
    }),
  });

  return data.data;
}

export async function removeRecipeFromGroup(groupId, recipeId) {
  console.log("Eliminando receta del grupo:", groupId, recipeId);

  const data = await requestJson(`/groups/${groupId}/recipes/${recipeId}`, {
    method: "DELETE",
  });

  return data.data;
}

export async function deleteGroup(groupId) {
  console.log("Eliminando grupo:", groupId);

  const data = await requestJson(`/groups/${groupId}`, {
    method: "DELETE",
  });

  return data.data;
}

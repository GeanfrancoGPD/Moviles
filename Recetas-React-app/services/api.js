// services/api.js
const API_URL = 'http://localhost:5000/api';

async function callToProcess(namequery, params = {}) {
  console.log(`Llamando a ${namequery} con params:`, params);
  
  const response = await fetch(`${API_URL}/toProccess`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ namequery, params }),
    credentials: 'include',
  });
  
  const json = await response.json();
  console.log(`Respuesta de ${namequery}:`, json);
  
  if (!json.success) throw new Error(json.message || 'Error en la consulta');
  return json.data;
}

// ========== AUTENTICACIÓN ==========
export async function login(gmail, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gmail, password }),
    credentials: 'include',
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.user;
}

export async function logout() {
  await fetch(`${API_URL}/logout`, { method: 'POST', credentials: 'include' });
}

// ========== RECETAS ==========
export async function getUserRecipes(usuarioId) {
  console.log('Obteniendo recetas del usuario:', usuarioId);
  return callToProcess('getUserRecipes', { usuario_id: usuarioId });
}

export async function getPublicRecipes(usuarioId) {
  console.log('Obteniendo recetas publicas');
  return callToProcess('getPublicRecipes', { usuario_id: usuarioId });
}

export async function getUserGroups(usuarioId) {
  console.log('Obteniendo grupos del usuario:', usuarioId);
  return callToProcess('getUserGroups', { usuario_id: usuarioId });
}

export async function getRecipeById(recipeId) {
  console.log('Obteniendo receta por ID:', recipeId);
  const recetas = await callToProcess('getRecipeById', { id: recipeId });
  if (!recetas.length) throw new Error('Receta no encontrada');
  const recipe = recetas[0];
  const rawIngredientes = await callToProcess('getIngredientsByRecipe', { receta_id: recipeId });
  const rawPasos = await callToProcess('getStepsByRecipe', { receta_id: recipeId });

  const ingredientesList = Array.isArray(rawIngredientes)
    ? rawIngredientes
    : rawIngredientes?.ingredientes || rawIngredientes?.ingredients || [];

  const pasosList = Array.isArray(rawPasos)
    ? rawPasos
    : rawPasos?.pasos || rawPasos?.steps || [];

  const ingredientes = ingredientesList.map((item) => ({
    ...item,
    nombre: item?.nombre || item?.name || item?.ingrediente || '',
    cantidad: item?.cantidad || item?.quantity || item?.amount || '',
  }));

  const pasos = pasosList.map((item) => ({
    ...item,
    descripcion: item?.descripcion || item?.description || '',
  }));

  return { ...recipe, ingredientes, pasos };
}

export async function createRecipe(recipe, usuarioId) {
  console.log('Creando nueva receta para usuario:', usuarioId);
  console.log('Datos de la receta:', recipe);
  
  try {
    // Crear la receta
    const newRecipe = await callToProcess('createRecipe', {
      titulo: recipe.titulo,
      descripcion: recipe.descripcion || '',
      imagen_key: recipe.imagen_key || 'default',
      tiempo_coccion: recipe.tiempo_coccion,
      dificultad: recipe.dificultad,
      calorias: recipe.calorias,
      porciones: recipe.porciones,
      is_public: recipe.is_public,
      usuario_id: usuarioId,
    });
    
    console.log('Receta creada, respuesta:', newRecipe);
    
    if (!newRecipe || !newRecipe[0] || !newRecipe[0].id) {
      throw new Error('No se pudo obtener el ID de la receta creada');
    }
    
    const recipeId = newRecipe[0].id;
    console.log('ID de la nueva receta:', recipeId);
    
    // Agregar ingredientes
    for (let i = 0; i < recipe.ingredients.length; i++) {
      console.log(`Agregando ingrediente ${i + 1}:`, recipe.ingredients[i]);
      await callToProcess('addIngredient', {
        receta_id: recipeId,
        nombre: recipe.ingredients[i].nombre,
        cantidad: recipe.ingredients[i].cantidad,
        orden: i + 1,
      });
    }
    
    // Agregar pasos
    for (let i = 0; i < recipe.steps.length; i++) {
      console.log(`Agregando paso ${i + 1}:`, recipe.steps[i]);
      await callToProcess('addStep', {
        receta_id: recipeId,
        descripcion: recipe.steps[i].descripcion,
        orden: i + 1,
      });
    }

    // Agregar a grupo si se seleccionó
    if (recipe.wantsGroup && recipe.groupId) {
      console.log('Agregando receta al grupo:', recipe.groupId);
      await callToProcess('addRecipeToGroup', {
        receta_id: recipeId,
        grupo_id: recipe.groupId,
      });
    }

    console.log('RECETA CREADA EXITOSAMENTE');
    return newRecipe[0];
  } catch (error) {
    console.error('Error en createRecipe:', error);
    throw error;
  }
}

export async function deleteRecipe(recipeId, usuarioId) {
  if (!usuarioId) {
    throw new Error('Usuario no autenticado');
  }
  console.log('Eliminando receta:', recipeId, 'usuario:', usuarioId);
  return callToProcess('deleteRecipe', { 
    id: recipeId, 
    usuario_id: usuarioId 
  });
}
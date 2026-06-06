import DB from "../../components/DBComponent.js";

const db = DB;
db.init();

class RecipeRepository {
  async getUserByEmail(gmail) {
    return await db.excecuteNameQuery("getUser", { gmail });
  }

  async createUser(nombre, gmail, password) {
    return await db.excecuteNameQuery("createUser", {
      nombre,
      gmail,
      password,
    });
  }

  async getUserById(id) {
    return await db.excecuteNameQuery("getUserById", { id });
  }

  async getUserRecipes(usuario_id) {
    return await db.excecuteNameQuery("getUserRecipes", { usuario_id });
  }

  async getPublicRecipes() {
    return await db.excecuteNameQuery("getPublicRecipes", {});
  }

  async getRecipeById(id) {
    return await db.excecuteNameQuery("getRecipeById", { id });
  }

  async getIngredientsByRecipe(receta_id) {
    return await db.excecuteNameQuery("getIngredientsByRecipe", { receta_id });
  }

  async getStepsByRecipe(receta_id) {
    return await db.excecuteNameQuery("getStepsByRecipe", { receta_id });
  }

  async createRecipe(recipe) {
    return await db.excecuteNameQuery("createRecipe", recipe);
  }

  async deleteRecipe(id, usuario_id) {
    return await db.excecuteNameQuery("deleteRecipe", { id, usuario_id });
  }

  async addIngredient(ingredient) {
    return await db.excecuteNameQuery("addIngredient", ingredient);
  }

  async addStep(step) {
    return await db.excecuteNameQuery("addStep", step);
  }

  async addRecipeToGroup(recipeGroup) {
    return await db.excecuteNameQuery("addRecipeToGroup", recipeGroup);
  }

  async userOwnsRecipe(usuario_id, id) {
    const result = await db.executeQuery(
      "SELECT id FROM recetas WHERE id = $1 AND usuario_id = $2",
      [id, usuario_id],
    );

    return result.length > 0;
  }

  async createGroup(group) {
    return await db.excecuteNameQuery("createGroup", group);
  }

  async getUserGroups(usuario_id) {
    return await db.excecuteNameQuery("getUserGroups", { usuario_id });
  }

  async getGroupRecipes(grupo_id) {
    return await db.excecuteNameQuery("getGroupRecipes", { grupo_id });
  }

  async getGroupById(id) {
    return await db.excecuteNameQuery("getGroupById", { id });
  }

  async deleteGroup(id, usuario_id) {
    return await db.excecuteNameQuery("deleteGroup", { id, usuario_id });
  }

  async removeRecipeFromGroup(grupo_id, receta_id, usuario_id) {
    // Verificar que el usuario es dueño del grupo
    const group = await this.getGroupById(grupo_id);
    if (!group || group.usuario_id !== usuario_id) {
      return {
        success: false,
        message: "No tienes permiso para modificar este grupo",
      };
    }

    return await db.excecuteNameQuery("removeRecipeFromGroup", {
      grupo_id,
      receta_id,
    });
  }

  async removeRecipesAllFromGroup(grupo_id, usuario_id) {
    // Verificar que el usuario es dueño del grupo
    const group = await this.getGroupById(grupo_id);
    if (!group || group.usuario_id !== usuario_id) {
      return {
        success: false,
        message: "No tienes permiso para modificar este grupo",
      };
    }

    return await db.excecuteNameQuery("removeRecipesAllFromGroup", {
      grupo_id,
    });
  }

  async deleteOwnedRecipesFromGroup(grupo_id, usuario_id) {
    return await db.excecuteNameQuery("deleteOwnedRecipesFromGroup", {
      grupo_id,
      usuario_id,
    });
  }

  async addLike(recipeId, usuarioId) {
    return await db.excecuteNameQuery("addLike", {
      receta_id: recipeId,
      usuario_id: usuarioId,
    });
  }

  async removeLike(recipeId, usuarioId) {
    return await db.excecuteNameQuery("removeLike", {
      receta_id: recipeId,
      usuario_id: usuarioId,
    });
  }

  async putRecipe(id, usuario_id, recipe) {
    // Verificar que el usuario es dueño de la receta
    const ownsRecipe = await this.userOwnsRecipe(usuario_id, id);
    if (!ownsRecipe) {
      return {
        success: false,
        message: "No tienes permiso para modificar esta receta",
      };
    }

    return await db.excecuteNameQuery("putRecipe", {
      id,
      ...recipe,
    });
  }

  async toggleLike(recipeId, usuarioId) {
    // Verificar si ya existe like
    const existing = await DB.excecuteNameQuery("getLikeStatus", {
      receta_id: recipeId,
      usuario_id: usuarioId,
    });

    if (existing && existing.length > 0) {
      // Ya tiene like → lo eliminamos
      await DB.excecuteNameQuery("removeLike", {
        receta_id: recipeId,
        usuario_id: usuarioId,
      });
      return { liked: false };
    } else {
      // No tiene like → lo agregamos
      await DB.excecuteNameQuery("addLike", {
        receta_id: recipeId,
        usuario_id: usuarioId,
      });
      return { liked: true };
    }
  }
}

export default new RecipeRepository();

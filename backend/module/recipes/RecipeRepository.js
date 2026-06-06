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
  // ==========  LIKES ==========
  async getLikeStatus(receta_id, usuario_id) {
    return await db.excecuteNameQuery("getLikeStatus", { receta_id, usuario_id });
  }

  async addLike(receta_id, usuario_id) {
    return await db.excecuteNameQuery("addLike", { receta_id, usuario_id });
  }

  async removeLike(receta_id, usuario_id) {
    return await db.excecuteNameQuery("removeLike", { receta_id, usuario_id });
  }

  async getLikeCount(receta_id) {
    return await db.excecuteNameQuery("getLikeCount", { receta_id });
  }
}

export default new RecipeRepository();
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
}

export default new RecipeRepository();

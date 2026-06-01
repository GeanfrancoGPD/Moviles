import app from "./util/middleware.js";
import recipeRouter from "./module/recipes/RecipeRouter.js";

app.use("/api/recipes", recipeRouter);

const port = process.env.PORT || 5000;

// --- START ---
app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor ejecutandose en el puerto ${port}`);
});

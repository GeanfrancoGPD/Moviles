import { Dispatcher } from "./components/Dispatcher.js";
import app from "./util/middleware.js";

const port = process.env.PORT || 5000;
const dispatcher = new Dispatcher();
dispatcher.init(app);

// --- START ---
app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor ejecutandose en el puerto ${port}`);
});

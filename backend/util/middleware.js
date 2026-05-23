import session from "express-session";
import express from "express";
import cors from "cors";

const app = express();

// Railway usa proxy
app.set("trust proxy", 1);

// --- CORS global ---
app.use(
  cors({
    origin: ["http://localhost:8081", "http://localhost:8082", "http://localhost:19006", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

// JSON
app.use(express.json());

app.use(
  session({
    secret: "mi-clave-secreta",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: false, // Cambia a true en producción con HTTPS
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
    },
  }),
);

export default app;

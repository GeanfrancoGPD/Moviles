import { DB } from "./DBComponent.js";
import { Session } from "./session.js";
import UtilBycript from "../util/bycript.js";
import Validator from "../util/validator.js";

export class Dispatcher {
  constructor() {
    this.DBPool = new DB();
    this.sessionComponent = new Session();
    this.utilBycript = new UtilBycript();
    this.validator = new Validator();
  }

  init(app) {
    this.DBPool.init();
    this.app = app;
    this.registerRoutes();
  }

  registerRoutes() {
    this.app.post("/api/login", async (req, res) => {
      await this.login({ request: req, response: res });
    });

    this.app.post("/api/register", async (req, res) => {
      await this.registerUser({ request: req, response: res });
    });

    this.app.post("/api/logout", (req, res) => {
      this.destroy({ request: req, response: res });
    });

    this.app.post("/api/toProccess", (req, res) => {
      this.toProccess({ request: req, response: res });
    });
  }

  existSession(sessionObject) {
    return this.sessionComponent.sessionExist(sessionObject);
  }

  async login(sessionObject) {
    const { gmail, password } = sessionObject.request.body;

    if (!gmail || !password) {
      return sessionObject.response.status(400).json({
        success: false,
        message: "Correo electrónico y contraseña son requeridos",
      });
    }

    const emailValidation = await this.validator.validateEmail(gmail);

    if (!emailValidation.success) {
      return sessionObject.response.status(400).json({
        success: false,
        message: "Correo electrónico inválido",
      });
    }

    const passwordValidation = await this.validator.validatePassword(password);

    if (!passwordValidation.success) {
      return sessionObject.response.status(400).json({
        success: false,
        message: passwordValidation.error.issues[0].message,
      });
    }

    const user = await this.DBPool.excecuteNameQuery("getUser", { gmail });
    if (user.length === 0) {
      return sessionObject.response
        .status(401)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    const isPasswordValid = await this.utilBycript.compare(
      password,
      user[0].password,
    );

    if (!isPasswordValid) {
      return sessionObject.response.status(401).json({
        success: false,
        message: "contraseña incorrecta",
      });
    }

    await this.sessionComponent.createSession(sessionObject, user);
  }

  async registerUser(sessionObject) {
    const { nombre, gmail, password } = sessionObject.request.body;
    console.log("datos:", nombre, gmail, password);

    if (!gmail || !password || !nombre) {
      return sessionObject.response.status(402).json({
        success: false,
        message: "Todos los datos son requeridos",
      });
    }

    const nameValidation = await this.validator.validateUsername(nombre);

    if (!nameValidation.success) {
      return sessionObject.response.status(400).json({
        success: false,
        message: nameValidation.error.issues[0].message,
      });
    }

    const emailValidation = await this.validator.validateEmail(gmail);

    if (!emailValidation.success) {
      return sessionObject.response.status(400).json({
        success: false,
        message: "Correo electrónico inválido",
      });
    }

    const passwordValidation = await this.validator.validatePassword(password);

    if (!passwordValidation.success) {
      return sessionObject.response.status(400).json({
        success: false,
        message: passwordValidation.error.issues[0].message,
      });
    }

    const existingUser = await this.DBPool.excecuteNameQuery("getUser", {
      gmail,
    });
    if (existingUser.length > 0) {
      return sessionObject.response.status(409).json({
        success: false,
        message: "El correo electrónico ya está registrado",
      });
    }

    const hashedPassword = await this.utilBycript.hash(password);

    await this.DBPool.executeQuery(
      "INSERT INTO usuarios (nombre, gmail, password) VALUES ($1, $2, $3)",
      [nombre, gmail, hashedPassword],
    );

    sessionObject.response.json({
      success: true,
      message: "Se ha creado el usuario correctamente",
    });
  }

  async toProccess(sessionObject) {
    // if (!this.existSession(sessionObject)) {
    //   return sessionObject.response.status(401).json({
    //     success: false,
    //     message: "No autorizado",
    //   });
    // }

    const { namequery, params } = sessionObject.request.body;

    try {
      const result = await this.DBPool.excecuteNameQuery(namequery, params);
      sessionObject.response.json({
        success: true,
        data: result,
      });
    } catch (error) {
      sessionObject.response.status(500).json({
        success: false,
        message: "Error al ejecutar la consulta",
      });
    }
  }

  destroy(sessionObject) {
    this.sessionComponent.destroySession(sessionObject);
  }
}

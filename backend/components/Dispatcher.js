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
    const { email, password } = sessionObject.request.body;

    if (!email || !password) {
      return sessionObject.response.status(400).json({
        success: false,
        message: "Email y contraseña son requeridos",
      });
    }

    if (!this.validator.validateEmail(email)) {
      return sessionObject.response.status(400).json({
        success: false,
        mensaje: "",
      });
    }
    const user = await this.DBPool.executeQuery(
      "getUser",
      [email]
    );

    if (user.length === 0) {
      return sessionObject.response
        .status(401)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    const isPasswordValid = await this.utilBycript.compare(
      password,
      user[0].password
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
    const { nombre, email, password, tipo_usuario } =
      sessionObject.request.body;

    if (!email || !password || !nombre) {
      return sessionObject.response.status(402).json({
        success: false,
        message: "Todos los datos son requeridos",
      });
    }

    // Si no se especifica tipo_usuario, usar el ID del tipo "Cliente"
    let tipoFinal = tipo_usuario;
    if (!tipo_usuario) {
      const tipoCliente = await this.DBPool.executeQuery(
        "SELECT id_tipo_usuario FROM Tipos_usuario WHERE de_tipo_usuario = 'Cliente'"
      );
      if (tipoCliente.length === 0) {
        return sessionObject.response.status(500).json({
          success: false,
          message: "No se encontró el tipo de usuario 'Cliente'",
        });
      }
      tipoFinal = tipoCliente[0].id_tipo_usuario;
    }

    const hashedPassword = await this.utilBycript.hash(password);

    await this.DBPool.executeQuery(
      "INSERT INTO usuario (nombre, email, password, id_tipo_usuario) VALUES ($1, $2, $3, $4)",
      [nombre, email, hashedPassword, tipoFinal]
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

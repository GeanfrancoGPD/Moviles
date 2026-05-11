import { Pool } from "pg";
import fs from "fs";
import { log } from "console";
import dotenv  from "dotenv";

dotenv.config();

export class DB {
  constructor() {}

  async init() {
    try{
      this.pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        max: process.env.DB_MAX || 20,
        idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT || 30000,
        connectionTimeoutMillis: process.env.DB_CONN_TIMEOUT || 2000,
        ssl: false,
      });
      const client = await this.pool.connect();

      console.log("Base de datos inicializada correctamente");
      console.log("Conexión exitosa a PostgreSQL");

      client.release();
    }catch(error){
      console.error("Error al inicializar la base de datos:", error);
    }
    
    this.loadQueries();
  }

  async loadQueries() {
    try {
      const data = fs.readFileSync("./data/query.json", "utf8");
      this.queries = JSON.parse(data);
    } catch (error) {
      console.error("Error al cargar query.json:", error);
    }
  }

  async executeQuery(query, params = []) {
    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async excecuteNameQuery(nameQuery, params = {}) {
    try {
      const query = this.queries[nameQuery].query;
      const values = Object.values(params);

      const result = await this.pool.query(query, values);
      console.log("resultado:", result.rows);

      return result.rows;
    } catch (error) {
      console.error("Error no se encuentra la consulta:", error);
    }
  }
}

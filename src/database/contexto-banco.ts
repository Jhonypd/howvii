import dotenv from "dotenv";
import sql from "mssql";

dotenv.config({ quiet: true });

export const configuracaoBanco: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || "localhost",
  port: Number(process.env.DB_PORT || 1433),
  database: process.env.DB_DATABASE || "how_vii",
  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE !== "false",
  },
};

export class ContextoBanco {
  private readonly pool = new sql.ConnectionPool(configuracaoBanco);

  async conectar(): Promise<void> {
    await this.pool.connect();
  }

  criarRequisicao(): sql.Request {
    return this.pool.request();
  }

  async fechar(): Promise<void> {
    await this.pool.close();
  }
}

require("dotenv").config({ quiet: true });

const sql = require("mssql");

const configuracaoBanco = {
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

function criarPool() {
  return new sql.ConnectionPool(configuracaoBanco);
}

module.exports = { configuracaoBanco, criarPool };

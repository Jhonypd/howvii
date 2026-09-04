require("dotenv").config();

const sql = require("mssql");

const configuracao = {
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

const consulta = `
  SELECT
      p.id AS id_venda,
      p.data_pagamento,
      p.valor_pagamento,
      i.codigo_imovel,
      i.descricao AS descricao_imovel,
      t.descricao AS tipo_imovel
  FROM pagamentos AS p
  INNER JOIN imoveis AS i
      ON i.id = p.id_imovel
  INNER JOIN tipos_imovel AS t
      ON t.id = i.id_tipo_imovel
  ORDER BY p.data_pagamento, p.id;
`;

async function consultarPagamentos() {
  let conexao;

  try {
    conexao = await sql.connect(configuracao);
    const resultado = await conexao.request().query(consulta);

    console.table(resultado.recordset);
    return resultado.recordset;
  } catch (erro) {
    console.error("Erro ao consultar os pagamentos:", erro.message);
    throw erro;
  } finally {
    if (conexao) {
      await conexao.close();
    }
  }
}

consultarPagamentos().catch(() => {
  process.exitCode = 1;
});

module.exports = { consultarPagamentos };

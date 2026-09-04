const express = require("express");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const { criarRotasRelatorios } = require("./routes/relatorio-routes");

function criarAplicacao(servicoRelatorios) {
  const aplicacao = express();
  const caminhoOpenApi = path.resolve(__dirname, "..", "docs", "openapi.yaml");

  aplicacao.disable("x-powered-by");

  aplicacao.get("/openapi.yaml", (requisicao, resposta) => {
    resposta.sendFile(caminhoOpenApi);
  });

  aplicacao.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(null, {
      customSiteTitle: "API de Pagamentos Imobiliários",
      swaggerOptions: { url: "/openapi.yaml" },
    }),
  );

  aplicacao.use(criarRotasRelatorios(servicoRelatorios));

  aplicacao.use((erro, requisicao, resposta, proximo) => {
    console.error("Erro ao processar a requisição:", erro.message);
    resposta.status(500).json({ erro: "Erro interno ao processar os dados." });
  });

  return aplicacao;
}

module.exports = { criarAplicacao };

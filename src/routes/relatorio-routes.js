const express = require("express");

function criarManipulador(obterRelatorio) {
  return async (requisicao, resposta, proximo) => {
    try {
      resposta.json(await obterRelatorio());
    } catch (erro) {
      proximo(erro);
    }
  };
}

function criarRotasRelatorios(relatorioService) {
  const rotas = express.Router();

  rotas.get(
    "/pagamentos/por-imovel",
    criarManipulador(() => relatorioService.pagamentosPorImovel()),
  );
  rotas.get(
    "/vendas/por-mes-ano",
    criarManipulador(() => relatorioService.vendasPorMesAno()),
  );
  rotas.get(
    "/vendas/percentual-por-tipo",
    criarManipulador(() => relatorioService.percentualVendasPorTipo()),
  );

  return rotas;
}

module.exports = { criarRotasRelatorios };

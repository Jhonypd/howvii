const assert = require("node:assert/strict");
const test = require("node:test");

const {
  PagamentoRepository,
  consultaPagamentos,
} = require("../../dist/src/repositories/pagamento-repository");
const { RelatorioService } = require("../../dist/src/services/relatorio-service");

test("PagamentoRepository executa a consulta completa usando o pool recebido", async () => {
  const pagamentos = [{ id_venda: "pagamento-1", codigo_imovel: 1001 }];
  let sqlExecutado;
  const contextoBanco = {
    criarRequisicao() {
      return {
        async query(sql) {
          sqlExecutado = sql;
          return { recordset: pagamentos };
        },
      };
    },
  };
  const repository = new PagamentoRepository(contextoBanco);

  assert.strictEqual(await repository.listarTodos(), pagamentos);
  assert.equal(sqlExecutado, consultaPagamentos);
  assert.doesNotMatch(sqlExecutado, /\b(?:WHERE|GROUP\s+BY|SUM|COUNT)\b/i);
});

test("RelatorioService reutiliza o repositório e processa os dados em memória", async () => {
  let quantidadeConsultas = 0;
  const repository = {
    async listarTodos() {
      quantidadeConsultas += 1;
      return [
        {
          codigo_imovel: 1001,
          data_pagamento: "2026-01-05",
          valor_pagamento: 1800,
          tipo_imovel: "Apartamento",
        },
      ];
    },
  };
  const service = new RelatorioService(repository);

  assert.deepEqual(await service.pagamentosPorImovel(), [
    { codigo_imovel: 1001, total_pagamentos: 1800 },
  ]);
  assert.deepEqual(await service.vendasPorMesAno(), [
    { mes_ano: "01/2026", total_vendas: 1800 },
  ]);
  assert.deepEqual(await service.percentualVendasPorTipo(), [
    { tipo_imovel: "Apartamento", percentual_vendas: 100 },
  ]);
  assert.equal(quantidadeConsultas, 3);
});

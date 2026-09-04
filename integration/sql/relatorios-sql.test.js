const assert = require("node:assert/strict");
const test = require("node:test");

const { criarPool } = require("../../src/config/database");
const { PagamentoRepository } = require("../../src/repositories/pagamento-repository");
const {
  listarPagamentosPorImovel,
  listarPercentualVendasPorTipo,
  listarVendasPorMesAno,
} = require("../../src/services/calculos-relatorios");

test("confere os relatórios com uma consulta somente de leitura no SQL Server", async () => {
  const pool = criarPool();

  try {
    await pool.connect();
    const pagamentos = await new PagamentoRepository(pool).listarTodos();
    const pagamentosPorImovel = listarPagamentosPorImovel(pagamentos);

    assert.equal(pagamentos.length, 30);
    assert.equal(
      pagamentosPorImovel.reduce((total, item) => total + item.total_pagamentos, 0),
      95000,
    );
    assert.deepEqual(
      pagamentosPorImovel.find((item) => item.codigo_imovel === 1001),
      { codigo_imovel: 1001, total_pagamentos: 7200 },
    );
    assert.deepEqual(listarVendasPorMesAno(pagamentos), [
      { mes_ano: "01/2026", total_vendas: 18900 },
      { mes_ano: "02/2026", total_vendas: 19600 },
      { mes_ano: "03/2026", total_vendas: 20300 },
      { mes_ano: "04/2026", total_vendas: 16600 },
      { mes_ano: "05/2026", total_vendas: 19600 },
    ]);
    assert.deepEqual(listarPercentualVendasPorTipo(pagamentos), [
      { tipo_imovel: "Apartamento", percentual_vendas: 36.67 },
      { tipo_imovel: "Casa", percentual_vendas: 33.33 },
      { tipo_imovel: "Sala Comercial", percentual_vendas: 30 },
    ]);
  } finally {
    await pool.close();
  }
});

const assert = require("node:assert/strict");
const test = require("node:test");

const {
  listarPagamentosPorImovel,
  listarPercentualVendasPorTipo,
  listarVendasPorMesAno,
} = require("../../dist/src/services/calculos-relatorios");

const pagamentos = [
  {
    codigo_imovel: 1001,
    data_pagamento: new Date("2026-01-05T00:00:00.000Z"),
    valor_pagamento: 1800,
    tipo_imovel: "Apartamento",
  },
  {
    codigo_imovel: 1002,
    data_pagamento: "2026-01-08",
    valor_pagamento: 2200,
    tipo_imovel: "Apartamento",
  },
  {
    codigo_imovel: 1001,
    data_pagamento: "2026-02-05",
    valor_pagamento: 1800,
    tipo_imovel: "Apartamento",
  },
  {
    codigo_imovel: 2001,
    data_pagamento: "2026-02-10",
    valor_pagamento: 2800,
    tipo_imovel: "Casa",
  },
];

test("soma todos os pagamentos por código público do imóvel", () => {
  assert.deepEqual(listarPagamentosPorImovel(pagamentos), [
    { codigo_imovel: 1001, total_pagamentos: 3600 },
    { codigo_imovel: 1002, total_pagamentos: 2200 },
    { codigo_imovel: 2001, total_pagamentos: 2800 },
  ]);
});

test("soma as vendas por mês e ano em ordem cronológica", () => {
  assert.deepEqual(listarVendasPorMesAno(pagamentos), [
    { mes_ano: "01/2026", total_vendas: 4000 },
    { mes_ano: "02/2026", total_vendas: 4600 },
  ]);
});

test("calcula o percentual quantitativo por tipo de imóvel", () => {
  assert.deepEqual(listarPercentualVendasPorTipo(pagamentos), [
    { tipo_imovel: "Apartamento", percentual_vendas: 75 },
    { tipo_imovel: "Casa", percentual_vendas: 25 },
  ]);
});

test("retorna percentuais vazios quando não há vendas", () => {
  assert.deepEqual(listarPercentualVendasPorTipo([]), []);
});

test("retorna listas vazias nos três relatórios quando não há dados", () => {
  assert.deepEqual(listarPagamentosPorImovel([]), []);
  assert.deepEqual(listarVendasPorMesAno([]), []);
  assert.deepEqual(listarPercentualVendasPorTipo([]), []);
});

test("soma valores monetários utilizando centavos inteiros", () => {
  const valoresDecimais = [
    {
      codigo_imovel: 1001,
      data_pagamento: "2026-01-01",
      valor_pagamento: 0.1,
      tipo_imovel: "Apartamento",
    },
    {
      codigo_imovel: 1001,
      data_pagamento: "2026-01-02",
      valor_pagamento: "0.20",
      tipo_imovel: "Apartamento",
    },
  ];

  assert.deepEqual(listarPagamentosPorImovel(valoresDecimais), [
    { codigo_imovel: 1001, total_pagamentos: 0.3 },
  ]);
  assert.deepEqual(listarVendasPorMesAno(valoresDecimais), [
    { mes_ano: "01/2026", total_vendas: 0.3 },
  ]);
});

test("não modifica os registros recebidos", () => {
  const copia = pagamentos.map((pagamento) => ({ ...pagamento }));

  listarPagamentosPorImovel(pagamentos);
  listarVendasPorMesAno(pagamentos);
  listarPercentualVendasPorTipo(pagamentos);

  assert.deepEqual(pagamentos, copia);
});

test("usa o mês UTC para datas retornadas pelo SQL Server", () => {
  const registro = {
    codigo_imovel: 1001,
    data_pagamento: new Date("2026-02-01T00:00:00.000Z"),
    valor_pagamento: 100,
    tipo_imovel: "Apartamento",
  };

  assert.deepEqual(listarVendasPorMesAno([registro]), [
    { mes_ano: "02/2026", total_vendas: 100 },
  ]);
});

test("separa o mesmo mês em anos diferentes e ordena cronologicamente", () => {
  const registros = [
    {
      codigo_imovel: 1001,
      data_pagamento: "2026-01-10",
      valor_pagamento: 200,
      tipo_imovel: "Apartamento",
    },
    {
      codigo_imovel: 1001,
      data_pagamento: "2025-02-10",
      valor_pagamento: 300,
      tipo_imovel: "Apartamento",
    },
    {
      codigo_imovel: 1001,
      data_pagamento: "2025-01-10",
      valor_pagamento: 100,
      tipo_imovel: "Apartamento",
    },
  ];

  assert.deepEqual(listarVendasPorMesAno(registros), [
    { mes_ano: "01/2025", total_vendas: 100 },
    { mes_ano: "02/2025", total_vendas: 300 },
    { mes_ano: "01/2026", total_vendas: 200 },
  ]);
});

test("calcula o percentual pela quantidade, independentemente dos valores", () => {
  const registros = [
    {
      codigo_imovel: 1001,
      data_pagamento: "2026-01-01",
      valor_pagamento: 1,
      tipo_imovel: "Apartamento",
    },
    {
      codigo_imovel: 2001,
      data_pagamento: "2026-01-02",
      valor_pagamento: 99999,
      tipo_imovel: "Casa",
    },
  ];

  assert.deepEqual(listarPercentualVendasPorTipo(registros), [
    { tipo_imovel: "Apartamento", percentual_vendas: 50 },
    { tipo_imovel: "Casa", percentual_vendas: 50 },
  ]);
});

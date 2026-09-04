const assert = require("node:assert/strict");
const test = require("node:test");

const { criarAplicacao } = require("../../src/app");

function iniciarServidor(servicoRelatorios) {
  const servidor = criarAplicacao(servicoRelatorios).listen(0);
  const { port } = servidor.address();

  return {
    servidor,
    url: `http://127.0.0.1:${port}`,
  };
}

test("expõe os três relatórios como respostas JSON", async (contexto) => {
  const respostas = {
    pagamentos: [{ codigo_imovel: 1001, total_pagamentos: 7200 }],
    meses: [{ mes_ano: "01/2026", total_vendas: 18900 }],
    tipos: [{ tipo_imovel: "Apartamento", percentual_vendas: 36.67 }],
  };
  const servico = {
    pagamentosPorImovel: async () => respostas.pagamentos,
    vendasPorMesAno: async () => respostas.meses,
    percentualVendasPorTipo: async () => respostas.tipos,
  };
  const { servidor, url } = iniciarServidor(servico);
  contexto.after(() => servidor.close());

  const casos = [
    ["/pagamentos/por-imovel", respostas.pagamentos],
    ["/vendas/por-mes-ano", respostas.meses],
    ["/vendas/percentual-por-tipo", respostas.tipos],
  ];

  for (const [caminho, esperado] of casos) {
    const resposta = await fetch(`${url}${caminho}`);

    assert.equal(resposta.status, 200);
    assert.match(resposta.headers.get("content-type"), /^application\/json/);
    assert.deepEqual(await resposta.json(), esperado);
  }
});

test("retorna o erro padronizado quando o serviço falha", async (contexto) => {
  const erro = new Error("falha simulada");
  const servico = {
    pagamentosPorImovel: async () => Promise.reject(erro),
  };
  const { servidor, url } = iniciarServidor(servico);
  contexto.after(() => servidor.close());

  const resposta = await fetch(`${url}/pagamentos/por-imovel`);

  assert.equal(resposta.status, 500);
  assert.match(resposta.headers.get("content-type"), /^application\/json/);
  assert.deepEqual(await resposta.json(), {
    erro: "Erro interno ao processar os dados.",
  });
});

test("disponibiliza a especificação OpenAPI e a interface Swagger", async (contexto) => {
  const { servidor, url } = iniciarServidor({});
  contexto.after(() => servidor.close());

  const respostaOpenApi = await fetch(`${url}/openapi.yaml`);
  const respostaSwagger = await fetch(`${url}/docs`);

  assert.equal(respostaOpenApi.status, 200);
  assert.match(await respostaOpenApi.text(), /^openapi: 3\.0\.3/m);
  assert.equal(respostaSwagger.status, 200);
  assert.match(await respostaSwagger.text(), /API de Pagamentos Imobiliários/);
});

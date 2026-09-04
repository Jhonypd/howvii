const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const YAML = require("yaml");

test("mantém os três serviços implementados documentados no OpenAPI", () => {
  const caminho = path.resolve(__dirname, "..", "..", "docs", "openapi.yaml");
  const documento = YAML.parse(fs.readFileSync(caminho, "utf8"));

  assert.equal(documento.openapi, "3.0.3");
  assert.equal(documento.servers[0].url, "/");
  assert.deepEqual(Object.keys(documento.paths).sort(), [
    "/pagamentos/por-imovel",
    "/vendas/percentual-por-tipo",
    "/vendas/por-mes-ano",
  ]);

  for (const caminhoServico of Object.keys(documento.paths)) {
    assert.ok(documento.paths[caminhoServico].get.responses["200"]);
    assert.ok(documento.paths[caminhoServico].get.responses["500"]);
  }
});

test("descreve os campos, tipos e exemplos retornados pela implementação", () => {
  const caminho = path.resolve(__dirname, "..", "..", "docs", "openapi.yaml");
  const documento = YAML.parse(fs.readFileSync(caminho, "utf8"));
  const contratos = {
    "/pagamentos/por-imovel": {
      schema: "PagamentosPorImovel",
      campos: { codigo_imovel: "integer", total_pagamentos: "number" },
    },
    "/vendas/por-mes-ano": {
      schema: "VendasPorMesAno",
      campos: { mes_ano: "string", total_vendas: "number" },
    },
    "/vendas/percentual-por-tipo": {
      schema: "PercentualVendasPorTipo",
      campos: { tipo_imovel: "string", percentual_vendas: "number" },
    },
  };

  for (const [rota, contrato] of Object.entries(contratos)) {
    const conteudo = documento.paths[rota].get.responses["200"].content["application/json"];
    const schema = documento.components.schemas[contrato.schema];

    assert.equal(conteudo.schema.type, "array");
    assert.equal(conteudo.schema.items.$ref, `#/components/schemas/${contrato.schema}`);
    assert.deepEqual(schema.required.sort(), Object.keys(contrato.campos).sort());

    for (const [campo, tipo] of Object.entries(contrato.campos)) {
      assert.equal(schema.properties[campo].type, tipo);
      assert.equal(typeof conteudo.example[0][campo], tipo === "integer" ? "number" : tipo);
    }
  }
});

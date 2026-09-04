const consultaPagamentos = `
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

class PagamentoRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async listarTodos() {
    const resultado = await this.pool.request().query(consultaPagamentos);
    return resultado.recordset;
  }
}

module.exports = { consultaPagamentos, PagamentoRepository };

import { ContextoBanco } from "../database/contexto-banco";
import { Pagamento } from "../entities/pagamento";

export const consultaPagamentos = `
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

export class PagamentoRepository {
  constructor(private readonly contextoBanco: Pick<ContextoBanco, "criarRequisicao">) {}

  async listarTodos(): Promise<Pagamento[]> {
    const resultado = await this.contextoBanco
      .criarRequisicao()
      .query<Pagamento>(consultaPagamentos);
    return resultado.recordset;
  }
}

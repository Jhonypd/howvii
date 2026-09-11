export interface Pagamento {
  id_venda?: string;
  data_pagamento: Date | string;
  valor_pagamento: number | string;
  codigo_imovel: number;
  descricao_imovel?: string;
  tipo_imovel: string;
}

export interface PagamentosPorImovel {
  codigo_imovel: number;
  total_pagamentos: number;
}

export interface VendasPorMesAno {
  mes_ano: string;
  total_vendas: number;
}

export interface PercentualVendasPorTipo {
  tipo_imovel: string;
  percentual_vendas: number;
}

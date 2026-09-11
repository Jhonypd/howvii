import {
  Pagamento,
  PagamentosPorImovel,
  PercentualVendasPorTipo,
  VendasPorMesAno,
} from "../entities/pagamento";

function converterParaCentavos(valor: number | string): number {
  const resultado = /^([+-]?)(\d+)(?:\.(\d+))?$/.exec(String(valor).trim());

  if (!resultado) {
    throw new TypeError(`Valor de pagamento inválido: ${valor}`);
  }

  const sinal = resultado[1] === "-" ? -1 : 1;
  const parteInteira = Number(resultado[2]);
  const parteDecimal = resultado[3] || "";
  const centavosDecimais = Number(parteDecimal.padEnd(2, "0").slice(0, 2));
  const arredondamento = Number(parteDecimal[2] || 0) >= 5 ? 1 : 0;
  const centavos = parteInteira * 100 + centavosDecimais + arredondamento;

  if (!Number.isSafeInteger(centavos)) {
    throw new TypeError(`Valor de pagamento fora do limite seguro: ${valor}`);
  }

  return sinal * centavos;
}

function somarCentavosPorChave<Chave>(
  registros: Pagamento[],
  obterChave: (registro: Pagamento) => Chave,
): Map<Chave, number> {
  return registros.reduce((totais, registro) => {
    const chave = obterChave(registro);
    const totalAtual = totais.get(chave) || 0;
    const novoTotal = totalAtual + converterParaCentavos(registro.valor_pagamento);

    if (!Number.isSafeInteger(novoTotal)) {
      throw new TypeError(`Total de pagamentos fora do limite seguro para a chave: ${chave}`);
    }

    totais.set(chave, novoTotal);
    return totais;
  }, new Map<Chave, number>());
}

export function listarPagamentosPorImovel(pagamentos: Pagamento[]): PagamentosPorImovel[] {
  const totais = somarCentavosPorChave(
    pagamentos,
    (pagamento) => pagamento.codigo_imovel,
  );

  return Array.from(totais, ([codigo_imovel, totalCentavos]) => ({
    codigo_imovel,
    total_pagamentos: totalCentavos / 100,
  })).sort((a, b) => a.codigo_imovel - b.codigo_imovel);
}

function extrairPeriodo(dataPagamento: Date | string): { ano: number; mes: number } {
  if (dataPagamento instanceof Date && !Number.isNaN(dataPagamento.getTime())) {
    return {
      ano: dataPagamento.getUTCFullYear(),
      mes: dataPagamento.getUTCMonth() + 1,
    };
  }

  const resultado = /^(\d{4})-(\d{2})/.exec(String(dataPagamento));

  if (!resultado) {
    throw new TypeError(`Data de pagamento inválida: ${dataPagamento}`);
  }

  return { ano: Number(resultado[1]), mes: Number(resultado[2]) };
}

export function listarVendasPorMesAno(pagamentos: Pagamento[]): VendasPorMesAno[] {
  const totais = somarCentavosPorChave(pagamentos, (pagamento) => {
    const { ano, mes } = extrairPeriodo(pagamento.data_pagamento);
    return `${ano}-${String(mes).padStart(2, "0")}`;
  });

  return Array.from(totais, ([periodo, totalCentavos]) => {
    const [ano, mes] = periodo.split("-");

    return {
      mes_ano: `${mes}/${ano}`,
      total_vendas: totalCentavos / 100,
      periodo,
    };
  })
    .sort((a, b) => a.periodo.localeCompare(b.periodo))
    .map(({ mes_ano, total_vendas }) => ({ mes_ano, total_vendas }));
}

export function listarPercentualVendasPorTipo(
  pagamentos: Pagamento[],
): PercentualVendasPorTipo[] {
  if (pagamentos.length === 0) {
    return [];
  }

  const quantidades = pagamentos.reduce((totais, pagamento) => {
    const tipo = pagamento.tipo_imovel;
    totais.set(tipo, (totais.get(tipo) || 0) + 1);
    return totais;
  }, new Map<string, number>());

  return Array.from(quantidades, ([tipo_imovel, quantidade]) => ({
    tipo_imovel,
    percentual_vendas: Number(((quantidade / pagamentos.length) * 100).toFixed(2)),
  })).sort((a, b) => a.tipo_imovel.localeCompare(b.tipo_imovel, "pt-BR"));
}

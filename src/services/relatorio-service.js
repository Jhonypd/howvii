const {
  listarPagamentosPorImovel,
  listarPercentualVendasPorTipo,
  listarVendasPorMesAno,
} = require("./calculos-relatorios");

class RelatorioService {
  constructor(pagamentoRepository) {
    this.pagamentoRepository = pagamentoRepository;
  }

  async pagamentosPorImovel() {
    const pagamentos = await this.pagamentoRepository.listarTodos();
    return listarPagamentosPorImovel(pagamentos);
  }

  async vendasPorMesAno() {
    const pagamentos = await this.pagamentoRepository.listarTodos();
    return listarVendasPorMesAno(pagamentos);
  }

  async percentualVendasPorTipo() {
    const pagamentos = await this.pagamentoRepository.listarTodos();
    return listarPercentualVendasPorTipo(pagamentos);
  }
}

module.exports = { RelatorioService };

import { PagamentoRepository } from "../repositories/pagamento-repository";
import {
  listarPagamentosPorImovel,
  listarPercentualVendasPorTipo,
  listarVendasPorMesAno,
} from "./calculos-relatorios";
import {
  PagamentosPorImovel,
  PercentualVendasPorTipo,
  VendasPorMesAno,
} from "../entities/pagamento";

export class RelatorioService {
  constructor(private readonly pagamentoRepository: Pick<PagamentoRepository, "listarTodos">) {}

  async pagamentosPorImovel(): Promise<PagamentosPorImovel[]> {
    const pagamentos = await this.pagamentoRepository.listarTodos();
    return listarPagamentosPorImovel(pagamentos);
  }

  async vendasPorMesAno(): Promise<VendasPorMesAno[]> {
    const pagamentos = await this.pagamentoRepository.listarTodos();
    return listarVendasPorMesAno(pagamentos);
  }

  async percentualVendasPorTipo(): Promise<PercentualVendasPorTipo[]> {
    const pagamentos = await this.pagamentoRepository.listarTodos();
    return listarPercentualVendasPorTipo(pagamentos);
  }
}

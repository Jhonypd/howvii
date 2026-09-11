import { NextFunction, Request, Response } from "express";
import { RelatorioService } from "../services/relatorio-service";

export class RelatorioController {
  constructor(private readonly relatorioService: RelatorioService) {}

  pagamentosPorImovel = async (
    _requisicao: Request,
    resposta: Response,
    proximo: NextFunction,
  ): Promise<void> => {
    try {
      resposta.json(await this.relatorioService.pagamentosPorImovel());
    } catch (erro) {
      proximo(erro);
    }
  };

  vendasPorMesAno = async (
    _requisicao: Request,
    resposta: Response,
    proximo: NextFunction,
  ): Promise<void> => {
    try {
      resposta.json(await this.relatorioService.vendasPorMesAno());
    } catch (erro) {
      proximo(erro);
    }
  };

  percentualVendasPorTipo = async (
    _requisicao: Request,
    resposta: Response,
    proximo: NextFunction,
  ): Promise<void> => {
    try {
      resposta.json(await this.relatorioService.percentualVendasPorTipo());
    } catch (erro) {
      proximo(erro);
    }
  };
}

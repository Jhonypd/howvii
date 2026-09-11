import express, { Router } from "express";
import { RelatorioController } from "../controllers/relatorio-controller";

export function criarRotasRelatorios(relatorioController: RelatorioController): Router {
  const rotas = express.Router();

  rotas.get("/pagamentos/por-imovel", relatorioController.pagamentosPorImovel);
  rotas.get("/vendas/por-mes-ano", relatorioController.vendasPorMesAno);
  rotas.get("/vendas/percentual-por-tipo", relatorioController.percentualVendasPorTipo);

  return rotas;
}

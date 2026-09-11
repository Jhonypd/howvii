import express, { NextFunction, Request, Response } from "express";
import path from "node:path";
import swaggerUi from "swagger-ui-express";
import { RelatorioController } from "./controllers/relatorio-controller";
import { criarRotasRelatorios } from "./routes/relatorio-routes";

export function criarAplicacao(relatorioController: RelatorioController) {
  const aplicacao = express();
  const caminhoOpenApi = path.resolve(process.cwd(), "docs", "openapi.yaml");

  aplicacao.disable("x-powered-by");

  aplicacao.get("/openapi.yaml", (_requisicao, resposta) => {
    resposta.sendFile(caminhoOpenApi);
  });

  aplicacao.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(null, {
      customSiteTitle: "API de Pagamentos Imobiliários",
      swaggerOptions: { url: "/openapi.yaml" },
    }),
  );

  aplicacao.use(criarRotasRelatorios(relatorioController));

  aplicacao.use(
    (erro: Error, _requisicao: Request, resposta: Response, _proximo: NextFunction) => {
      console.error("Erro ao processar a requisição:", erro.message);
      resposta.status(500).json({ erro: "Erro interno ao processar os dados." });
    },
  );

  return aplicacao;
}

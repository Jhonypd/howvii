import { Server } from "node:http";
import { criarAplicacao } from "./app";
import { RelatorioController } from "./controllers/relatorio-controller";
import { ContextoBanco } from "./database/contexto-banco";
import { PagamentoRepository } from "./repositories/pagamento-repository";
import { RelatorioService } from "./services/relatorio-service";

const porta = Number(process.env.PORT || 3000);

export async function iniciarServidor() {
  const contextoBanco = new ContextoBanco();

  try {
    await contextoBanco.conectar();
  } catch (erro) {
    await contextoBanco.fechar();
    throw erro;
  }

  const repository = new PagamentoRepository(contextoBanco);
  const relatorioService = new RelatorioService(repository);
  const relatorioController = new RelatorioController(relatorioService);
  const aplicacao = criarAplicacao(relatorioController);
  const servidor = await new Promise<Server>((resolver, rejeitar) => {
    const aoFalhar = (erro: Error) => rejeitar(erro);
    const instancia = aplicacao.listen(porta, () => {
      instancia.off("error", aoFalhar);
      resolver(instancia);
    });
    instancia.once("error", aoFalhar);
  }).catch(async (erro) => {
    await contextoBanco.fechar();
    throw erro;
  });

  console.log(`Servidor disponível em http://localhost:${porta}`);
  console.log(`Swagger UI disponível em http://localhost:${porta}/docs`);

  let encerrando = false;

  function encerrarServidor(sinal: string): void {
    if (encerrando) {
      return;
    }

    encerrando = true;
    console.log(`Encerrando servidor após ${sinal}.`);

    servidor.close(async (erro) => {
      try {
        await contextoBanco.fechar();
        console.log("Pool de conexões encerrado.");
      } finally {
        if (erro) {
          console.error("Não foi possível encerrar o servidor corretamente.");
          process.exitCode = 1;
        }
      }
    });
  }

  process.once("SIGINT", () => encerrarServidor("SIGINT"));
  process.once("SIGTERM", () => encerrarServidor("SIGTERM"));

  return { servidor, contextoBanco };
}

if (require.main === module) {
  iniciarServidor().catch(() => {
    console.error("Não foi possível iniciar o servidor.");
    process.exitCode = 1;
  });
}

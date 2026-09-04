const { criarAplicacao } = require("./app");
const { criarPool } = require("./config/database");
const { PagamentoRepository } = require("./repositories/pagamento-repository");
const { RelatorioService } = require("./services/relatorio-service");

const porta = Number(process.env.PORT || 3000);

async function iniciarServidor() {
  const pool = criarPool();

  try {
    await pool.connect();
  } catch (erro) {
    await pool.close();
    throw erro;
  }

  const repository = new PagamentoRepository(pool);
  const relatorioService = new RelatorioService(repository);
  const aplicacao = criarAplicacao(relatorioService);
  const servidor = await new Promise((resolver, rejeitar) => {
    const aoFalhar = (erro) => rejeitar(erro);
    const instancia = aplicacao.listen(porta, () => {
      instancia.off("error", aoFalhar);
      resolver(instancia);
    });
    instancia.once("error", aoFalhar);
  }).catch(async (erro) => {
    await pool.close();
    throw erro;
  });

  console.log(`Servidor disponível em http://localhost:${porta}`);
  console.log(`Swagger UI disponível em http://localhost:${porta}/docs`);

  let encerrando = false;

  function encerrarServidor(sinal) {
    if (encerrando) {
      return;
    }

    encerrando = true;
    console.log(`Encerrando servidor após ${sinal}.`);

    servidor.close(async (erro) => {
      try {
        await pool.close();
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

  return { servidor, pool };
}

if (require.main === module) {
  iniciarServidor().catch(() => {
    console.error("Não foi possível iniciar o servidor.");
    process.exitCode = 1;
  });
}

module.exports = { iniciarServidor };

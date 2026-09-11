import { ContextoBanco } from "../database/contexto-banco";
import { PagamentoRepository } from "../repositories/pagamento-repository";

export async function executarConsulta() {
  const contextoBanco = new ContextoBanco();

  try {
    await contextoBanco.conectar();
    const repository = new PagamentoRepository(contextoBanco);
    const pagamentos = await repository.listarTodos();
    console.table(pagamentos);
    return pagamentos;
  } finally {
    await contextoBanco.fechar();
  }
}

if (require.main === module) {
  executarConsulta().catch(() => {
    console.error("Não foi possível consultar os pagamentos.");
    process.exitCode = 1;
  });
}

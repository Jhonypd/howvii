const { criarPool } = require("../config/database");
const { PagamentoRepository } = require("../repositories/pagamento-repository");

async function executarConsulta() {
  const pool = criarPool();

  try {
    await pool.connect();
    const repository = new PagamentoRepository(pool);
    const pagamentos = await repository.listarTodos();
    console.table(pagamentos);
    return pagamentos;
  } finally {
    await pool.close();
  }
}

if (require.main === module) {
  executarConsulta().catch(() => {
    console.error("Não foi possível consultar os pagamentos.");
    process.exitCode = 1;
  });
}

module.exports = { executarConsulta };

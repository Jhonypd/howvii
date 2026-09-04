# Hands on Work VII - Serviços imobiliários

Projeto acadêmico desenvolvido com SQL Server e Node.js para consultar e processar dados de pagamentos de imóveis. O projeto prepara o banco, consulta todos os registros e disponibiliza os três relatórios da Parte 2 por meio de uma API REST.

## Tecnologias

- Microsoft SQL Server
- SQL Server Management Studio (SSMS)
- Node.js
- Express
- Pacote `mssql`
- OpenAPI 3.0.3
- Swagger UI

## Estrutura

```text
database/
  01-criacao-banco-tabelas.sql
  02-seed.sql
  03-consulta.sql
docs/
  modelo-entidade-relacionamento.md
  openapi.yaml
src/
  app.js
  server.js
  cli/
    consulta.js
  config/
    database.js
  repositories/
    pagamento-repository.js
  routes/
    relatorio-routes.js
  services/
    calculos-relatorios.js
    relatorio-service.js
test/
  contract/
    openapi.test.js
  fixtures/
    carga-inicial.js
  http/
    app.test.js
  unit/
    calculos-relatorios.test.js
    carga-inicial.test.js
    camadas.test.js
integration/
  sql/
    relatorios-sql.test.js
.env.example
package.json
```

### Responsabilidades das pastas

- `src/config`: configuração de infraestrutura e conexão com o banco.
- `src/repositories`: consultas e acesso aos dados.
- `src/services`: regras de negócio e cálculos dos relatórios.
- `src/routes`: definição dos endpoints HTTP.
- `src/cli`: comandos executados diretamente pelo terminal.
- `test`: testes isolados, sem dependência do SQL Server.
- `integration`: testes de integração somente de leitura com o banco real.

## Modelo de dados

- Um tipo de imóvel pode classificar vários imóveis.
- Um imóvel pertence a somente um tipo.
- Um imóvel pode possuir vários pagamentos.
- Cada pagamento pertence a somente um imóvel.

## Como executar

1. Abra o SQL Server Management Studio.
2. Execute os arquivos da pasta `database` na ordem numérica.
3. Copie `.env.example` para `.env` e informe as credenciais do SQL Server.
4. Instale as dependências:

```bash
npm install
```

5. Para executar apenas a consulta completa pelo Node.js:

```bash
npm run consulta
```

6. Para iniciar a API:

```bash
npm start
```

O Swagger UI estará disponível em `http://localhost:3000/docs`. A especificação OpenAPI também pode ser acessada diretamente em `http://localhost:3000/openapi.yaml`.

## Serviços da Parte 2

- `GET /pagamentos/por-imovel`: soma dos pagamentos por `codigo_imovel`.
- `GET /vendas/por-mes-ano`: soma das vendas por mês e ano.
- `GET /vendas/percentual-por-tipo`: percentual quantitativo das vendas por tipo de imóvel.

O banco se chama `how_vii`. A aplicação consulta os dados completos por meio de `JOIN`, sem utilizar `WHERE`, `GROUP BY` ou funções de agregação. O agrupamento e os cálculos são feitos em memória pelo JavaScript com técnicas de programação funcional.

A API reutiliza um único pool de conexões com o SQL Server. Esse pool é encerrado de forma controlada quando o processo recebe `SIGINT` ou `SIGTERM`. O comando `npm run consulta` utiliza um pool próprio e o fecha assim que a consulta termina.

## Testes

Os testes automatizados não acessam nem modificam o banco de dados. Para executá-los:

```bash
npm test
```

Quando houver um SQL Server configurado, execute separadamente o teste de integração somente de leitura:

```bash
npm run test:integracao
```

## Requisitos atendidos

- Três tabelas relacionadas: tipos de imóvel, imóveis e pagamentos.
- 30 registros de pagamentos distribuídos em 5 meses distintos.
- 8 imóveis de 3 tipos, todos com ao menos um pagamento.
- Consulta com `JOIN` entre todas as tabelas, sem filtros ou agregações.
- Execução da consulta pelo Node.js.
- Processamento funcional dos três relatórios em JavaScript.
- Serviços REST em Express com respostas JSON.
- Especificação OpenAPI vinculada ao Swagger UI.

## Entrega

O PDF final da Parte 1 deve ser colocado na pasta `entrega`. Consulte o checklist existente nessa pasta antes de enviar o trabalho. O arquivo `.env` não deve ser incluído na entrega.

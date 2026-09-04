# Hands on Work VII - Serviços imobiliários

Projeto acadêmico desenvolvido com SQL Server e Node.js para consultar dados de pagamentos de imóveis. Nesta primeira etapa, o projeto prepara o banco, a consulta completa e a especificação dos serviços REST que serão implementados na Parte 2.

## Tecnologias

- Microsoft SQL Server
- SQL Server Management Studio (SSMS)
- Node.js
- Pacote `mssql`
- OpenAPI 3.0.3

## Estrutura da Parte 1

```text
database/
  01-criacao-banco-tabelas.sql
  02-seed.sql
  03-consulta.sql
docs/
  modelo-entidade-relacionamento.md
  openapi.yaml
src/
  pagamentos.js
entrega/
  README.md
.env.example
package.json
```

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

5. Execute a consulta pelo Node.js:

```bash
npm run consulta
```

O banco criado pelo script se chama `how_vii`. A aplicação consulta os dados completos por meio de `JOIN`, sem utilizar `WHERE`, `GROUP BY` ou funções de agregação. Os filtros e agrupamentos serão implementados em JavaScript na Parte 2.

## Requisitos atendidos

- Três tabelas relacionadas: tipos de imóvel, imóveis e pagamentos.
- 30 registros de pagamentos distribuídos em 5 meses distintos.
- 8 imóveis de 3 tipos, todos com ao menos um pagamento.
- Consulta com `JOIN` entre todas as tabelas, sem filtros ou agregações.
- Execução da consulta pelo Node.js.
- Especificação OpenAPI dos três serviços previstos para a Parte 2.

## Entrega

O PDF final da Parte 1 deve ser colocado na pasta `entrega`. Consulte o checklist existente nessa pasta antes de enviar o trabalho. O arquivo `.env` não deve ser incluído na entrega.

USE master;
GO

IF DB_ID('how_vii') IS NULL
BEGIN
    CREATE DATABASE how_vii;
END;
GO

USE how_vii;
GO

CREATE TABLE tipos_imovel (
    id UNIQUEIDENTIFIER NOT NULL
        CONSTRAINT df_tipos_imovel_id DEFAULT NEWSEQUENTIALID(),
    descricao VARCHAR(50) NOT NULL,
    CONSTRAINT pk_tipos_imovel PRIMARY KEY (id),
    CONSTRAINT uq_tipos_imovel_descricao UNIQUE (descricao)
);
GO

CREATE TABLE imoveis (
    id UNIQUEIDENTIFIER NOT NULL
        CONSTRAINT df_imoveis_id DEFAULT NEWSEQUENTIALID(),
    codigo_imovel INT NOT NULL,
    descricao VARCHAR(200) NOT NULL,
    id_tipo_imovel UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT pk_imoveis PRIMARY KEY (id),

    CONSTRAINT uq_imoveis_codigo UNIQUE (codigo_imovel),
    CONSTRAINT fk_imoveis_tipos_imovel
        FOREIGN KEY (id_tipo_imovel)
        REFERENCES tipos_imovel (id)
);
GO

CREATE TABLE pagamentos (
    id UNIQUEIDENTIFIER NOT NULL
        CONSTRAINT df_pagamentos_id_venda DEFAULT NEWSEQUENTIALID(),
    data_pagamento DATE NOT NULL,
    valor_pagamento DECIMAL(12,2) NOT NULL,
    id_imovel UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT pk_pagamentos PRIMARY KEY (id),
    CONSTRAINT ck_pagamentos_valor_positivo CHECK (valor_pagamento > 0),
    CONSTRAINT fk_pagamentos_imoveis
        FOREIGN KEY (id_imovel)
        REFERENCES imoveis (id)
);
GO

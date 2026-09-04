USE how_vii;
GO


INSERT INTO tipos_imovel (descricao)
VALUES
    ('Apartamento'),
    ('Casa'),
    ('Sala Comercial');
GO

DECLARE @id_apartamento UNIQUEIDENTIFIER = (
    SELECT id
    FROM tipos_imovel
    WHERE descricao = 'Apartamento'
);

DECLARE @id_casa UNIQUEIDENTIFIER = (
    SELECT id
    FROM tipos_imovel
    WHERE descricao = 'Casa'
);

DECLARE @id_sala_comercial UNIQUEIDENTIFIER = (
    SELECT id
    FROM tipos_imovel
    WHERE descricao = 'Sala Comercial'
);

INSERT INTO imoveis (codigo_imovel, descricao, id_tipo_imovel)
VALUES
    (1001, 'Apartamento de 70 m2 no Centro', @id_apartamento),
    (1002, 'Apartamento de 85 m2 no bairro Fazenda', @id_apartamento),
    (1003, 'Apartamento de 100 m2 em condomínio fechado', @id_apartamento),
    (2001, 'Casa de 90 m2 no bairro São Vicente', @id_casa),
    (2002, 'Casa de 120 m2 no bairro Dom Bosco', @id_casa),
    (2003, 'Casa de 150 m2 no bairro Ressacada', @id_casa),
    (3001, 'Sala comercial de 45 m2 no Centro', @id_sala_comercial),
    (3002, 'Sala comercial de 60 m2 no bairro Fazenda', @id_sala_comercial);
GO

INSERT INTO pagamentos (data_pagamento, valor_pagamento, id_imovel)
SELECT
    dados.data_pagamento,
    dados.valor_pagamento,
    i.id
FROM (VALUES
    ('20260105', 1800.00, 1001),
    ('20260108', 2200.00, 1002),
    ('20260110', 2800.00, 2001),
    ('20260112', 3100.00, 2002),
    ('20260115', 4200.00, 3001),
    ('20260118', 4800.00, 3002),

    ('20260205', 1800.00, 1001),
    ('20260207', 2500.00, 1003),
    ('20260210', 2800.00, 2001),
    ('20260212', 3500.00, 2003),
    ('20260215', 4200.00, 3001),
    ('20260218', 4800.00, 3002),

    ('20260305', 2200.00, 1002),
    ('20260307', 2500.00, 1003),
    ('20260310', 3100.00, 2002),
    ('20260312', 3500.00, 2003),
    ('20260315', 4200.00, 3001),
    ('20260318', 4800.00, 3002),

    ('20260405', 1800.00, 1001),
    ('20260407', 2200.00, 1002),
    ('20260409', 2500.00, 1003),
    ('20260411', 2800.00, 2001),
    ('20260413', 3100.00, 2002),
    ('20260415', 4200.00, 3001),

    ('20260505', 1800.00, 1001),
    ('20260507', 2500.00, 1003),
    ('20260510', 2800.00, 2001),
    ('20260512', 3500.00, 2003),
    ('20260515', 4200.00, 3001),
    ('20260518', 4800.00, 3002)
) AS dados (data_pagamento, valor_pagamento, codigo_imovel)
INNER JOIN imoveis AS i
    ON i.codigo_imovel = dados.codigo_imovel;
GO

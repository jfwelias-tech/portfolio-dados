-- Projeto 03 | Descoberta: solicitacoes relacionadas a morcegos
-- Filtro: SUBDIVISAO = 'Morcegos' | MySQL 8
-- 97 linhas e 95 protocolos distintos na copia da base analisada.
-- Recorte da base: 01/04/2024 a 01/05/2024.
-- Registro dos horarios = registro da solicitacao, nao do avistamento.
-- Parte 1: distribuicao por regional, evitando protocolos repetidos.
WITH morcegos AS (
 SELECT SOLICITACAO, REGIONAL_ASS, BAIRRO_ASS, HORARIO,
        ROW_NUMBER() OVER (PARTITION BY SOLICITACAO ORDER BY id) AS rn
 FROM modulosql.chamados156
 WHERE TRIM(SUBDIVISAO) = 'Morcegos'
)
SELECT REGIONAL_ASS, COUNT(*) AS solicitacoes
FROM morcegos
WHERE rn = 1
GROUP BY REGIONAL_ASS
ORDER BY solicitacoes DESC;

-- Parte 2: bairros com mais solicitacoes.
WITH morcegos AS (
 SELECT SOLICITACAO, BAIRRO_ASS,
        ROW_NUMBER() OVER (PARTITION BY SOLICITACAO ORDER BY id) AS rn
 FROM modulosql.chamados156
 WHERE TRIM(SUBDIVISAO) = 'Morcegos'
)
SELECT BAIRRO_ASS AS bairro, COUNT(*) AS solicitacoes
FROM morcegos
WHERE rn = 1
GROUP BY BAIRRO_ASS
ORDER BY solicitacoes DESC, bairro
LIMIT 10;

-- Parte 3: hora do registro da solicitacao.
WITH morcegos AS (
 SELECT SOLICITACAO, HORARIO,
        ROW_NUMBER() OVER (PARTITION BY SOLICITACAO ORDER BY id) AS rn
 FROM modulosql.chamados156
 WHERE TRIM(SUBDIVISAO) = 'Morcegos'
)
SELECT
 HOUR(CAST(TRIM(HORARIO) AS TIME)) AS hora_do_dia,
 COUNT(*) AS solicitacoes
FROM morcegos
WHERE rn = 1
GROUP BY hora_do_dia
ORDER BY hora_do_dia;

-- Parte 4: participacao da categoria dentro das solicitacoes da regional.
-- Interpretação: solicitacoes de morcegos por MIL protocolos do 156,
-- NAO taxa de animais nem risco de raiva por habitante.
WITH protocolos AS (
 SELECT SOLICITACAO, REGIONAL_ASS, SUBDIVISAO,
        ROW_NUMBER() OVER (PARTITION BY SOLICITACAO ORDER BY id) AS rn
 FROM modulosql.chamados156
)
SELECT REGIONAL_ASS,
 COUNT(*) AS total_protocolos,
 SUM(CASE WHEN TRIM(SUBDIVISAO)='Morcegos' THEN 1 ELSE 0 END)
 AS protocolos_morcegos,
 ROUND(1000.0 * SUM(CASE WHEN TRIM(SUBDIVISAO)='Morcegos' THEN 1 ELSE 0 END)
 / COUNT(*), 2) AS morcegos_por_mil_protocolos
FROM protocolos
WHERE rn=1
GROUP BY REGIONAL_ASS
ORDER BY protocolos_morcegos DESC;

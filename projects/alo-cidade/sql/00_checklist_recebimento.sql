-- PROJETO 03 | CHECKLIST DE RECEBIMENTO DE BASE DE DADOS
-- MySQL 8 | consultas SOMENTE LEITURA; nunca alteram a base original.
-- Objetivo: explorar estrutura, abrangencia, tipos, vazios e duplicidades
-- antes de qualquer conclusao ou visualizacao.
--
-- 01. Metadados: colunas e tipos definidos no banco.
-- Lembrete: o tipo no banco pode ser diferente do tipo SEMANTICO esperado.
SELECT ORDINAL_POSITION AS posicao,
       COLUMN_NAME AS coluna,
       DATA_TYPE AS tipo_sql,
       IS_NULLABLE AS permite_null
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = 'modulosql'
  AND TABLE_NAME = 'chamados156'
ORDER BY ORDINAL_POSITION;

-- 02. Volume de linhas, IDs tecnicos e protocolos distintos.
SELECT COUNT(*) AS linhas,
       COUNT(DISTINCT id) AS ids_unicos,
       COUNT(DISTINCT SOLICITACAO) AS protocolos_distintos
FROM modulosql.chamados156;
-- Conferido: 41490 linhas; 41490 IDs; 39451 protocolos.

-- 03. Datas: analisar o recorte temporal na origem (texto DD/MM/AAAA).
SELECT MIN(STR_TO_DATE(DATA, '%d/%m/%Y')) AS primeira_data,
       MAX(STR_TO_DATE(DATA, '%d/%m/%Y')) AS ultima_data,
       COUNT(DISTINCT STR_TO_DATE(DATA, '%d/%m/%Y')) AS dias_distintos
FROM modulosql.chamados156;
-- Conferido: 01/04/2024 a 01/05/2024 (31 dias de calendario).

-- 04. Horarios: conferir formato ANTES de converter.
SELECT COUNT(*) AS linhas,
       SUM(CASE WHEN HORARIO IS NULL OR TRIM(HORARIO) = ''
                THEN 1 ELSE 0 END) AS horarios_ausentes,
       SUM(CASE WHEN TRIM(HORARIO) REGEXP
                    '^([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$'
                THEN 1 ELSE 0 END) AS horarios_validos_apos_trim
FROM modulosql.chamados156;
-- Conferido: 41490 horarios validos apos TRIM, com espacos extras
-- no texto original. Nao modificar a coluna original.

-- 05. Valores ausentes em campos selecionados.
-- Nao confundir NULL com string vazia ou somente espacos.
SELECT COUNT(*) AS linhas,
       SUM(CASE WHEN ORGAO IS NULL OR TRIM(ORGAO) = ''
                THEN 1 ELSE 0 END) AS orgao_vazio,
       SUM(CASE WHEN BAIRRO_ASS IS NULL OR TRIM(BAIRRO_ASS) = ''
                THEN 1 ELSE 0 END) AS bairro_vazio,
       SUM(CASE WHEN ASSUNTO IS NULL OR TRIM(ASSUNTO) = ''
                THEN 1 ELSE 0 END) AS assunto_vazio
FROM modulosql.chamados156;
-- ORGAO: 16875 ausentes; BAIRRO_ASS: 71 ausentes;
-- a auditoria de TODOS os campos ainda e etapa separada.

-- 06. Distribuicao de linhas por numero de solicitacao.
-- Repeticoes nao sao, automaticamente, dados duplicados por engano.
SELECT quantidade_de_linhas, COUNT(*) AS numero_de_protocolos
FROM (
    SELECT SOLICITACAO, COUNT(*) AS quantidade_de_linhas
    FROM modulosql.chamados156
    GROUP BY SOLICITACAO
) protocolos
GROUP BY quantidade_de_linhas
ORDER BY quantidade_de_linhas;
-- Conferido: 37421 com 1 linha; 2023 com 2; 5 com 3; 2 com 4.
-- 2030 protocolos repetidos -> 2039 linhas adicionais.

-- 07. Perfil de categorias: detectar grafias e codificacao estranha.
-- Conferir manualmente os valores antes de normalizar.
SELECT TIPO, COUNT(DISTINCT SOLICITACAO) AS protocolos
FROM modulosql.chamados156
GROUP BY TIPO
ORDER BY protocolos DESC;

-- PENDENCIAS: examinar tipos SEMANTICOS de todos os campos,
-- ausentes em todas as colunas, codificacao de acentos,
-- integridade e padronizacao de outras categorias. Nao declarar
-- essas verificacoes concluidas sem evidencias.

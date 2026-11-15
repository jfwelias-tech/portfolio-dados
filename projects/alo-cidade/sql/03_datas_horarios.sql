-- 03a | Validacao das datas (texto dd/mm/aaaa)
SELECT COUNT(*) AS total_registros,
 COUNT(STR_TO_DATE(DATA,'%d/%m/%Y')) AS datas_validas,
 COUNT(*)-COUNT(STR_TO_DATE(DATA,'%d/%m/%Y')) AS datas_invalidas,
 MIN(STR_TO_DATE(DATA,'%d/%m/%Y')) AS primeira_data,
 MAX(STR_TO_DATE(DATA,'%d/%m/%Y')) AS ultima_data
FROM modulosql.chamados156;
-- Validado: 41490 | 41490 | 0 | 2024-04-01 | 2024-05-01

-- 03b | Validacao apos TRIM
SELECT COUNT(*) AS total_registros,
 SUM(TRIM(HORARIO) REGEXP '^([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$') AS horarios_validos,
 SUM(CHAR_LENGTH(HORARIO)>CHAR_LENGTH(TRIM(HORARIO))) AS horarios_com_espacos
FROM modulosql.chamados156;
-- Validado: 41490 | 41490 | 41490

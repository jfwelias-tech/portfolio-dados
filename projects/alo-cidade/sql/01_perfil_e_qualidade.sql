-- 01 | Perfil e qualidade da base (consulta de leitura)
SELECT COUNT(*) AS registros, COUNT(DISTINCT id) AS ids_unicos, COUNT(DISTINCT SOLICITACAO) AS solicitacoes_distintas,
 SUM(CASE WHEN ORGAO IS NULL OR TRIM(ORGAO) = '' THEN 1 ELSE 0 END) AS orgao_ausente,
 SUM(CASE WHEN BAIRRO_ASS IS NULL OR TRIM(BAIRRO_ASS) = '' THEN 1 ELSE 0 END) AS bairro_ausente
FROM modulosql.chamados156;
-- Validado: 41490 | 41490 | 39451 | 16875 | 71

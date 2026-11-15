-- 02a | Distribuicao de registros por solicitacao
WITH contagem AS (
 SELECT SOLICITACAO, COUNT(*) AS ocorrencias
 FROM modulosql.chamados156
 GROUP BY SOLICITACAO
)
SELECT ocorrencias AS registros_por_solicitacao,
 COUNT(*) AS quantidade_solicitacoes, SUM(ocorrencias) AS total_registros
FROM contagem GROUP BY ocorrencias ORDER BY ocorrencias;
-- Validado: (1,37421,37421), (2,2023,4046), (3,5,15), (4,2,8)

-- 02b | Comparacao integral dos campos, exceto id
WITH versoes AS (
 SELECT SOLICITACAO, COUNT(*) AS registros,
 COUNT(DISTINCT SHA2(JSON_OBJECT(
 'TIPO', TIPO, 'ORGAO', ORGAO, 'DATA', DATA, 'HORARIO', HORARIO,
 'ASSUNTO', ASSUNTO, 'SUBDIVISAO', SUBDIVISAO, 'DESCRICAO', DESCRICAO,
 'LOGRADOURO_ASS', LOGRADOURO_ASS, 'BAIRRO_ASS', BAIRRO_ASS,
 'REGIONAL_ASS', REGIONAL_ASS, 'MEIO_RESPOSTA', MEIO_RESPOSTA,
 'OBSERVACAO', OBSERVACAO, 'SEXO', SEXO, 'BAIRRO_CIDADAO', BAIRRO_CIDADAO,
 'REGIONAL_CIDADAO', REGIONAL_CIDADAO, 'DATA_NASC', DATA_NASC,
 'TIPO_CIDADAO', TIPO_CIDADAO, 'ORGAO_RESP', ORGAO_RESP,
 'RESPOSTA_FINAL', RESPOSTA_FINAL
 ),256)) AS versoes_distintas
 FROM modulosql.chamados156
 GROUP BY SOLICITACAO HAVING COUNT(*)>1
)
SELECT COUNT(*) AS solicitacoes_repetidas,
 SUM(versoes_distintas=1) AS totalmente_iguais,
 SUM(versoes_distintas>1) AS com_diferencas,
 SUM(registros-versoes_distintas) AS registros_redundantes
FROM versoes;
-- Validado: 2030 | 366 | 1664 | 372

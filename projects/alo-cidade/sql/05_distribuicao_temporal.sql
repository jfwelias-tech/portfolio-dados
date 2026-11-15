-- 05a | Solicitacoes distintas por hora do dia
SELECT HOUR(CAST(TRIM(HORARIO) AS TIME)) AS hora_do_dia,
 COUNT(DISTINCT SOLICITACAO) AS total_solicitacoes
FROM modulosql.chamados156 GROUP BY hora_do_dia ORDER BY hora_do_dia;
-- Validado: hora 10=3520; total 39451

-- 05b | Media diaria por dia da semana
WITH solicitacoes AS (
 SELECT SOLICITACAO, MIN(STR_TO_DATE(DATA,'%d/%m/%Y')) AS data_chamado
 FROM modulosql.chamados156 GROUP BY SOLICITACAO
)
SELECT DAYOFWEEK(data_chamado) AS dia_numero,
 ELT(DAYOFWEEK(data_chamado),'Domingo','Segunda-feira','Terca-feira',
 'Quarta-feira','Quinta-feira','Sexta-feira','Sabado') AS dia_semana,
 COUNT(*) AS total_solicitacoes,
 COUNT(DISTINCT data_chamado) AS dias_observados,
 ROUND(COUNT(*)/COUNT(DISTINCT data_chamado),2) AS media_por_dia
FROM solicitacoes
GROUP BY dia_numero,dia_semana ORDER BY dia_numero;
-- Validado: 7 linhas e 39451 solicitacoes na soma

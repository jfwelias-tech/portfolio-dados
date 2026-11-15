-- 04 | Dia da semana x hora: dados para heatmap
-- Observacao: 1=domingo, 2=segunda,...,7=sabado
WITH solicitacoes AS (
 SELECT SOLICITACAO,
 MIN(STR_TO_DATE(DATA,'%d/%m/%Y')) AS data_chamado,
 MIN(CAST(TRIM(HORARIO) AS TIME)) AS hora_chamado
 FROM modulosql.chamados156 GROUP BY SOLICITACAO
),
dias AS (
 SELECT DAYOFWEEK(data_chamado) AS dia_numero,
 COUNT(DISTINCT data_chamado) AS dias_observados
 FROM solicitacoes GROUP BY DAYOFWEEK(data_chamado)
)
SELECT DAYOFWEEK(s.data_chamado) AS dia_numero,
 HOUR(s.hora_chamado) AS hora_do_dia,
 COUNT(*) AS total_solicitacoes,
 ROUND(COUNT(*)/MAX(d.dias_observados),2) AS media_por_dia
FROM solicitacoes s JOIN dias d
 ON DAYOFWEEK(s.data_chamado)=d.dia_numero
GROUP BY DAYOFWEEK(s.data_chamado),HOUR(s.hora_chamado)
ORDER BY dia_numero,hora_do_dia;
-- Validado: 167 linhas; soma(total_solicitacoes)=39451.
-- A combinacao sabado/04h sem registros e exibida como zero no heatmap.

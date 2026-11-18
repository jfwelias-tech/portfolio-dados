-- Projeto 03 | Auditoria avancada de granularidade
-- MySQL 8.0 | ROW_NUMBER + COUNT OVER(PARTITION BY)
-- Cada solicitacao recebe numeracao interna. A contagem de rn > 1
-- representa linhas adicionais por protocolo, NAO duplicatas integrais.
WITH protocolos AS (
  SELECT SOLICITACAO, id,
         ROW_NUMBER() OVER (PARTITION BY SOLICITACAO ORDER BY id) AS rn,
         COUNT(*) OVER (PARTITION BY SOLICITACAO) AS registros_no_protocolo
  FROM modulosql.chamados156
)
SELECT
  COUNT(*) AS registros,
  COUNT(DISTINCT SOLICITACAO) AS solicitacoes_distintas,
  COUNT(DISTINCT CASE WHEN registros_no_protocolo > 1
                      THEN SOLICITACAO END) AS solicitacoes_repetidas,
  SUM(CASE WHEN rn > 1 THEN 1 ELSE 0 END) AS linhas_adicionais
FROM protocolos;
-- Resultado conferido: 41490, 39451, 2030, 2039.
-- 2023 protocolos aparecem duas vezes, 5 tres vezes e 2 quatro vezes.
-- 2023*(2-1) + 5*(3-1) + 2*(4-1) = 2039.
-- Cautela: linhas adicionais NAO sao necessariamente conteudo redundante.

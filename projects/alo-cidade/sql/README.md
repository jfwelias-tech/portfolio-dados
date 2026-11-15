# Consultas SQL — Alô, Cidade!

Este diretório contém **consultas executadas e validadas no MySQL 8**, organizadas segundo o fluxo real da investigação.

| Arquivo | O que demonstra | Status |
|---|---|---|
| `01_perfil_e_qualidade.sql` | Contagens, `CASE`, valores ausentes | Validado |
| `02_duplicidades.sql` | CTEs, granularidade, `SHA2`, `JSON_OBJECT` | Validado |
| `03_datas_horarios.sql` | `STR_TO_DATE`, `TRIM`, `REGEXP` | Validado |
| `04_heatmap.sql` | CTEs, `JOIN`, agregação e normalização | Validado |
| `05_distribuicao_temporal.sql` | `HOUR`, `DAYOFWEEK`, `ELT` e `DISTINCT` | Validado |

**Execução:** utilizar MySQL 8 e uma tabela `modulosql.chamados156` compatível; ajustar o esquema se necessário. Executar as instruções de leitura individualmente no editor SQL (no DBeaver, selecionar a instrução inteira antes de pressionar `Ctrl + Enter`).

A exportação agregada do arquivo `04_heatmap.sql` serviu de base aos gráficos. Não são fornecidas aqui consultas de alteração da tabela original.

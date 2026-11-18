# Consultas SQL — Alô, Cidade!

Este diretório reúne **consultas já executadas e conferidas** e **consultas adicionais preparadas para MySQL 8**, organizadas segundo o fluxo real da investigação. O status distingue verificações concluídas das etapas ainda pendentes.

| Arquivo | O que demonstra | Status |
|---|---|---|
| `00_checklist_recebimento.sql` | Metadados (`information_schema`), volumetria, datas, horários, vazios, protocolos e categorias | Script inicial somente leitura; auditoria parcial |
| `01_perfil_e_qualidade.sql` | Contagens, `CASE`, valores ausentes | Validado |
| `02_duplicidades.sql` | CTEs, granularidade, `SHA2`, `JSON_OBJECT` | Validado |
| `03_datas_horarios.sql` | `STR_TO_DATE`, `TRIM`, `REGEXP` | Validado |
| `04_heatmap.sql` | CTEs, `JOIN`, agregação e normalização | Validado |
| `05_distribuicao_temporal.sql` | `HOUR`, `DAYOFWEEK`, `ELT` e `DISTINCT` | Validado |
| `06_window_functions_auditoria.sql` | `ROW_NUMBER()`, `COUNT() OVER`, reconciliação de protocolos | Reproduzido na cópia CSV; sintaxe MySQL 8 preparada |
| `07_morcegos_geografia_horarios.sql` | Filtro territorial, `ROW_NUMBER()`, horários e taxas por mil protocolos | Reproduzido na cópia CSV; sintaxe MySQL 8 preparada |

**Execução:** utilizar MySQL 8 e uma tabela `modulosql.chamados156` compatível; ajustar o esquema se necessário. Executar as instruções de leitura individualmente no editor SQL (no DBeaver, selecionar a instrução inteira antes de pressionar `Ctrl + Enter`).

A exportação agregada do arquivo `04_heatmap.sql` serviu de base aos gráficos. Não são fornecidas aqui consultas de alteração da tabela original.

As duas últimas consultas têm resultados conferidos na cópia CSV completa por SQL local; não foi feita nova conexão direta ao servidor MySQL original.

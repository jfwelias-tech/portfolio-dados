# Registro técnico — versão 0.1

**Etapas executadas:** exportação dos dados para análise local; inspeção de 21 colunas; perfil de qualidade; investigação de repetição dos identificadores; comparação de classificações e respostas; validação de datas; identificação de espaços extras em `HORARIO`; consultas temporal e semanal; exportação de agregado do heatmap; validação de soma de 39.451 solicitações.

## Números conferidos

| Teste | Resultado |
|---|---:|
| Registros | 41.490 |
| Identificadores `id` diferentes | 41.490 |
| Solicitações (`SOLICITACAO`) distintas | 39.451 |
| Solicitações com mais de um registro | 2.030 |
| Registros integralmente redundantes exceto `id` | 372 |
| Solicitações repetidas com diferença em `RESPOSTA_FINAL` | 1.664 |
| Solicitações repetidas com diferença em `ORGAO_RESP` | 13 |
| `ORGAO` ausente (nulo ou em branco) | 16.875 |
| `BAIRRO_ASS` ausente | 71 |
| Datas convertidas | 41.490 |
| Horários com espaços extras, válidos após `TRIM` | 41.490 |
| Combinações observadas no heatmap | 167 |
| Soma de solicitações no heatmap | 39.451 |

## Decisões e advertências

- **Granularidade:** utilizar solicitações distintas nas métricas de demanda temporal.
- **Versionamento:** manter diferentes respostas e informações de órgão para investigações administrativas; não eliminar todas as repetições indiscriminadamente.
- **Qualidade:** preparar datas e horários em SQL sem alterar a tabela original.
- **Visualização:** preencher com zero a combinação sábado 04h que não possui observações no agregado; utilizar médias por dia observado para comparar dias da semana.
- **Pendente:** investigar caracteres incorretos e acentuação antes de padronizar categorias.
- **Limitações:** intervalo curto; dados descritivos; sem prova de causalidade nem avaliação de capacidade de atendimento.
- **Próximas investigações:** assuntos, subdivisões, bairros/regionais e registros relacionados a morcegos. Não tratá-los como conclusões até a validação SQL.

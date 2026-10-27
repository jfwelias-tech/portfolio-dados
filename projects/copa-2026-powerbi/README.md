# Copa do Mundo 2026 — Power BI & DAX

**Status:** 🚧 estudo de caso em desenvolvimento / Work in progress.

**Stack / Skills:** Power BI · DAX · Power Query · Análise de Dados.

## Objetivo

Explorar as partidas da Copa do Mundo 2026 e demonstrar o processo de construção e revisão de um dashboard: modelagem de dados, medidas DAX, qualidade de dados, indicadores, experiência de navegação e documentação.

## Entregas da primeira publicação

- Página de estudo de caso: [`index.html`](index.html).
- Capturas do relatório em [`screenshots/`](screenshots/) (versão de trabalho).
- Exemplos das medidas e da modelagem: [`DAX.md`](DAX.md).
- Checklist de revisão e limitações: [`REVIEW.md`](REVIEW.md).

O arquivo `.pbix` não está incluído nesta primeira publicação porque ainda está em revisão de fontes, tipos, filtros, apresentação e caminhos locais de atualização. Quando validado e preparado para ser reutilizado, será incorporado como artefato do projeto.

## Indicadores de referência

| Indicador | Valor |
|---|---:|
| Seleções | 48 |
| Partidas | 104 |
| Gols | 308 |
| Média de gols por partida | 2,96 |

Verificação externa: [FIFA — gols da Copa 2026](https://www.fifa.com/pt/tournaments/mens/worldcup/canadamexicousa2026/articles/gols-copa-melhor-media-artilheiros-ligas-clubes). Os totais não substituem uma auditoria linha a linha dos dados brutos.

## Aprendizado central

Durante a atualização do CSV, valores como `2.0` foram interpretados incorretamente como `20` devido à configuração regional. A inconsistência apareceu nos indicadores e no ranking. A correção envolveu revisar a conversão no Power Query, os tipos das colunas e os totais. Esse problema real é parte do histórico de qualidade do projeto.

## Data model

`teams` (dimensão; chave `team_id`) → `scorers` (muitos) e `Partidas por Seleção` (muitos). A tabela `matches` fornece os totais do torneio e, nesta fase, não está diretamente conectada à dimensão de seleções. A tabela auxiliar possui duas linhas por partida: equipe mandante e visitante.

## Próximas etapas

Consultar [`REVIEW.md`](REVIEW.md) antes de declarar o dashboard finalizado.

---

**EN:** An evolving Power BI case study focused on data correctness, dimensional modeling, DAX KPIs and report usability. The site is bilingual; this repository documents the work transparently instead of portraying a draft report as a final deliverable.

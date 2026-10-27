# Medidas DAX — Copa do Mundo 2026

Estas expressões correspondem à lógica desenvolvida no projeto. O nome da tabela de partidas pode variar conforme a versão importada do `.pbix`.

```dax
Partida total =
DISTINCTCOUNT('matches_copa_2026_ids_corrigidos'[match_id])

Gols Totais =
SUM('matches_copa_2026_ids_corrigidos'[home_score_fulltime]) +
SUM('matches_copa_2026_ids_corrigidos'[away_score_fulltime])

Times totais =
DISTINCTCOUNT('teams (2)'[team_id])

Media_gols =
DIVIDE([Gols Totais], [Partida total], 0)

Gols Marcados =
SUM('Partidas por Seleção'[Gols feitos])
```

## Modelagem de jogos por seleção

Para analisar a atuação de cada time tanto como mandante quanto visitante, cria-se uma tabela auxiliar com `UNION` e duas consultas `SELECTCOLUMNS`, cada uma incluindo `match_id`, `team_id`, data, fase, gols marcados e gols sofridos.

Cada um dos 104 jogos passa a ter duas observações na tabela auxiliar (208 registros), sem duplicar a tabela principal `matches`. A dimensão `teams` tem relacionamento 1:* com essa tabela auxiliar.

## QA necessário

- Acompanhar mudanças de nome da tabela de partidas após atualizar o CSV.
- Conferir conversão numérica no Power Query usando localidade apropriada (`2.0` não pode virar `20`).
- Testar Top N e empates; definir critério reprodutível para exatamente dez equipes, se desejado.
- Garantir que cartões globais não sejam interpretados como filtráveis por seleção quando `matches` estiver desconectada.
- Conferir gols contra ao comparar soma de gols dos artilheiros com placares das partidas.

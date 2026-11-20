# Redesign do Power BI — Projeto 01 | Copa do Mundo 2026

Este é um **plano de implementação para o Power BI Desktop**. O PBIX original não foi modificado: a página web já tem uma nova visualização, mas o relatório nativo ainda precisa ser redesenhado e testado.

## Direção visual

- Canvas 16:9 (ex.: 1440 × 810), fundo `#0D2023`, cartões `#1A3030`.
- Verde-turquesa `#58D7BA` para destaque, dourado `#E5C064` para comparações, texto `#F6FFFA`.
- Cartões alinhados, tipografia legível, contraste alto, gráficos sem barras de rolagem e no máximo 2 cores semânticas por painel.

## Página 1 — Panorama do torneio

1. Cabeçalho: título e filtros globais devidamente testados.
2. Quatro KPIs: seleções (48), partidas (104), gols (308) e média de gols (2,96).
3. Comparativo 2022 × 2026 de média de gols (2,69 × 2,96). **2022 é referência externa: não existe automaticamente no dataset 2026.** Indicar que o formato mudou de 64 para 104 partidas.
4. Ranking de gols por seleção (validar empate Inglaterra/França em 20) e artilharia (validar Mbappé com 10).
5. Conclusão visível no rodapé: números absolutos de gols não são diretamente comparáveis sem normalizar pelo número de partidas.

## Página 2 — Análise por seleção

1. Selecionar seleção e fase. Testar interação com tabela global `matches`, que no modelo atual não está ligada diretamente a `teams`.
2. Exibir jogos, gols a favor, contra e saldo usando `Partidas por Seleção`.
3. Usar Top N com critério de desempate reprodutível; medir e documentar rankings avançados somente depois de testar suas medidas DAX.
4. Revisar traduções de fases e formatos das datas.

## Página 3 — Qualidade de dados (opcional)

- Antes/depois do erro de conversão `2.0 → 20`; apontar correção por localidade no Power Query.
- Diagrama do modelo real do Power BI, com `teams` → `Partidas por Seleção` e `teams` → `scorers`.
- Conciliação de `match_id`, soma dos gols, gols contra, prorrogação e disputa de pênaltis.

## Checklist de conclusão do PBIX

- [x] Narrativa e direção visual definidas para apresentação web.
- [x] Código DAX básico documentado no arquivo [DAX.md](DAX.md).
- [ ] Validar fontes, licença dos CSVs e caminhos locais.
- [ ] Validar medidas ao filtrar uma seleção e o torneio todo.
- [ ] Validar gols contra, empates no Top N e data/fase.
- [ ] Redesenhar o PBIX com 16:9, alinhamentos e contraste.
- [ ] Gerar novas capturas reais de boa resolução.
- [ ] Exportar PDF ou vídeo de 30–60 segundos.
- [ ] Compartilhar PBIX ou relatório publicado apenas quando testado e permitido.

## Publicação para recrutadores

A página de estudo de caso é a entrada principal. Ao lado dela, oferecer PDF ou vídeo com os gráficos reais já validados. Evitar depender exclusivamente de arquivo PBIX.

Referência de totais: [FIFA — 2026 by the numbers](https://inside.fifa.com/tournament-organisation/fifa-world-cup-2026-by-the-numbers).
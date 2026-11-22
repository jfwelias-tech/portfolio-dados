# Projeto 01 | Copa do Mundo 2026 — Power BI + DAX + Data Visualization

## 1. O problema
Como comparar o desempenho das seleções e resumir 104 partidas em indicadores confiáveis, considerando a granularidade, a qualidade dos dados e o comportamento dos filtros?

**Público:** analistas esportivos e leitores interessados em explorar resultados.

## 2. A solução e o processo
- Preparação de tipos e localidade no Power Query; erro real de importação de 2.0 como 20 documentado.
- Tabela auxiliar Partidas por Seleção: 104 partidas × duas seleções = 208 registros.
- Medidas DAX existentes em [DAX.md](DAX.md).
- Checklist de boas práticas e pendências técnicas incluído na página.
- [Guia de redesign e publicação do Power BI Desktop](POWERBI_REDESIGN.md) (planejado, ainda não aplicado no PBIX).

## 3. Resultados e visualização
- [Estudo de caso bilíngue com índice, resultados e gráficos para navegador](https://jfwelias-tech.github.io/portfolio-dados/projects/copa-2026-powerbi/)
- [Capturas reais do Power BI](screenshots/) disponíveis sem instalar o Desktop.
- Média de gols: 2022 172/64 = 2,69; 2026 308/104 = 2,96; diferença aproximada de 0,27 gol por partida. O formato das edições é diferente.

### Fontes para conferência
- [FIFA — World Cup 2026 by the numbers](https://inside.fifa.com/tournament-organisation/fifa-world-cup-2026-by-the-numbers)
- [FIFA — Gols da Copa 2026](https://www.fifa.com/pt/tournaments/mens/worldcup/canadamexicousa2026/articles/gols-copa-melhor-media-artilheiros-ligas-clubes)
- [FIFA — Formato 2026](https://www.fifa.com/en/articles/article-fifa-world-cup-2026-mexico-canada-usa-new-format-tournament-football-soccer?pubDate=20250524)

### Procedência dos dados e uso de IA

**Origem imediata conhecida:** o conjunto de dados foi recebido de um professor. A **fonte primária**, as condições de uso/licença e a data original de coleta **não estão confirmadas**.

Durante o desenvolvimento, **parte do conjunto foi complementada com auxílio do ChatGPT**. Ainda não existe uma relação auditada dos registros afetados nem uma referência verificável para cada complemento. Não devemos classificar automaticamente esses registros como oficiais ou reproduzidos de fonte primária.

As referências da FIFA acima **permitem conferir totais agregados**, mas **não certificam a exatidão de cada linha**, a origem dos CSVs ou a validade das intervenções feitas com IA. Até concluirmos a rastreabilidade e auditoria, o conjunto será apresentado como **material de estudo com procedência parcialmente documentada**.

**Plano de validação:** preservar o arquivo originalmente recebido, compará-lo com a versão usada no PBIX, identificar linhas e campos incluídos ou alterados e verificar cada alteração contra fontes rastreáveis. Registrar as decisões em um log de transformações.

**Próximos passos:** validar filtro e integridade do modelo, gols contra, empates e fase; modernizar o relatório nativo; publicar PDF, vídeo ou link compartilhável. O arquivo PBIX ainda não está disponível publicamente. Os gráficos web não são capturas do Power BI.

---
**EN:** Project 01 — bilingual recruiter-facing Power BI + DAX case study organized as problem, approach and results, with web visualizations, real report screenshots and transparent QA backlog.
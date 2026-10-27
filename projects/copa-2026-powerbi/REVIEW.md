# Technical and recruiter review — Copa 2026

**Scope:** current screenshots and supplied `.pbix` report (work-in-progress). Review the finished `.pbix` again before changing status to completed.

## Strengths / Pontos fortes

1. **Data quality investigation:** detected a regional parsing error (`2.0` -> `20`) and recovered coherent totals.
2. **Dimensional thinking:** separated teams, matches and scorers; helper `Partidas por Seleção` handles both home and away team roles.
3. **DAX:** `DISTINCTCOUNT`, additive goals, `DIVIDE`, filtering/Top N, and a calculated column translating match stages.
4. **Visual identity:** customized theme, clear KPI row, podium and rankings.
5. **Iterative workflow:** screenshots and documented limitations make progress transparent.

## Weaknesses and exit criteria / Riscos e critérios de conclusão

| Priority | Risk | Evidence / Acceptance criterion |
|---|---|---|
| P0 | No documented source lineage for every CSV | Add original providers, extraction date, license/usage rights, transformation steps and a reproducible refresh plan. |
| P0 | Possible mismatches across matches, team standings and scorers | Reconcile match IDs, goals, own goals, teams, duplicate player IDs and score totals; retain a test log. |
| P0 | Disconnected global `matches` KPIs when filtering teams | Clearly distinguish tournament-wide KPIs from filtered ones; test interaction paths or redesign model. |
| P1 | `Partidas com mais gols` may sort by date, despite title | Create per-match total goals and sort descending, preserving `match_id`. |
| P1 | Top N may show more than 10 teams due to ties | Document tie behavior or apply deterministic ranking tie-breaks. |
| P1 | Date field contains ISO strings and times | Convert DateTimeZone carefully; label tournament-local or Brazil-time convention. |
| P1 | Stage labels not uniformly translated | Use calculated `Etapa PT` column; test fallback. |
| P1 | Goal totals and averages may be displayed rounded | Format match scores as integers, mean as 2 decimals, totals with no thousands abbreviation. |
| P1 | Some player-stat fields were incompletely verified | Flag coverage, do not present missing assists / penalties as zeros. |
| P1 | `.pbix` may point to local file paths | Test opening/refreshing it on a second computer before public release. |
| P2 | City, stadium, knockout visual and map still in backlog | Add an auditable venues table keyed by `match_id`; build knockout flow and tooltips. |
| P2 | No bilingual report UI yet | Translate report labels or state English names are original source values. |
| P2 | Stadium background image licensing unknown | Verify permission/source or use a licensed/own image before final public distribution. |
| P2 | Limited insight storytelling | Add three non-obvious insights with clear measures, context and data validation. |

## Recommended case-study narrative

**Problem → Data sources → Cleaning and numeric locale bug → Model → DAX logic → Validated insights → Limitations → Interactive report / downloadable PBIX when ready.**

**Warning:** This is an evaluation of the accessible report and uploaded files, not a guarantee that all underlying data has been independently audited match by match.

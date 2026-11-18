# Hello, City! — What the City's 156 Service Requests Reveal

**Project 03 · SQL / MySQL · Data Quality · Exploratory Data Analysis**  
**Version 0.1 — preliminary findings | Work in progress** · [Português](README.md)

> **Main question:** What do Curitiba's 156 municipal service records reveal about service demand patterns, and what data-quality precautions are needed to analyze them reliably?

| Records | Distinct requests | Variables | Observed period |
|---:|---:|---:|---|
| **41,490** | **39,451** | **21** | **Apr 1–May 1, 2024** |

**Navigation:** [The Problem](#1-the-problem) · [The Approach](#2-the-approach) · [The Results](#3-the-results) · [Project webpage](index.html)

---

## 1. The Problem

Curitiba's 156 municipal service channel logs requests, complaints, reports and other citizen inquiries. Studying these records may help identify **when** people submit requests and, in future stages, **which topics** and **locations** dominate. But the unit of analysis must first be understood: one request ID can appear in multiple rows.

This first release covers structural and quality checks, record granularity, and temporal patterns. Analyses by topic, municipal department and geographic area remain under development.

**Data source:** https://156.curitiba.pr.gov.br/Estatistica/Saiba-sobre-os-dados-de-atendimento-da-central-156

---

## 2. The Approach

### Tools used

| Tool | Role |
|---|---|
| **MySQL 8.0.44** | SQL querying and analysis |
| **DBeaver Community 26.2.4** | Running queries and verifying outputs |
| **Visual Studio Code** | Initial schema inspection |
| **SQL** | CTEs, grouping, duplicate investigations, time functions and checks |
| **Python / Matplotlib** | Static charts built from aggregated SQL exports |
| **GitHub / GitHub Pages** | Project documentation and presentation |

### Workflow

**Data exploration → quality audit → duplication analysis → date/time preparation → temporal SQL analysis → validation → visual storytelling.**

### Quality findings and decisions

| Check | Verified result | Analytical decision |
|---|---|---|
| Request granularity | 41,490 rows, 39,451 distinct request IDs | Count distinct requests when measuring demand |
| Repeated requests | 2,030 request IDs appear more than once | Inspect contents, not blindly delete duplicates |
| Response variations | 1,664 repeated requests have different `RESPOSTA_FINAL` values | Preserve response versions |
| Exact-content redundancy | 372 excess rows identical except for `id` | Avoid treating them as additional requests |
| Missing agency | 16,875 rows (40.67%) have no `ORGAO` | Do not automatically substitute `ORGAO_RESP` |
| Dates | All 41,490 values converted using `STR_TO_DATE` | Convert at query time |
| Times | All 41,490 values include trailing spaces; valid after `TRIM` | Clean text before `CAST(... AS TIME)` |
| Encoding | Some accented values show replacement characters | Investigate origin before renaming categories |

Among the 2,030 repeated request IDs, there were **no differences** in `TIPO`, `ASSUNTO`, `SUBDIVISAO`, `DATA`, `HORARIO`, `BAIRRO_ASS`, or `REGIONAL_ASS`.

### SQL example — count requests, not repeated records

```sql
SELECT
    COUNT(*) AS total_records,
    COUNT(DISTINCT SOLICITACAO) AS distinct_requests
FROM modulosql.chamados156;
```

### SQL example — audit repeated request IDs with window functions

A `ROW_NUMBER()` window lets us separate additional rows from distinct request IDs without assuming every repeated row is an exact duplicate:

```sql
WITH protocolos AS (
    SELECT SOLICITACAO, id,
        ROW_NUMBER() OVER (
            PARTITION BY SOLICITACAO ORDER BY id
        ) AS rn
    FROM modulosql.chamados156
)
SELECT COUNT(*) AS records,
       COUNT(DISTINCT SOLICITACAO) AS unique_requests,
       SUM(CASE WHEN rn > 1 THEN 1 ELSE 0 END)
           AS additional_rows
FROM protocolos;
```

There are **2,030 repeated request IDs but 2,039 additional rows**, because 2,023 IDs occur twice, five three times, and two four times. Additional rows may contain different replies. [See complete window-function audit](sql/06_window_functions_auditoria.sql).

### SQL example — hourly distribution

```sql
SELECT
    HOUR(CAST(TRIM(HORARIO) AS TIME)) AS hour_of_day,
    COUNT(DISTINCT SOLICITACAO) AS total_requests
FROM modulosql.chamados156
GROUP BY hour_of_day
ORDER BY hour_of_day;
```

The heatmap query uses **CTEs, JOIN and date/time functions** to divide hourly request counts by the number of occurrences of each weekday. [View heatmap SQL](sql/04_heatmap.sql) and the [execution guide](sql/README.md).

**Chart reproducibility:** the [aggregated heatmap CSV](data/heatmap_agregado.csv) contains no individual records. Install Python, NumPy and Matplotlib, then run `python scripts/gerar_graficos.py` to regenerate charts.

**Validation:** temporal outputs reconcile to **39,451 distinct requests**. Source records were left unchanged.

---

## 3. The Results

### Finding 01 — Requests peak during business hours

![Distinct requests by hour](assets/solicitacoes_por_hora.png)

**10 a.m.** was the busiest hour with **3,520 distinct requests**. The 9–11:59 a.m. period accounted for **9,942 (25.2%)** requests, while 8 a.m.–5:59 p.m. accounted for **29,026 (73.6%)**.

### Finding 02 — Request volume varies by weekday

![Average daily requests by weekday](assets/media_por_dia_semana.png)

Thursday had the largest average (**1,634.25 requests per observed Thursday**); Sunday the smallest (**594.75**). Average daily weekday volume was approximately **2.09 times** weekend volume.

### Finding 03 — Weekday × hour heatmap

![Heatmap of average requests by weekday and hour](assets/heatmap_dia_hora.png)

The highest hourly weekday average occurred on **Monday at 10 a.m. (147.2)**, followed closely by **Thursday at 11 a.m. (146.25)**. Heatmap values are normalized by the number of observed days.

### Finding 04 — Data quality affects analytical counts

**2,030** request IDs occur in more than one record, **372** excess rows are fully redundant apart from `id`, and **40.67%** of records lack `ORGAO`. The project explicitly differentiates request IDs from raw rows.

### Finding 05 — Bat-related service requests: geography and time of reporting

Filtering `SUBDIVISAO = 'Morcegos'` found **97 records representing 95 distinct request IDs**, distributed over **47 neighborhoods**. Of those, **46 (48.4%)** were in **Matriz**, compared with Matriz's **20.9%** share of all 156 requests. This describes a concentration of reports, not a measured concentration of bats or confirmed illnesses.

| Neighborhood | Requests |
|---|---:|
| Centro | 14 |
| Batel | 9 |
| Cajuru | 6 |
| Cristo Rei | 5 |

#### When were the requests logged?

| Time period | Distinct requests | Share |
|---|---:|---:|
| Overnight (00:00–05:59) | 3 | 3.2% |
| Morning (06:00–11:59) | 39 | 41.1% |
| Afternoon (12:00–17:59) | 27 | 28.4% |
| Evening (18:00–23:59) | 26 | 27.4% |
| **Total** | **95** | **~100%** |

The busiest individual hour was **9 a.m. (11 requests)**. The recorded time refers to when the request was logged, **not necessarily when the bat was sighted**.

#### Normalized geographic comparison

The Matriz district recorded approximately **5.59 bat-related requests per 1,000 requests to the 156 service**, versus **1.57 per 1,000 in all other districts combined** — roughly **3.6 times the relative frequency**. This denominator is the number of 156 requests, **not the resident population**. It cannot measure bat abundance, human exposure or disease incidence.

#### Public-health implications

These data identify where more requests were registered; they do not establish any confirmed rabies cases. One **option for technical assessment** is to compare these reports with surveillance information and additional periods to examine the reach of public guidance and follow-up monitoring.

Curitiba's [Zoonosis Surveillance Unit](https://saude.curitiba.pr.gov.br/conteudo/zoonoses-e-vetores/1603) advises residents not to handle bats found in unusual circumstances and to request specialized assistance via the 156 service where appropriate.

**[View the bat-analysis SQL queries](sql/07_morcegos_geografia_horarios.sql).** The aggregations were checked in a local SQL database using the exported CSV; the MySQL 8-compatible scripts have not been rerun against the original server.

### Limitations and next steps

This dataset covers **Apr 1–May 1, 2024** only. Results are descriptive, not causal, and cannot establish yearly patterns or operating performance. Further topic, agency and geographic analyses are planned as next steps.

---

[Project webpage](index.html) · [SQL scripts](sql/README.md) · [Data dictionary (PT)](docs/dicionario_dados.md) · [Technical notes (PT)](docs/registro_etapas.md)

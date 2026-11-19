# Hello, City! — What the City's 156 Service Requests Reveal

**Project 03 · SQL / MySQL · Data Quality · Exploratory Data Analysis**  
**Version 0.2 — preliminary findings | Work in progress** · [Português](README.md)

> **Main question:** What do Curitiba's 156 municipal service records reveal about service demand patterns, and what data-quality precautions are needed to analyze them reliably?

| Records | Distinct requests | Variables | Observed period |
|---:|---:|---:|---|
| **41,490** | **39,451** | **21** | **Apr 1–May 1, 2024** |

**Navigation:** [Visual index](index.html#indice) · [1. The Problem](#1-the-problem) · [2. The Approach](#2-the-approach) · [2.1 Checklist](index.html#data-checklist) · [2.2 SQL code](index.html#sql-examples) · [3. Results](#3-the-results) · [3.4 Bat case study](index.html#bats-findings)

---

## 1. The Problem

Curitiba's 156 municipal service channel logs requests, complaints, reports and other citizen inquiries. Studying these records may help identify **when** people submit requests and, in future stages, **which topics** and **locations** dominate. But the unit of analysis must first be understood: one request ID can appear in multiple rows.

This first release covers structural and quality checks, record granularity, and temporal patterns. Further analyses by topic, municipal department and geography are planned; the specific bat-related case study is already presented in the findings.

**Data source:** https://156.curitiba.pr.gov.br/Estatistica/Saiba-sobre-os-dados-de-atendimento-da-central-156

---

## 2. The Approach

### 2.1 Data intake and quality checklist — before the first analysis

Before calculating metrics, the dataset is profiled and audited. The status below refers **only to checks documented for this project**:

- [x] **Identify the source and preserve the original:** record the official source and observation window; do not overwrite raw data.
- [x] **Inventory rows and columns:** **41,490 records across 21 fields**.
- [ ] **Review data types:** compare SQL storage types with expected semantic types; `DATA` and `HORARIO` require parsing, while a complete review is pending.
- [x] **Validate dates and times:** 31 calendar days; **41,490 valid time values after `TRIM`**.
- [x] **Investigate keys and duplicates:** **39,451 distinct requests**, with **2,030 repeated request IDs**; preserve different response versions.
- [ ] **Audit nulls and blanks across every column:** `ORGAO` has 16,875 missing values and `BAIRRO_ASS` has 71; full-column coverage remains pending.
- [ ] **Review categories and encoding:** investigate spelling and accented-character issues before standardizing.
- [x] **Check consistency across records:** key fields for repeated request IDs were compared.
- [x] **Protect sensitive data and document decisions:** raw individual-level records are not published; aggregated results and SQL scripts are documented.

`[x]` = verified; `[ ]` = partially checked or pending. No record is deleted and no missing value is filled automatically.

**SQL example — inspect the database schema first:**

```sql
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = 'modulosql'
  AND TABLE_NAME = 'chamados156'
ORDER BY ORDINAL_POSITION;
```

[Full initial profiling SQL](sql/00_checklist_recebimento.sql) · [Two-column visual checklist with review status](index.html#data-checklist)

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

The audit also identified **372 fully redundant extra rows (excluding `id`)**, while **40.67% of rows have an empty `ORGAO` field**. These findings explain why raw row counts and distinct request counts should be reported separately.

### 2.2 Applied SQL examples

#### Example — count requests, not repeated records

```sql
SELECT
    COUNT(*) AS total_records,
    COUNT(DISTINCT SOLICITACAO) AS distinct_requests
FROM modulosql.chamados156;
```

#### Example — audit repeated request IDs with window functions

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

#### Example — hourly distribution

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

### 3.1 Requests peak during business hours

![Distinct requests by hour](assets/solicitacoes_por_hora.png)

**10 a.m.** was the busiest hour with **3,520 distinct requests**. The 9–11:59 a.m. period accounted for **9,942 (25.2%)** requests, while 8 a.m.–5:59 p.m. accounted for **29,026 (73.6%)**.

### 3.2 Request volume varies by weekday

![Average daily requests by weekday](assets/media_por_dia_semana.png)

Thursday had the largest average (**1,634.25 requests per observed Thursday**); Sunday the smallest (**594.75**). Average daily weekday volume was approximately **2.09 times** weekend volume.

### 3.3 Weekday × hour heatmap

![Heatmap of average requests by weekday and hour](assets/heatmap_dia_hora.png)

The highest hourly weekday average occurred on **Monday at 10 a.m. (147.2)**, followed closely by **Thursday at 11 a.m. (146.25)**. Heatmap values are normalized by the number of observed days.

### 3.4 🦇 Specific finding: Bat-related requests across Curitiba

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

#### Public health and living alongside wildlife

Bats are part of nature and contribute to ecological balance. A sighting is not, in itself, evidence of disease. A responsible response combines wildlife protection with public safety: do not harm, kill or try to capture bats; avoid contact and keep children and pets at a safe distance in unusual situations.

Residents can seek specialist guidance through the 156 service when appropriate, as indicated by Curitiba's [Zoonosis Surveillance Unit](https://saude.curitiba.pr.gov.br/conteudo/zoonoses-e-vetores/1603). After physical contact, prompt advice from a healthcare service is important.

These records may help municipal teams assess where preventive guidance could be strengthened, but they do not establish rabies cases or measure bat populations.

**[View the bat-analysis SQL queries](sql/07_morcegos_geografia_horarios.sql).** The aggregations were checked in a local SQL database using the exported CSV; the MySQL 8-compatible scripts have not been rerun against the original server.

### Limitations and next steps

This dataset covers **Apr 1–May 1, 2024** only. Results are descriptive, not causal, and cannot establish yearly patterns or operating performance. Further topic, agency and geographic analyses are planned as next steps.

---

[Project webpage](index.html) · [SQL scripts](sql/README.md) · [Data dictionary (PT)](docs/dicionario_dados.md) · [Technical notes (PT)](docs/registro_etapas.md)

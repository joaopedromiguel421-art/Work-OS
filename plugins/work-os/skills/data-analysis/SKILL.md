---
name: data-analysis
description: "Data-analysis procedure for profiling, cleaning, querying, statistics, visualization, interpretation, and reproducible decision evidence from supplied or authorized data. Use when the core task is to understand an existing dataset or quantitative result. Do not use to design tracking schemas, gather market evidence, or access sensitive production data without authorization."
---

# Data analysis

## Method

1. State the decision/question, population, unit of analysis, target measures, time range, and expected output.
2. Establish provenance, authorization, data dictionary, extraction time, grain, joins, missingness, privacy classification, and known changes.
3. Profile types, ranges, uniqueness, duplicates, missing data, outliers, category drift, time coverage, and reconciliation totals.
4. Write a reproducible transformation plan. Preserve raw input, record filters/assumptions, and avoid silent coercion or deletion.
5. Choose analysis appropriate to design and data: descriptive summaries, cohorts, funnels, comparisons, models, or uncertainty estimates. Check assumptions and confounding.
6. Use visualizations only when they clarify a relationship. Label units, denominators, sample sizes, uncertainty, filters, and time.
7. Stress-test conclusions across definitions, segments, missing-data choices, outliers, and plausible alternatives.
8. Separate result, interpretation, causal limits, decision implication, and next evidence.

## Determinism and privacy

Prefer repository scripts/queries/notebooks that can be rerun and reviewed, with schema and result sanity checks in quality when stable. Minimize personal data, redact outputs, use aggregates, and never place credentials or raw sensitive extracts in logs/Git.

## Boundaries

Use `analytics-measurement` to define instrumentation, `evidence-research` for external facts, `market-intelligence` for competitors, and `cro-experimentation` for the experiment contract.

## Output

Question, provenance/quality report, reproducible method, results, visualization/table, uncertainty/sensitivity, limitations, recommendation, and artifact paths.

## Sources and adaptation

Original synthesis informed by data-analysis and research output contracts in Anthropic Knowledge Work Plugins. No external analytics service is enabled.

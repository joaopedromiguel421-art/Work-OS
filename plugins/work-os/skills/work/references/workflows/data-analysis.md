# Data analysis workflow

## Entry

- Required: decision/question, authorized dataset/source, unit/population, time range, expected output, and privacy constraints.

## Main-conversation sequence

1. Use `data-analysis` to establish provenance, grain, dictionary, extraction time, authorization, and decision criteria.
2. Profile types, coverage, duplicates, missingness, outliers, joins, categories, and reconciliation totals before modeling or charting.
3. Record transformations, filters, assumptions, and analysis method in a reproducible repository artifact written by the main conversation. Preserve raw authorized input and avoid committing sensitive extracts.
4. Validate statistical/design assumptions and run sensitivity checks across material definitions or segments.
5. Use `analytics-measurement` only when the source instrumentation/metric contract is the problem; use `evidence-research` for an external benchmark.
6. Produce tables/visuals that state units, denominators, samples, uncertainty, filters, and time.
7. Run schema, query/script, result sanity, and standard quality checks configured for the project.

## Separate context and parallelism

Keep core dataset analysis in main because transformations and interpretation are dependent. `research-scout` may independently source a public benchmark without receiving private data. Do not create a generic analyst subagent.

## Complete when

The analysis is reproducible; data quality and privacy limits are explicit; results reconcile to known totals where applicable; uncertainty/causal limits are visible; the recommendation answers the entry decision; artifacts contain no secrets or unnecessary personal data.

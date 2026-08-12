---
name: performance-engineering
description: "Measurement-first procedure for latency, throughput, resource, bundle, rendering, build, or query performance. Use when a concrete performance symptom, budget, regression, or capacity question exists. Do not use for vague premature optimization or when correctness and user impact have not been established."
---

# Performance engineering

## Method

1. Define the user/system outcome and a metric with workload, percentile, environment, and budget.
2. Capture a reproducible baseline and variance. Confirm the bottleneck rather than optimizing the most visible code.
3. Instrument or profile the critical path. Attribute time/resources across compute, I/O, network, database, rendering, serialization, caching, and queueing as applicable.
4. Form one falsifiable hypothesis at a time and estimate likely impact and tradeoffs.
5. Make the smallest change that tests the hypothesis. Re-measure against the same workload.
6. Check correctness, cold/warm behavior, tail latency, resource transfer, and regressions on representative lower-end environments.
7. Encode stable budgets or benchmarks as deterministic, appropriately noisy gates. Fast checks may warn; reliable release budgets may block.

## Frontend dimensions

Measure delivery size, critical requests, render/interaction timings, layout stability, image/font behavior, hydration/client work, and accessibility impacts. Do not trade semantic correctness for a synthetic score.

## Backend dimensions

Measure concurrency, queueing, database plans, allocation, cache hit behavior, external calls, timeouts, and saturation. A local microbenchmark is not production capacity evidence by itself.

## Output

Metric/budget, baseline, profile evidence, bottleneck, hypothesis, change, before/after distribution, tradeoffs, and regression gate.

## Companions

Use `testing-strategy` for functional safeguards, `database-changes` for persistent/index changes, and `analytics-measurement` for product outcome measurement.

## Sources and adaptation

Original synthesis informed by web performance checklists in Addy Osmani's Agent Skills and interface performance concerns in Impeccable. No framework-specific optimization is imposed.

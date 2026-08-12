---
name: analytics-measurement
description: "Measurement-design procedure for KPIs, event schemas, identity, attribution, consent, data quality, dashboards, and experiment instrumentation. Use when defining or repairing how product or business behavior is measured. Do not use for interpreting an already-supplied dataset, market research, or selecting a product strategy without measurement scope."
---

# Analytics and measurement

## Method

1. Start from a decision and behavioral outcome. Define the primary metric, guardrails, owner, cadence, and action each result enables.
2. Write exact metric semantics: population, numerator/denominator, grain, filters, source, timezone, attribution/window, late data, and exclusions.
3. Map the user/system journey and define the minimum event set. Each event has an owner, trigger, properties, types, required/optional status, privacy classification, and version.
4. Define identity and session rules, anonymous-to-known merging, consent, retention, deletion, regional constraints, and access control.
5. Specify implementation points and deterministic schema/contract tests. Avoid sending secrets, free-form sensitive text, or unnecessary personal data.
6. QA with known journeys, duplicate/missing events, ordering, retries, ad blockers/offline cases, platform parity, and reconciliation to source systems.
7. Design reporting around decisions and diagnostic drill-downs. A dashboard is not a substitute for a metric contract.
8. Record definitions in `context/metrics.md` and date any material logic change.

## Boundaries

Use `data-analysis` for analysis after trustworthy data exists, `cro-experimentation` for experiment design, and `performance-engineering` for system performance telemetry. External analytics MCPs are opt-in and never receive credentials by default.

## Output

Decision/metric tree, metric contracts, tracking plan, event/property schema, identity/privacy rules, QA cases, dashboard specification, ownership, and migration/version plan.

## Sources and adaptation

Original consolidation informed by analytics procedures in Marketing Skills and data/research output contracts in Anthropic Knowledge Work Plugins.

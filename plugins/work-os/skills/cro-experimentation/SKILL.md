---
name: cro-experimentation
description: "Conversion-research and experimentation procedure for diagnosing friction, forming hypotheses, prioritizing tests, and interpreting results. Use when a defined funnel or page has baseline behavior and a conversion decision to improve. Do not use for a redesign with no hypothesis, analytics setup alone, or claims that a small/noisy result proves causality."
---

# CRO experimentation

## Method

1. Define the conversion, eligible population, funnel step, baseline period, segment, business value, and guardrails.
2. Validate instrumentation before diagnosing behavior. If event semantics are uncertain, invoke `analytics-measurement` first.
3. Combine quantitative evidence with qualitative evidence such as usability observations, support themes, search behavior, and sales objections. Separate signal from anecdote.
4. Identify friction or motivation gaps and write hypotheses in causal form: because evidence indicates X, changing Y for Z should move metric M without harming guardrails G.
5. Prioritize by evidence strength, potential impact, cost, risk, reversibility, and learning value. Do not use pseudo-precision.
6. Specify control/treatment, primary metric, guardrails, exposure unit, eligibility, sample/duration assumptions, novelty/seasonality risks, QA, and stopping/decision rules before launch.
7. Require human approval for live experiment activation. Analyze according to the declared method, including uncertainty and segment checks chosen in advance.
8. Decide ship, iterate, stop, or gather more evidence. Record negative and inconclusive results.

## Guardrails

No deceptive patterns, hidden fees/consent, false urgency, accessibility regression, or manipulation of vulnerable users. Do not peek until a desired result appears or present correlation as causal.

## Boundaries

Use `landing-page` for page creation, `interface-design` for interaction fixes, `copy-and-content` for treatments, and `data-analysis` for deeper supplied-data analysis. This Skill owns the experiment contract.

## Output

Baseline/diagnosis, evidence-ranked hypotheses, experiment design, instrumentation/QA, approval gate, result with uncertainty, decision, and learning log.

## Sources and adaptation

Original consolidation informed by CRO procedures in Marketing Skills and measurement/research contracts in Anthropic Knowledge Work Plugins.

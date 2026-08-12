---
name: testing-strategy
description: "Risk-based testing procedure for choosing coverage, boundaries, fixtures, and deterministic evidence. Use when a change needs a test plan, a regression test, flaky-test diagnosis, or missing quality coverage. Do not use merely to run an already-defined test command or to replace a failing test with model review."
---

# Testing strategy

## Method

1. List changed behaviors, critical invariants, user-visible failure modes, and trust/data boundaries.
2. Rank risk by likelihood, impact, detectability, and reversibility.
3. For each material risk, choose the cheapest reliable boundary:
   - pure unit test for deterministic logic;
   - component/module test for contracts and edge states;
   - integration test for storage, network, serialization, or framework boundaries;
   - end-to-end test only for a critical cross-system journey;
   - static/schema/security/performance tool when the property is deterministic.
4. Define fixtures that are minimal, isolated, explicit about time/randomness, and free of real secrets.
5. For a bug, first create evidence that reproduces the cause; add a regression test that would fail without the fix when practical.
6. Eliminate sleeps and shared state. Control clocks, randomness, concurrency, and external services.
7. Put each command in `quality/quality.json` under the lowest profile whose latency fits.

## Review questions

- Does the assertion test behavior rather than implementation trivia?
- Can the test fail for the intended reason and explain that reason?
- Are negative, boundary, accessibility, authorization, and recovery cases covered where risk warrants?
- Does the suite run across supported operating systems without shell assumptions?
- Is duplicate coverage adding signal or only runtime?

## Boundaries

Use `performance-engineering` for measured budgets, `security-engineering` for threat-driven abuse cases, and `database-changes` for migration verification. A test-review subagent is not created; independent review is only justified through the security or UX agents for those domains.

## Output

Risk-to-test matrix, new/changed checks, fixture strategy, profile placement, expected failure signal, and observed results.

## Sources and adaptation

Original consolidation of evidence-first regression discipline from Superpowers and frontend/testing checklist concepts from Addy Osmani's Agent Skills.

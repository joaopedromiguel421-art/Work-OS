---
name: spec-delivery
description: "Spec-driven delivery procedure for a non-trivial change with multiple requirements, risks, or acceptance criteria. Use when a feature, refactor, migration, or cross-file change needs an explicit contract and plan. Do not use for a tiny reversible edit whose intent and verification are already obvious."
---

# Spec-driven delivery

## Authority

One active change lives under `specs/changes/<change>/`. `spec.md` defines the outcome and contract, `plan.md` defines slices and gates, and `tasks.md` tracks evidence. `specs/current.md` is only an index.

## Method

1. Establish current behavior and evidence before proposing change.
2. Define outcome, actors, requirements, non-goals, affected contracts, constraints, and measurable acceptance criteria.
3. Record open questions. Resolve those that change architecture or user behavior before implementation; defer only questions with an explicit owner and gate.
4. Describe deltas from current behavior, including compatibility, data, rollout, observability, security, and recovery.
5. Plan small end-to-end slices. Each slice names files/surfaces, deterministic checks, and completion evidence.
6. Implement in the main conversation. Update tasks only when evidence exists.
7. Run the configured standard quality profile, update durable documentation, and verify every acceptance criterion.
8. Move the whole change folder to `specs/archive/` and remove it from the current index.

## Escalation

Invoke `architecture-decisions` for an expensive-to-reverse or cross-boundary tradeoff. Invoke `database-changes`, `security-engineering`, or `testing-strategy` for their distinct risk surfaces. Do not create a planner subagent; dependent planning stays in the main conversation.

## Completion evidence

Map each acceptance criterion to a test, observed behavior, or reviewed artifact. A narrative claim without evidence is not complete. A failing deterministic check cannot be waived by this Skill.

## Output

A bounded spec, implementation slices, task checklist, risk/approval points, quality profile, and archival action.

## Sources and adaptation

Combines the current/change/archive lifecycle of OpenSpec with the specification/plan/tasks separation of GitHub spec-kit. It omits both projects' command systems and runtime orchestration.

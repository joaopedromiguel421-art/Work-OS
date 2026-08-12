---
name: architecture-decisions
description: "Decision procedure for durable technical tradeoffs that cross boundaries or are costly to reverse. Use when choosing system structure, contracts, data ownership, trust boundaries, or foundational dependencies. Do not use for routine implementation choices, naming, formatting, or a decision already governed by an accepted ADR."
---

# Architecture decisions

## ADR trigger

Create or replace an ADR when a choice changes a public contract, ownership or trust boundary, runtime/deployment model, data authority, foundational dependency, compliance posture, or recovery model; or when reversal would be materially costly.

## Method

1. State the forcing context, decision deadline, constraints, and affected stakeholders.
2. Verify the current architecture and non-negotiable project principles.
3. Define evaluation criteria before comparing options: correctness, simplicity, security, operability, cost, performance, reversibility, portability, and migration burden as applicable.
4. Compare a small viable set, including retaining the current design. Use evidence, not option count, to drive depth.
5. Identify failure modes, trust/data flow, operational ownership, rollout, recovery, and exit conditions.
6. Choose one option. Record why it wins, why alternatives lose, consequences, and signals that would justify replacement.
7. Link the ADR from the affected spec and update the architecture overview only with the resulting durable fact.

## Boundaries

Keep dependent architecture reasoning in the main conversation. `research-scout` may collect independent vendor/standard evidence, and `security-reviewer` may challenge a security-sensitive decision, but neither chooses or writes the ADR.

Avoid speculative platform layers. Prefer an existing native mechanism and a reversible local decision. Do not abstract a single use case without demonstrated repetition.

## Output

ADR with status/date, context, criteria, considered options, decision, consequences, rollout/recovery, replacement conditions, and evidence links.

## Sources and adaptation

Original Work OS procedure informed by spec-kit governance concepts and the plan-before-change discipline from Superpowers. No external architecture agent is imported.

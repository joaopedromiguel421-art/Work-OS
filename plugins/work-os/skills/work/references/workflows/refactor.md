# Refactor workflow

## Entry

- Required: target boundary, reason, invariants to preserve, and measurable improvement.
- Refuse vague cleanup: name the maintenance, reliability, performance, or delivery cost being reduced.

## Main-conversation sequence

1. Read current contracts, architecture, active specs, and tests. Capture behavior/invariants before structure changes.
2. Use `spec-delivery` for a multi-file or contract-adjacent refactor; list explicit non-goals.
3. Use `testing-strategy` to close only coverage gaps that threaten the invariants.
4. Use `architecture-decisions` if ownership, public contracts, trust boundaries, or foundational dependencies change; otherwise do not create an ADR.
5. Split mechanical moves from semantic changes. Keep slices buildable and reviewable.
6. Implement in the main conversation, running fast checks after each coherent slice.
7. Remove compatibility shims only after all consumers and rollback implications are verified.
8. Run standard quality and compare behavior/performance evidence to the baseline.

## Separate context and parallelism

No custom subagent by default because repository discovery and edits are tightly dependent. `security-reviewer` or `ux-critic` is justified only when the refactor changes those observable risk surfaces.

## Complete when

Named invariants hold; improvement evidence exists; obsolete code/tests/docs are removed deliberately; no accidental public/data contract change remains; standard gates pass; the spec is archived.

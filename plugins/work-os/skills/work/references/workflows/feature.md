# Feature workflow

## Entry

- Required: user outcome, affected surface, and repository access.
- Resolve before implementation: measurable acceptance criteria and material product ambiguity.
- Optional: issue, design, API contract, rollout constraints, and deadline.

## Main-conversation sequence

1. Read `CLAUDE.md`, applicable rules, `context/project.md`, `context/architecture.md`, `specs/current.md`, and the relevant code.
2. Establish baseline behavior with the smallest deterministic check available.
3. Use `product-discovery` only if the desired outcome or user problem is unclear.
4. Use `spec-delivery` to create a bounded change spec with requirements, non-goals, acceptance criteria, risks, and an implementation plan.
5. Use `architecture-decisions` only for a consequential, durable tradeoff; write an ADR when its trigger criteria are met.
6. Implement one verified slice at a time in the main conversation. The main conversation owns all writes.
7. Use `testing-strategy` for the risk-based test plan and add the cheapest reliable test at the appropriate boundary.
8. Run `quality:fast` after write batches and `quality:standard` before completion.
9. Update context or technical documentation only when durable facts changed.
10. Move the completed change from `specs/changes/` to `specs/archive/` and update `specs/current.md` after all gates pass.

## Separate context

- No custom subagent by default.
- `research-scout` may investigate an independent external/API question whose raw evidence would pollute the main context.
- `security-reviewer` may perform a final independent read-only review when the feature changes authentication, authorization, secrets, payments, personal data, network trust, or dependency execution.
- `ux-critic` may perform a final independent read-only critique for a material interface flow.
- Independent final reviews may run in parallel, at most two. Their findings return to the main conversation before any fix.

## Quality gates

- Fast: project overlay validity and configured low-latency formatter/lint/type checks.
- Standard: required lint, typecheck, unit/integration tests, build, and configured security checks.
- Human approval: production rollout, credentials, deploy, consequential migrations, external publication, or spending.

## Complete when

- Every acceptance criterion has evidence.
- Required standard checks pass.
- No unresolved high-severity security or correctness finding remains.
- Documentation and decisions match the resulting behavior.
- The diff is scoped to the spec and no sensitive action was taken without approval.

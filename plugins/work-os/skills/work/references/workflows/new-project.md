# New project workflow

## Entry

- Required: project purpose, repository path, intended users, and owner.
- Resolve: scope/non-goals, supported environments, sensitive data or production boundaries, and first measurable outcome.

## Main-conversation sequence

1. If the overlay is absent, run the `init` preview/apply flow before other writes.
2. Use `product-discovery` to define the user problem, outcome, assumptions, and first learning/delivery target.
3. Use `evidence-research` or `market-intelligence` only for decisions that need external evidence.
4. Inspect the actual stack and update `context/project.md`, `product.md`, `architecture.md`, users/brand/metrics only where facts are known.
5. Use `architecture-decisions` for foundational runtime, data, trust, or deployment choices that cross its ADR threshold.
6. Configure `quality/quality.json` with the repository's existing formatter, lint, typecheck, test, build, security, schema, accessibility, and performance commands. Keep disabled placeholders out of the required path.
7. Use `spec-delivery` to define the first bounded vertical slice and implement it in the main conversation.
8. Run fast, standard, then release profile when the project is intended for publication.

## Separate context and parallelism

No custom subagent by default. Up to two independent `research-scout` branches may compare technology or market evidence before an ADR; the main conversation decides. Security/UX reviewers enter only after a relevant artifact exists.

## Complete when

The overlay passes doctor; context has owners and no invented facts; quality commands match the stack and run cross-platform; foundational ADRs exist where triggered; the first slice has acceptance evidence; no MCP/credential/deploy is enabled without approval.

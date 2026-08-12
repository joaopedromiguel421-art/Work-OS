# {{PROJECT_NAME}} project instructions

This repository uses Work OS {{WORK_OS_VERSION}}. Start with the project files below; use plugin Skills for procedures instead of expanding this file.

## Read first

- `context/project.md`: purpose, scope, stakeholders, and constraints.
- `context/product.md`: users, jobs, outcomes, and roadmap boundaries.
- `context/architecture.md`: system map, trust boundaries, and dependencies.
- `specs/current.md`: active work and links to change specs.
- `docs/decisions/`: accepted architecture decisions.
- `quality/quality.json`: the only local/CI quality manifest.

Read other context files only when relevant. Path-specific rules under `.claude/rules/` load when matching files are accessed.

## Operating rules

- Keep integrated planning, dependent work, and all writes in the main conversation.
- Use a Skill for a reusable specialist procedure. Do not create a subagent merely to represent a job title.
- Custom Work OS subagents are read-only evidence/review workers. They cannot spawn agents.
- Use at most two custom subagents concurrently and three total per task; parallelize only independent read-only branches.
- Run deterministic questions through the quality manifest, hooks, or CI. Do not replace a failing check with an opinion.
- Make the smallest coherent change. Preserve existing user changes and avoid unrelated cleanup.
- Record a spec for non-trivial changes and an ADR for durable consequential tradeoffs.
- Update durable context when facts change; archive completed specs instead of growing current context indefinitely.

## Sensitive boundaries

Get explicit human approval before production access, credentials, deploys, external messages or purchases, destructive operations, irreversible database changes, force pushes, critical infrastructure, or unreviewed third-party scripts.

No MCP server or credential is enabled by this overlay. Integrations are project-specific, opt-in, least-privilege, and documented before use.

## Verification

- Run the fast profile during implementation.
- Run the standard profile before claiming completion.
- Run the release profile only for a release or deploy candidate.
- Return exact failing check IDs and concise repair evidence.

Initialized: {{INIT_DATE}}.

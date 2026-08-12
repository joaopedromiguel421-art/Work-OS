---
name: project-context
description: "Manual maintenance procedure for the versioned Work OS project context. Use when the user explicitly asks to initialize, audit, reconcile, or refresh project context. Do not use automatically during ordinary implementation or to store transient chat history."
disable-model-invocation: true
argument-hint: "<audit|refresh|reconcile>"
---

# Project context maintenance

The main conversation owns every edit. Treat Git-tracked project files as authority and auto memory as a fallible convenience.

## Procedure

1. Read `CLAUDE.md`, `context/.work-os.json`, all short files in `context/`, `specs/current.md`, active change specs, and ADR indexes.
2. Locate contradictions, duplicate assertions, stale TODOs, missing owners, unlinked decisions, volatile facts without dates, and files that have grown beyond their role.
3. Verify proposed durable facts against code, configuration, accepted ADRs, or cited evidence. Mark uncertainty rather than guessing.
4. Propose a compact change set grouped as add, update, move to archive, link, or delete-after-review.
5. Apply only after the user has requested the maintenance operation; preserve unrelated content and never convert a transcript into permanent context.
6. Run `quality:fast` and report the changed authority for each fact.

## Placement rules

- Root `CLAUDE.md`: small, stable, cross-cutting instructions.
- `.claude/rules/`: path-specific constraints.
- `context/`: current durable facts and indexes.
- `specs/changes/`: bounded active change state.
- `docs/decisions/`: durable consequential choices.
- `specs/archive/`: completed change history.
- Auto memory: preferences or heuristics that are useful but not authoritative.

## Do not retain

Raw browsing dumps, repeated code summaries, resolved debugging trails, secrets, credentials, personal data without need, speculative facts presented as settled, or status that can be derived cheaply from Git.

## Output

Return changed files, contradictions resolved, facts still uncertain, archival actions, and the fast quality result.

## Sources and adaptation

Uses Claude Code's native memory/rules hierarchy and a simplified current/change/archive lifecycle informed by OpenSpec and spec-kit. No upstream text is copied.

# Context and memory

## Authority order

1. Managed/user policy and the repository's root `CLAUDE.md` for durable cross-cutting rules.
2. Path-scoped `.claude/rules/` for local constraints.
3. Accepted ADRs and current project context for durable facts.
4. Active specs for bounded change state.
5. Code/configuration/tests for implemented truth.
6. Auto memory as a heuristic convenience, never the authority.

Subagents receive project instructions and their preloaded Skill but have no persistent memory. Project Git history retains decisions and review. No vector database, embedding service, or custom memory daemon is included.

## Context-rot controls

- Root project `CLAUDE.md` stays under 150 lines in the template and under 200 in validation.
- Rules are path-scoped when they are not needed after every compaction.
- Skill descriptions remain distinct; bodies load only on use.
- `specs/current.md` is an index, not a diary. Completed changes move to archive.
- Context files link to one authority rather than repeat it.
- Volatile facts carry dates/owners; stale claims are removed or marked uncertain.
- Research stores a synthesis and source index, not raw result dumps.
- Compact before lost-in-the-middle becomes severe; `PreCompact` records only small state.

Use `/work-os:project-context audit` for a deliberate reconciliation. Ordinary tasks must not rewrite context merely to summarize the session.

# Architecture

## Decision

Work OS is one marketplace containing one plugin named `work-os`. Claude Code remains the only runtime. The product configures the runtime through native discovery and a small dependency-free Node.js support layer.

| Layer | Authority | Responsibility |
|---|---|---|
| Project context | project `CLAUDE.md`, `.claude/rules`, `context/`, `specs/`, ADRs | Stable facts, boundaries, decisions, current work |
| Procedures | 25 plugin Skills | Reusable domain methods loaded only when relevant |
| Orchestration | main Claude conversation | Integrated reasoning, sequencing, decisions, and all writes |
| Isolation | 3 plugin subagents | Read-only research or independent review with separate context |
| Determinism | hook runtime, quality runner, CI | Permissions, policy checks, tests, build, lint, security, and schemas |
| Integration | opt-in MCPs owned by each project | External systems only after explicit configuration and least privilege |
| Distribution | marketplace and plugin manifests | Native installation and versioned updates |
| Evidence | JSONL logs and versioned artifacts | Events, gates, errors, decisions, workflow/spec records |

## Control flow

1. Claude Code loads the project `CLAUDE.md`, applicable rules, plugin Skill descriptions, agents, and hooks.
2. The main conversation classifies the request. It stays in the main context unless a Skill procedure or separate read-only context clearly helps.
3. A Skill provides method and deliverables; it does not become an autonomous actor.
4. The main conversation may invoke at most two custom subagents concurrently and at most three total per task. Results return as evidence; only the main conversation writes.
5. `PreToolUse` and `PermissionRequest` enforce safety before execution. Post events record activity and return concise context.
6. The shared quality runner executes the project manifest without a shell. `Stop` and CI are authoritative blocking gates.
7. Specs, ADRs, project context, and Git retain durable state. Auto memory is a convenience cache, not an authority.

## Context budget

Root instructions contain only durable cross-cutting constraints. Path rules carry local conventions. Skill descriptions perform routing; Skill bodies load only on use. Current specs stay small and completed changes move to the archive. Research output is summarized with sources rather than pasted into permanent context.

## Conflict prevention

`governance/capabilities.json` names exactly one owner for each capability. Companion Skills may add a distinct lens but cannot redefine the owner. Hooks never duplicate CI logic; both call the same quality runner. Project settings can tighten plugin defaults but may not silently weaken protected policies.

## Explicit exclusions

No agent teams, nested custom agents, saved dynamic workflows, autonomous scheduler, runtime router, vector store, default MCP server, default credentials, deployment automation, or whole-repository vendoring is included in V1.

# Hooks and quality gates

## Hook handlers

| Event | Trigger/action | Blocking behavior |
|---|---|---|
| `SessionStart` | Prune logs; inject compact operating context | Context only |
| `InstructionsLoaded` | Log file/reason/line count | Async, observability only |
| `PreToolUse` | Protect paths, secrets, shell, MCPs, production, installs, agent caps | Deny or ask before execution |
| `PermissionRequest` | Deny protected requests; never auto-allow | Can deny |
| `PostToolUse` | Record tool/Skill usage | Async, non-blocking |
| `PostToolUseFailure` | Record failure; release failed agent reservation | Non-blocking |
| `PostToolBatch` | Run `fast` after write tools | Blocks next loop on required failure |
| `SubagentStart` | Record and inject read-only/nesting boundary | Context only |
| `SubagentStop` | Record duration and release active slot | Does not add an AI gate |
| `PreCompact` | Snapshot small run state to JSONL | Non-blocking |
| `Stop` | Run `standard`; reset task agent counters | Blocks twice, then explicit circuit breaker |
| `SessionEnd` | Final event and state cleanup | Async, non-blocking |
| `ConfigChange` | Audit and reject invalid/bypass/all-hooks-off settings | Can block session application |

## Shared quality manifest

`quality/quality.json` is used unchanged by direct local commands, hooks, and CI. A check has an ID, description, kind (`builtin` or `command`), profiles, required flag, timeout, and for commands an executable plus argument array. Commands use `spawn` with `shell: false`; working directories must remain inside the project.

Profiles:

- `fast`: low-latency structural/formatter/lint/type checks after writes.
- `standard`: required correctness checks before task completion.
- `release`: full build/integration/security/accessibility/performance/license/acceptance coverage appropriate to release.

A failed required check blocks; `required: false` warns. Disabled placeholders do not run. Projects must replace the initialized placeholders with commands for their real stack. Errors return exact check IDs and truncated outputs to prevent context explosion.

The initialized manifest includes disabled slots for formatter, lint, typecheck, unit/integration tests, build, secret scan, dependency security, schema and migration validation, accessibility, and a warning-level performance budget. Enable only checks relevant to the actual stack, with pinned deterministic commands; do not enable a placeholder until its command exists and is stable.

The runner cannot make a flaky check reliable. Put only deterministic blockers in required profiles; isolate or warn on noisy performance/third-party checks until their signal is proven.

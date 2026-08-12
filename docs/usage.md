# Usage

## Default behavior

Ask Claude Code for normal work. The main conversation remains responsible for integrated reasoning and every write. Claude selects a domain Skill only when its positive trigger fits and its negative trigger does not.

Use `/work-os:work <name>` only when you want a complete named workflow. Use `/work-os:project-context <operation>` only for deliberate context maintenance; both are manual-only.

## Typical requests

- “Implement this feature against these acceptance criteria” routes through `spec-delivery`, with testing/security/database companions only when triggered.
- “Find the root cause of this failing test” stays in main and follows the bug workflow; there is no debugger agent.
- “Audit this auth change” uses `security-engineering` and may invoke `security-reviewer` read-only.
- “Build this landing page” uses the integrated `landing-page` Skill and may end with `ux-critic`.
- “Compare these competitors using current sources” uses `market-intelligence` and may delegate independent evidence branches to `research-scout`.

## Gates and approvals

`PostToolBatch` runs fast checks after write batches. `Stop` runs standard checks and blocks twice before a circuit breaker releases with an explicit unresolved warning. CI runs the release profile.

Human approval remains mandatory for production, credentials, deploys, spending, external messages/publication, destructive operations, consequential migrations, critical infrastructure, and other boundaries named by project policy.

## Direct deterministic commands

```text
node <plugin-root>/runtime/quality.mjs --project . --profile fast
node <plugin-root>/runtime/quality.mjs --project . --profile standard --format json
node <plugin-root>/runtime/telemetry.mjs --project .
```

Do not treat direct commands as a second runtime. They are deterministic support tools called by Claude Code, hooks, and CI.

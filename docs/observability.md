# Observability

Hooks append redacted JSON Lines to `${CLAUDE_PLUGIN_DATA}/runs/<project-hash>/<session>.jsonl`. The log records event time, project/session identifiers, Skills invoked through the Skill tool, custom subagent lifecycle/duration, quality profile/duration/counts, configuration changes, failures, and hook errors. Logs older than 30 days are pruned at session start.

Inspect a compact summary:

```text
node <plugin-root>/runtime/telemetry.mjs --project .
node <plugin-root>/runtime/telemetry.mjs --project . --format json
```

`statusline.mjs` is provided for a team that explicitly configures a Claude Code status line; it is not enabled by default. It shows model/context when available and active custom-agent count.

There is no dashboard or telemetry backend. Claude Code's native OpenTelemetry export can be enabled separately by an organization when token/cost metrics are required. Work OS does not export logs, prompts, code, tokens, or costs by itself.

Important decisions belong in specs/ADRs, not only logs. JSONL is operational evidence and may be deleted under the retention policy.

# Troubleshooting

## Plugin or Skill is missing

Confirm the marketplace/plugin is enabled, Claude Code meets the compatibility floor, and run `/reload-plugins` or restart. For local development, launch from the repository root with `claude --plugin-dir ./plugins/work-os`.

## Init reports conflicts

No files were written. Review the preview, merge existing project instructions/settings/context with the Work OS templates manually, then rerun. Work OS has no force-overwrite mode.

## Hook blocks a safe command

Read the exact reason. Prefer a narrower command that avoids production/destructive/secret patterns. If project policy genuinely needs an exception, review and version the policy change; do not use permission bypass. `ConfigChange` will reject all-hooks-off or bypass settings.

## Stop repeats a quality failure

Run the standard profile directly for complete output. Stop blocks twice for the same failure fingerprint, then releases with an explicit unresolved warning to avoid loops. CI still blocks the release profile.

## A subagent cannot launch

Verify the agent's listed tools exist in the current Claude Code version and the plugin is enabled. The concurrency cap is two and per-task cap is three. Agents intentionally cannot write, run shell, use MCPs, remember across sessions, or spawn agents.

## No telemetry is visible

Logs require a plugin data directory supplied by Claude Code and at least one hook event. Use `telemetry.mjs --project <exact-project-root>`. Logs are local, redacted, and pruned after 30 days.

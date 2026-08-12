# Optional integrations and MCPs

Work OS ships no `.mcp.json` and project initialization disables automatic project MCP enablement. Built-in Claude Code tools cover local repository work.

Add an integration only when a named workflow needs external data or an authorized action that native tools cannot provide efficiently. Review:

1. exact use case and owner;
2. server/plugin source, maintenance, license, and executable code;
3. tools exposed and whether any write/spend/external message is possible;
4. credential scope, storage, rotation, and audit trail;
5. data sent outside the project and retention/compliance;
6. project-specific allow/ask/deny rules;
7. safe test and removal procedure.

Enable only the server/tools required, preferably at project-local scope after team review. The `PreToolUse` handler asks before every `mcp__*` call unless a future reviewed policy narrows it. Do not place provider-specific MCP configuration inside a generic Skill or subagent.

Examples such as analytics, CRM, error tracking, hosting, design, or database connectors remain optional. Installation of Work OS alone connects none of them.

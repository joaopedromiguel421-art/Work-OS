# Custom subagents

| Agent | Purpose | Model/effort | Tools | Turns | Memory | Writes/nesting |
|---|---|---|---|---:|---|---|
| `research-scout` | Isolate bounded source-heavy evidence | Sonnet / medium | Read, Glob, Grep, WebSearch, WebFetch | 12 | None | No / no |
| `security-reviewer` | Independent bounded security challenge | Sonnet / high | Read, Glob, Grep, WebSearch, WebFetch | 18 | None | No / no |
| `ux-critic` | Independent UX/accessibility critique | Sonnet / high | Read, Glob, Grep | 15 | None | No / no |

The main conversation supplies a bounded task and consumes a concise result. At most two custom agents may be active concurrently and three used per task. `PreToolUse` reserves/enforces this cap; lifecycle hooks record start/stop and duration.

No custom planner, architect, developer, debugger, TDD agent, generic code reviewer, copywriter, marketer, salesperson, analyst, or department agent exists. Their work either depends on the main evolving context, is a reusable Skill procedure, or is deterministic quality work.

Plugin agents intentionally omit `memory`, `Agent`, `Bash`, `Write`, `Edit`, and `NotebookEdit`. They do not receive MCP servers or permission-mode overrides. If a browser or external integration is needed, the main project must opt in and keep the resulting action in the main conversation.

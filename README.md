# Work OS for Claude Code

Work OS is a single Claude Code marketplace plugin that turns native Skills, read-only subagents, hooks, project rules, and deterministic checks into a coherent work environment. It intentionally does not provide a second agent runtime.

Status: V1 implemented and verified as `0.1.0`.

## Install

From Claude Code, add the marketplace repository and install the plugin:

```text
/plugin marketplace add <owner-or-url>/work-os
/plugin install work-os@work-os-marketplace
```

For local development, start Claude Code with the plugin directory:

```text
claude --plugin-dir ./plugins/work-os
```

Initialize a project with `/work-os:work init`. Initialization previews every change before applying it and never overwrites an existing file.

## Operating model

- Main thread by default; it owns all writes.
- Skills load procedures progressively.
- Three custom subagents isolate research or independent review and are read-only.
- Hooks enforce safety and feed concise deterministic failures back to Claude.
- One quality manifest drives local checks and CI.
- Project files and Git are the durable source of truth; no vector database is included.

See [architecture](docs/architecture.md), [installation](docs/installation.md), [usage](docs/usage.md), [security](docs/security.md), and [third-party notices](THIRD_PARTY_NOTICES.md).

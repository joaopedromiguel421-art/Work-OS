# Work OS repository instructions

This repository builds one native Claude Code marketplace plugin. Preserve the architecture in `docs/architecture.md` and the capability ownership in `governance/capabilities.json`.

## Non-negotiable boundaries

- Claude Code is the runtime. Do not add an agent framework, scheduler, router service, vector database, or hidden daemon.
- The main conversation owns integrated planning and every write. Custom subagents are read-only and may not spawn agents.
- Deterministic checks belong in the shared quality runner, hooks, or CI.
- Do not enable MCP servers, credentials, deploys, production access, or external actions by default.
- Do not add `.claude/commands`; reusable procedures are Skills.
- Keep runtime scripts dependency-free Node.js ESM and compatible with Node 22+ on Windows, macOS, and Linux.
- Treat `upstream/manifest.json` as the provenance source of truth. Never bulk-import an upstream repository.

## Change protocol

1. Read the relevant ADR, policy, and capability entry.
2. Keep one authority per domain; update or replace instead of adding overlaps.
3. Update tests, documentation, provenance, and notices with the implementation.
4. Run `npm run verify` before declaring completion.

Sensitive actions still require explicit human approval: production operations, credentials, external messages or purchases, deploys, destructive commands, critical infrastructure, and database changes with irreversible impact.

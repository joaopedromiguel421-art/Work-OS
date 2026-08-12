# Security model

Work OS combines project settings with fail-closed pre-execution hooks. Settings deny known secret paths and destructive Git/permission bypass patterns. Hooks additionally resolve writes against the project root, reject direct secret access and remote-pipe-to-shell patterns, ask for installs, publishing, infrastructure, database, production, and MCP actions, and cap custom subagents.

## Least privilege

- Main conversation: normal Claude Code permissions plus project policy; owns writes.
- Custom agents: read/search only, no shell, write, nested Agent, memory, or MCP configuration.
- Runtime: local project/plugin-data files and child processes named by the versioned quality manifest; no shell.
- CI: read repository, run dependency-free checks; no deploy or external credential.

## Secret handling

Do not place real secrets in prompts, Git, specs, logs, fixtures, or research artifacts. The logger redacts common token/key forms and sensitive field names, but redaction is defense-in-depth rather than permission to ingest secrets. Prefer environment/provider secret stores and exact-purpose access by an authorized human.

## Third-party execution

Inspect package manifests, lifecycle scripts, hooks, Skills, agents, MCP definitions, binaries, and licenses before use. Package installation requires approval. Never pipe remote content to a shell or execute an upstream repository wholesale.

## Databases, deploys, Git, and external actions

Production access, migrations with consequence, destructive statements, deploys, infrastructure changes, commits/pushes/publication, external messages, spend, CRM changes, and account actions remain explicit human boundaries. Work OS prepares and validates; it does not silently cross them.

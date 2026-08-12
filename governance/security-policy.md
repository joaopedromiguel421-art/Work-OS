# Security policy

## Defaults

- Project-local access only; external MCPs and credentials are disabled.
- Read secrets only when a user explicitly authorizes the exact source and purpose. Never log secret values.
- Treat shell commands, dependency lifecycle scripts, hooks, plugins, Skills, agents, and MCP servers as executable supply-chain inputs.
- The main conversation performs every write. Custom subagents have read/search tools only.

## Human approval boundaries

Explicit approval is required for production access, deploys, publishing, external messages, purchases or paid APIs, credentials, destructive operations, irreversible database changes, force pushes, critical infrastructure, and executing unreviewed third-party scripts.

## Command boundaries

Block destructive broad-path operations, credential harvesting, remote content piped to a shell, permission bypass, and production-targeted commands. Ask before package installation, Git publication, migrations, deploy tooling, or networked actions with side effects.

## Supply chain

Pin upstream commits, preserve license notices, inspect every adapted file, avoid install scripts, and run the license/provenance audit before release. Runtime code has no third-party dependencies.

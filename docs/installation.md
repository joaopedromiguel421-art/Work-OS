# Installation

## Requirements

- Claude Code 2.1.227 or newer. This is the tested compatibility floor for the current plugin, Skill, subagent, and blocking `PostToolBatch` contracts.
- Node.js 22 or newer on `PATH`.
- Git for normal project versioning; no Git operation is performed by the installer.

Work OS has zero npm runtime dependencies and does not run an install lifecycle script.

## Marketplace installation

In Claude Code:

```text
/plugin marketplace add <github-owner>/<work-os-repository>
/plugin install work-os@work-os-marketplace
```

Restart or run `/reload-plugins` if the current session predates installation. Confirm the namespaced Skill `/work-os:work` is present.

## Local development installation

From this repository root:

```text
claude --plugin-dir ./plugins/work-os
```

If the Claude CLI is available, validate the package before loading it:

```text
claude plugin validate ./plugins/work-os --strict
claude plugin validate ./.claude-plugin/marketplace.json --strict
```

## Initialize a project

Open Claude Code at the target project's root and invoke:

```text
/work-os:work init
```

The Skill runs a preview, displays every create/merge/conflict, requests confirmation, applies only if there are no conflicts, and runs doctor. Existing files are never overwritten. `.gitignore` receives only missing local-state entries.

For deterministic local inspection outside Claude Code:

```text
node <plugin-root>/runtime/init.mjs --project <project>
node <plugin-root>/runtime/init.mjs --project <project> --apply
node <plugin-root>/runtime/doctor.mjs --project <project>
```

An existing conflicting `CLAUDE.md`, setting, context, or spec file stops the apply before any write. Reconcile it manually, rerun preview, then apply.

## What installation does not do

It does not enable an MCP, request credentials, install project dependencies, alter Git history, deploy, connect an external account, or copy the plugin runtime into the project.

Uninstalling the plugin does not delete the project's versioned overlay. Remove or migrate those files deliberately through Git if the team no longer wants them.

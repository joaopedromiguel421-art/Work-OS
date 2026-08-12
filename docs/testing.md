# Testing and evaluation

`npm run verify` executes the release quality profile, which runs:

1. repository/plugin structure validation;
2. Node unit/integration tests;
3. Skill routing evals, including negative and collision cases;
4. acceptance tests for marketplace, init, workflows, hooks, security, quality, observability, and platform paths;
5. license/provenance audit.

CI repeats this on Windows, macOS, and Linux with Node 22 and 24. No live production, credential, MCP, deploy, paid, or external-message test is allowed.

CI also has one Linux job pinned to the official Claude Code 2.1.227 npm package. It installs that package with lifecycle scripts disabled, points `CLAUDE_BIN` at the downloaded native binary, validates both manifests with `--strict`, and installs the marketplace/plugin into an isolated temporary Claude configuration. To reproduce that acceptance path locally, set `CLAUDE_BIN` to an already inspected Claude Code executable before running `npm run acceptance`.

The offline routing evaluator is a deterministic regression proxy for descriptions, not a runtime router. A release also follows `evals/live-routing.md` in fresh Claude Code sessions when the CLI/account is available. Claude Code itself performs actual Skill selection.

Failures include exact check/case IDs. Update routing cases whenever a description boundary changes; never weaken cases only to raise a score.

The dated release evidence is recorded in [validation-report.md](validation-report.md).

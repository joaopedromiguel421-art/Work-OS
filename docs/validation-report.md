# V1 validation report

Date: 2026-08-11  
Release candidate: `0.1.0`  
Local environment: Linux x64, Node.js 24.14.0, npm 11.9.0  
Native compatibility target: Claude Code 2.1.227

## Release evidence

| Check | Result | Evidence |
|---|---:|---|
| Repository inventory | PASS | Exactly 25 Skills, 3 custom subagents, 13 hook events, and 14 workflows |
| Node test suite | PASS | 28/28 unit and integration tests |
| Skill routing regression | PASS | 70/70 cases, 100.0%, release floor 92% |
| Acceptance suite with official CLI | PASS | 12/12, zero skipped |
| Native manifest validation | PASS | Plugin and marketplace pass Claude Code `plugin validate --strict` |
| Native installation | PASS | Local marketplace added and `work-os@work-os-marketplace` installed/enabled in an isolated configuration |
| License/provenance audit | PASS | 9 approved upstreams and 20 file-level adaptation records |
| Upstream pins | PASS | All 9 pinned commits matched their default-branch heads; 0 errors and 0 pending updates |
| Runtime dependencies | PASS | Zero npm runtime dependencies; JavaScript ESM and Node built-ins only |
| Security baseline | PASS | Destructive/secret/boundary cases denied; installs, MCP, production, publishing, database consequence, deploy, spend, and external actions require approval |

The official CLI package was pinned to `@anthropic-ai/claude-code@2.1.227`, fetched from npm with lifecycle scripts disabled, and used without login or credentials. The inspected Linux x64 native binary SHA-256 was `6832dc3f1797b890b71116e5f2dbbf9a83fd3d0498c235b4b0f9cd0e6e499ad6`.

## Phase closure

| Phase | Status | Closure evidence |
|---|---|---|
| 0 — governance | Complete | Ownership, architecture, model/security/release policy, ADRs, source pins, and license policy are versioned |
| 1 — vertical slice | Complete | Marketplace install, project preview/apply/doctor, feature workflow, Skill entrypoint, hooks, and fast quality gate pass |
| 2 — engineering | Complete | Engineering Skills, routing boundaries, deterministic gates, and main-thread write ownership pass |
| 3 — product/design | Complete | Product/design Skills and read-only UX critic pass inventory and routing tests |
| 4 — growth/business/data | Complete | Domain Skills and collision/negative routing cases pass |
| 5 — workflows | Complete | All 14 contracts define entry, main ownership, optional isolation, parallel limits, gates, and completion |
| 6 — operations | Complete | Security, local redacted telemetry, upstream checker, provenance/license audits, and operational docs pass |
| 7 — quality/evals | Complete | Unit, integration, routing, acceptance, platform-path tests, and CI definitions pass locally |
| 8 — distribution | Complete | Strict native validation and isolated marketplace/plugin installation pass on Claude Code 2.1.227 |

## Cross-platform status

The repository's deterministic runtime avoids a shell and uses `node:path` plus `spawn` with `shell: false`. Windows-drive and POSIX containment/security behavior are covered by unit tests. The checked-in CI matrix targets Windows, macOS, and Linux on Node 22 and 24; the matrix has not been executed from this local environment, so hosted-runner confirmation remains a release-operation step rather than a known implementation defect.

## Intentionally unexecuted boundaries

- No live model/API routing session was run because that would require an account or credentials. The offline routing regression passed 70/70; `evals/live-routing.md` defines the credentialed manual release check.
- No MCP, production database, deployment, paid campaign, CRM mutation, message send, package publication, or other external action was activated. Those are approval boundaries by design.
- No upstream lifecycle script was executed. Native Claude validation used the inspected optional binary package directly.

There are no known failing repository checks. The remaining items above are environment- or approval-dependent validation boundaries, not deferred implementation work.

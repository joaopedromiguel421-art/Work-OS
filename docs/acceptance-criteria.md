# Acceptance scenarios

| Scenario | Expected behavior |
|---|---|
| Clean install | Marketplace has one plugin; Claude discovers 25 Skills, 3 agents, and hooks; no MCP starts |
| Project init | Preview writes nothing; apply creates overlay; rerun is idempotent; conflict causes zero writes |
| Bug | Main reproduces/cause-tests/fixes; no debugger agent; standard gate blocks incomplete work |
| Feature | Change spec and acceptance map drive main-thread writes; only triggered read-only reviews delegate |
| Landing page | Offer/copy/UX/measurement integrate under one workflow; UX critic is read-only; deploy needs approval |
| Security audit | Passive authorized review, deterministic scanners, independent reviewer, redacted evidence, no production probe |
| SEO | Current intent/technical evidence, deterministic checks, no ranking promise or external account action |
| Research/competitors | Sourced/date-normalized findings; maximum two independent scouts; main synthesizes |
| Campaign/prospecting | Draft/QA only by default; spend, CRM, audience upload, and sending require approval |
| Data analysis | Authorized data, reproducible transformations, quality/privacy/uncertainty visible |
| Destructive command | PreToolUse denies broad deletion, force/reset/clean, secret reads, remote pipe, permission bypass |
| Quality failure | Post-batch/Stop return exact failing IDs; CI uses the same manifest and blocks release |
| Cross-platform | Init, path containment, runner, tests work under Windows/macOS/Linux CI |
| Provenance | Nine approved sources pinned; every adapted file has blob SHA/note; mixed-license content remains reference-only |

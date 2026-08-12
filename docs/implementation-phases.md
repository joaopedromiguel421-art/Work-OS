# Implemented phases

| Phase | Components | Verification / definition of done |
|---|---|---|
| 0 — governance | Architecture, ownership, model/security/release policy, pins, licenses, ADRs | JSON/notice audit and accepted architecture |
| 1 — vertical slice | Marketplace/plugin, work Skill, feature workflow, init, template context, quality, 13 hook dispatcher | Clean-project preview/apply/doctor and fast gate tests |
| 2 — engineering | Research/spec/architecture/test/database/performance/security/docs Skills | Routing and procedure boundary tests |
| 3 — product/design | Discovery/interface/brand plus UX critic | Routing, read-only tool validation, landing acceptance |
| 4 — growth/business/data | Market/offer/copy/SEO/CRO/campaign/analytics/sales/support/ops/data Skills | Domain collision cases and workflow coverage |
| 5 — workflows | Fourteen versioned workflow references | Required-section and Skill/agent/gate validation |
| 6 — operations | Observability, upstream checker, license audit, security policy, docs | Local audit tests and no-default-integration checks |
| 7 — quality/evals | Unit, routing, acceptance, platform matrix, CI | Release profile green on supported matrix |
| 8 — distribution | Installation/usage/troubleshooting, changelog, marketplace version | Native plugin validation and clean-project smoke test |

The implementation deliberately avoids a separate installer/runtime, dynamic workflow engine, vector database, agent teams, or default MCP.

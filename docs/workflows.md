# Workflow catalog

Invoke with `/work-os:work <name>`.

| Workflow | Core contract | Completion evidence |
|---|---|---|
| `new-project` | Initialize context, quality, foundation, first slice | Doctor + configured gates + first outcome |
| `feature` | Spec, slices, implementation, risk reviews | Acceptance map + standard pass |
| `bug` | Reproduce, cause, regression, minimal fix | Original symptom and regression evidence |
| `refactor` | Preserve invariants while reducing named cost | Baseline parity + improvement evidence |
| `audit` | Evidence-backed scoped multi-domain review | Coverage map + deduplicated findings |
| `security-audit` | Threat model, deterministic scans, independent review | Findings/severity/verification without secrets |
| `research` | Decision-focused current evidence | Sources, contradictions, confidence/expiry |
| `landing-page` | Offer/copy/UX/form/measurement integration | Claims/states/events/gates + launch approval |
| `seo` | Intent, technical, content, measurement | Dated baseline + verified remediation |
| `campaign` | Offer, channels, assets, destination, measurement | QA + budget/approval/pause boundaries |
| `competitor-analysis` | Normalized sourced landscape | Every material claim sourced/unknown |
| `offer` | ICP, value/proof, package, economics, validation | Coherent approved offer hypothesis |
| `prospecting` | Authorized list, research, qualification, drafts | Provenance/compliance/recipient QA; no auto-send |
| `data-analysis` | Authorized reproducible quantitative work | Data-quality, method, uncertainty, decision result |

Workflow files are static versioned methodologies, not executable state machines. Dependent steps stay in main; only independent read-only evidence/review branches are parallel.

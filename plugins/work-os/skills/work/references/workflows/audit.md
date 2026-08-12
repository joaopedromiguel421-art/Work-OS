# General audit workflow

## Entry

- Required: audit objective, scope, criteria/standard, risk tolerance, and allowed evidence sources.
- Resolve whether the audit is read-only or also authorizes remediation; default is read-only findings.

## Main-conversation sequence

1. Freeze scope, exclusions, severity rubric, evidence threshold, and reporting format.
2. Read authority files and inventory the actual components/surfaces in scope.
3. Select domain Skills only for relevant lenses: architecture, testing, database, performance, security, documentation, interface, SEO, analytics, or operations.
4. Run deterministic checks from the manifest and approved read-only tools. Preserve exact versions and commands.
5. Collect findings with location, evidence, impact, confidence, and smallest remediation. Deduplicate by root cause.
6. Challenge false positives and missing coverage. Separate confirmed, probable, and needs-validation.
7. Prioritize by risk/impact, exploitability or user/business harm, effort, dependency, and reversibility.
8. If remediation is separately authorized, create bounded change specs; otherwise do not write product code.

## Separate context and parallelism

Independent `security-reviewer` and `ux-critic` lenses may run in parallel, maximum two, only when in scope. `research-scout` may verify an external standard but competes for the same cap. The main conversation merges and writes the report.

## Quality gates

All configured deterministic checks used by the audit must finish or be recorded as a coverage limitation. If remediation is authorized, its change spec must pass the standard profile before closure.

## Complete when

Scope coverage is traceable; deterministic outputs are attached/summarized; findings are evidence-backed and deduplicated; unknowns and access limits are explicit; no remediation or external action exceeded authorization.

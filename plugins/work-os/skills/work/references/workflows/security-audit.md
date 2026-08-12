# Security audit workflow

## Entry

- Required: authorized repository/systems scope, environment, threat concerns, data sensitivity, and allowed test methods.
- Default: passive, repository/configuration review only; no production probing or exploit execution.

## Main-conversation sequence

1. Use `security-engineering` to define assets, actors, entry points, trust boundaries, dependencies, and severity/confidence rubric.
2. Map authentication, authorization, session/key handling, sensitive data, external calls, file/path inputs, serialization, logging, deployment, and supply-chain surfaces.
3. Run configured deterministic dependency, secret, static, schema/policy, test, and build checks. Never upload code or findings to an unapproved service.
4. Trace each candidate finding to reachable code/configuration and a plausible impact. Remove exposed secret values from evidence.
5. Invoke `security-reviewer` for an independent read-only challenge of high-risk surfaces and main findings.
6. Use `research-scout` only for an independent current standard/advisory question; at most one alongside the reviewer.
7. Produce prioritized findings and remediation/test guidance in the main conversation. Create fix specs only if remediation is in scope.

## Separate context and parallelism

The `security-reviewer` and one independent standards `research-scout` may run in parallel, maximum two. Repository threat modeling, finding adjudication, reporting, and every remediation write remain in the main conversation.

## Quality and approval gates

The security tool commands and standard quality profile must complete or their limitation is reported. Active scanning, credentials, third-party targets, production access, disclosure, destructive validation, or real-data extraction requires explicit authorized approval.

## Complete when

Threat-model coverage and tool versions are recorded; each finding has evidence, severity, confidence, and verification; false positives/unknowns are visible; high-severity findings have an owner and containment/escalation path; no sensitive value appears in logs/report.

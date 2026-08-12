---
name: security-engineering
description: "Threat-driven security procedure for trust boundaries, authentication, authorization, secrets, dependencies, sensitive data, and vulnerability remediation. Use when a change creates security exposure or a security audit/finding needs analysis. Do not use as a generic code-quality review or as permission to access production secrets or systems."
---

# Security engineering

## Method

1. Define assets, actors, trust boundaries, entry points, privileges, data sensitivity, dependencies, and deployment assumptions.
2. Enumerate plausible abuse cases across identity, authorization, injection, data exposure, supply chain, unsafe deserialization, request forgery, file/path handling, concurrency, availability, and logging.
3. Verify controls in code and configuration. Do not report a scanner label without tracing reachability and impact.
4. Rate findings by exploitability, impact, exposure, confidence, and recovery cost. Separate confirmed, likely, and needs-validation.
5. Recommend the smallest defense at the correct boundary, plus regression evidence and monitoring.
6. For a fix, preserve a safe reproduction that contains no real secret, harmful payload distribution, or production target.

## Independent review

Use `security-reviewer` after the main analysis for a read-only challenge when authentication, authorization, secrets, payment, personal data, remote code/dependency execution, or a high-severity finding is involved. Give it scope, assumptions, and requested output. The main conversation validates and writes fixes.

## Deterministic gates

Use the quality manifest for dependency audit, secret scanning, static analysis, schema/policy validation, tests, and build. Configure tools per project; Work OS does not ship a universal scanner or transmit code externally.

## Sensitive boundaries

Do not fetch, reveal, copy, rotate, or test real credentials without explicit authorization. Production access, exploit attempts, active scanning of third parties, destructive verification, or disclosure outside the repository requires human approval and appropriate authorization.

## Output

Scope and threat model; findings with evidence/location/severity/confidence; remediation and test; residual risk; approval/escalation items. Avoid exposing secret values in logs or reports.

## Sources and adaptation

Original procedure informed by deterministic review and hook safety ideas in ECC and the verification discipline of Superpowers. Trail of Bits material remains reference-only because of its share-alike license and is not incorporated.

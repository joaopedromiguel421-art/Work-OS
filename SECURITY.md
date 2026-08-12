# Security policy

## Supported version

Security fixes are applied to the latest Work OS release. Runtime dependencies are intentionally zero; Node.js and Claude Code must remain on supported versions.

## Reporting

Report a suspected vulnerability privately to the repository owner or configured security contact. Do not place secrets, personal data, working credentials, or unnecessary exploit detail in a public issue.

Include affected version, scope, preconditions, evidence with sensitive values removed, impact, and a safe reproduction when available. Do not test production or third-party systems without written authorization.

## Design boundaries

- Custom subagents are read-only and cannot spawn agents.
- MCP servers and credentials are off by default.
- Sensitive operations require human approval.
- Pre-execution hooks fail closed for protected operations.
- Quality and license manifests are versioned and enforced in CI.

See `governance/security-policy.md` and `docs/security.md` for the complete operating policy.

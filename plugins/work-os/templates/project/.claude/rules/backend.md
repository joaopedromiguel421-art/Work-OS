---
paths:
  - "**/api/**"
  - "**/server/**"
  - "**/backend/**"
  - "**/*.{go,rs,java,kt,cs,py,rb,php}"
---

# Backend rules

- Validate at trust boundaries and keep authorization server-side.
- Preserve API compatibility or make the migration explicit in the change spec.
- Define error behavior, idempotency, concurrency, timeouts, and observability for consequential paths.
- Never log secrets, credentials, or unnecessary personal data.

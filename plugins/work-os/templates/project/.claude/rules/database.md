---
paths:
  - "**/migrations/**"
  - "**/schema/**"
  - "**/*.{sql,prisma}"
---

# Database rules

- Every schema change needs forward, compatibility, verification, and recovery plans.
- Prefer expand-migrate-contract for live systems; do not combine an incompatible schema and consumer cutover blindly.
- Production execution, destructive statements, and irreversible data transformations require explicit human approval.
- Backups are not rollback evidence until restoration has been tested.

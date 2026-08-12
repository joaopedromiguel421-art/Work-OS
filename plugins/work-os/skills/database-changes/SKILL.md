---
name: database-changes
description: "Safe database evolution procedure for schema, data, indexes, backfills, and migration sequencing. Use when a change alters persistent data shape, ownership, constraints, or production migration behavior. Do not use for read-only analysis, ordinary repository files, or query tuning with no data/schema change."
---

# Database changes

## Method

1. Identify the data owner, stores, consumers, scale, retention/compliance constraints, and current backup/restore evidence.
2. Classify the change: additive, backfill, constraint, rename, type change, repartition, deletion, or ownership transfer.
3. Prefer expand-migrate-contract:
   - expand with a backward-compatible schema;
   - deploy compatible readers/writers;
   - backfill idempotently in bounded batches with progress and retry controls;
   - verify counts, constraints, sampling, and consumer behavior;
   - switch reads/ownership;
   - contract only after the compatibility window and approval.
4. Define lock/latency impact, transaction boundaries, concurrency behavior, failure checkpoints, and recovery for every step.
5. Create deterministic migration, schema, and integration checks in the quality manifest.
6. Rehearse on representative non-production data when risk is material.

## Safety gates

Production execution, destructive statements, irreversible transforms, credential use, and a contract step require explicit human approval. A backup is not a rollback plan unless restoration and re-entry behavior are known. Never expose production data to an agent or test fixture by default.

## Completion

Evidence covers preconditions, forward migration, mixed-version compatibility, data verification, monitoring, recovery, and final cleanup. Record remaining compatibility windows and owners.

## Companions

Use `architecture-decisions` for ownership/storage choices, `security-engineering` for sensitive data, `performance-engineering` for query/index measurements, and `testing-strategy` for boundary coverage.

## Output

Migration sequence, compatibility matrix, data checks, rollout/rollback or forward-recovery plan, approval points, and post-migration cleanup.

## Sources and adaptation

Original Work OS procedure using the spec lifecycle from OpenSpec/spec-kit and deterministic gate principles from Superpowers. No database runtime or migration tool is bundled.

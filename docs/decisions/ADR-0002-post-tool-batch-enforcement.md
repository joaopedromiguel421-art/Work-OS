# ADR-0002: Enforce fast quality after write batches

- Status: accepted; blueprint preserved
- Date: 2026-08-11
- Compatibility floor: Claude Code with blocking `PostToolBatch` support

## Evidence

The current Claude Code hooks contract supports a top-level `decision: "block"` for `PostToolBatch`. Blocking stops the agentic loop before its next model request; it does not roll back tools that already completed.

## Decision

`PostToolBatch` runs the fast profile after a batch containing write tools and blocks the next model request on a required failure. The reason contains a concise repair summary. `Stop` runs the standard profile with a circuit breaker, and CI independently runs the same manifest. All three call one quality runner.

## Consequences

Failures surface immediately without pretending to undo completed writes. `Stop` and CI provide completion and merge enforcement. On older Claude Code versions that lack this event behavior, `Stop` and CI remain the safe fallback; installation documentation declares the supported version floor.

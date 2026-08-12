# ADR-0001: Use Claude Code as the only runtime

- Status: accepted
- Date: 2026-08-11

## Context

The product needs broad procedures and strong controls without rebuilding native orchestration.

## Decision

Package one native Claude Code plugin. The main conversation owns all dependent work and writes. Skills encode reusable procedures; three read-only subagents isolate bounded evidence work; hooks and CI run deterministic policy and quality checks. Versioned files are durable truth.

## Consequences

There is no custom agent loop, scheduler, message bus, router service, memory service, or vector database. New capabilities must fit an existing native mechanism or demonstrate why a minimal deterministic script is required.

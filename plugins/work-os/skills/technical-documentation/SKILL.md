---
name: technical-documentation
description: "Procedure for accurate developer documentation, API references, runbooks, architecture explanations, onboarding, and operational guides. Use when readers need verified instructions or durable technical understanding. Do not use for marketing copy, brand voice work, transient status notes, or a spec that governs an unimplemented change."
---

# Technical documentation

## Method

1. Identify reader, task, prerequisites, supported versions/platforms, and the authoritative implementation source.
2. Choose the artifact type:
   - task guide for an outcome;
   - reference for exact contracts/options;
   - explanation for architecture and tradeoffs;
   - runbook for detection, response, verification, and recovery;
   - ADR for a durable decision;
   - project context for compact current facts.
3. Verify commands, paths, configuration names, defaults, error states, and examples against the repository or official source.
4. Put the critical path first, then verification, failure recovery, and related links. Do not bury prerequisites.
5. Date volatile statements and avoid copying a fact already owned elsewhere.
6. Test executable examples in a safe environment when possible and add deterministic link/schema/example checks to quality.

## Quality checklist

- One audience and purpose per page.
- Terms and names match the product/code.
- Examples are minimal, safe, and contain no credentials.
- Platform differences are explicit.
- Destructive or production commands carry approval and recovery warnings.
- The page states how the reader knows the task succeeded.

## Boundaries

Use `copy-and-content` for persuasive/editorial copy, `spec-delivery` for change contracts, and `project-context` for a deliberate context audit. Do not duplicate generated API references manually if a deterministic generator is authoritative.

## Output

Reader-focused document plus verification evidence, authority links, freshness owner, and any known limitation.

## Sources and adaptation

Original synthesis informed by concise output contracts in Anthropic Knowledge Work Plugins and progressive disclosure patterns in Anthropic Skills; source-available document Skills are excluded.

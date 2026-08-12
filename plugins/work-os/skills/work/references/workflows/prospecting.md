# Prospecting workflow

## Entry

- Required: authorized target profile/list source, offer, geography, channel, volume boundary, consent/compliance rules, suppression rules, and desired next step.

## Main-conversation sequence

1. Use `sales` to define qualification, evidence fields, disqualifiers, stakeholder hypotheses, and outreach objective.
2. Use `market-intelligence` for segment/account context. `research-scout` may research a small authorized public account set; no sensitive-trait inference or access bypass.
3. Validate list provenance, lawful/authorized use, freshness, duplicates, suppression, and minimum personal data.
4. Score/segment with transparent evidence rather than opaque personal profiling.
5. Draft outreach in the main conversation through `sales` and `copy-and-content`, grounding personalization in cited public/account evidence and making one clear ask.
6. QA names, companies, claims, links, consent/unsubscribe, routing, and correct recipients.
7. Require explicit approval before enrichment spend, CRM writes, exports, messages, scheduling, or sequence activation. Use only an opted-in least-privilege integration.

## Parallelism

At most two independent research branches for disjoint account sets. Drafts and deduplication wait for evidence. No subagent receives credentials or writes to a CRM.

## Quality gates

List provenance, suppression/deduplication, recipient identity, claim/link, consent, and export-schema checks must pass. Human approval blocks enrichment spend, CRM mutation, export, scheduling, or sending.

## Complete when

The authorized list is provenance-checked, qualification and exclusions are traceable, drafts contain no invented personalization, compliance/recipient QA passes, and every external action is approved/performed by an authorized human or remains a clear handoff.

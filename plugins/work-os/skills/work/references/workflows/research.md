# Research workflow

## Entry

- Required: decision to support, exact question, scope, freshness threshold, and evidence standard.
- Optional: hypotheses, known sources, jurisdictions/versions, and deadline.

## Main-conversation sequence

1. Use `evidence-research` to frame the question, source plan, and conditions that would change the recommendation.
2. Search project authority first and identify only the missing evidence.
3. For a small question, research in the main conversation. For source-heavy work, delegate bounded independent branches to `research-scout`.
4. Normalize dates, definitions, versions, populations, pricing/units, and source incentives.
5. Reconcile contradictions and separate fact, inference, hypothesis, and unknown.
6. Synthesize a decision-focused answer with confidence, limitations, expiry, and next validation.
7. Write a reusable research artifact and update `context/research-index.md` only when future work needs it.

## Parallelism

At most two scout branches may run concurrently, partitioned by source class or independent question—not duplicate searches. A third total scout may fill a specific gap after synthesis. The main conversation does not write until evidence branches return when their results affect structure.

## Quality gates

Direct links support consequential claims; volatile claims include dates; primary sources are preferred; contradictions and failed access are reported; quotations remain minimal; no access control or terms are bypassed.

## Complete when

The decision question is answered to its declared threshold or explicitly remains unresolved; sources and limitations are sufficient for another reviewer to reproduce the conclusion; the permanent context contains summary/index, not raw search output.

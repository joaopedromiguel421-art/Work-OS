---
name: evidence-research
description: "Research method for decisions that need current, attributable evidence from primary or credible sources. Use when facts are uncertain, time-sensitive, disputed, niche, or require comparison. Do not use when the answer is already established in project authority files or the task is analysis of a supplied dataset."
---

# Evidence research

## Contract

Turn a decision question into a compact evidence brief. Prefer primary sources, current official documentation, original datasets, standards, and first-party statements. Clearly label inference.

## Method

1. State the decision, research question, scope, freshness threshold, and what would change the recommendation.
2. Search project sources first. Search externally only for missing or volatile evidence.
3. Build a source plan: primary evidence first, then independent corroboration where bias or uncertainty matters.
4. Capture claim, source, publication/event date, access date, applicability, and limitation. Do not paste large source bodies.
5. Reconcile contradictions by comparing definitions, versions, populations, incentives, and dates.
6. Separate verified facts, reasonable inferences, hypotheses, and unknowns.
7. Synthesize the smallest recommendation supported by the evidence and state confidence and expiry conditions.

## Separate context

Use `research-scout` when raw search results, long documents, or multiple independent source branches would pollute the main context. Give it one bounded question and a required evidence table. The main conversation evaluates and writes the final artifact.

## Quality checks

- Every consequential factual claim has a direct source.
- Links point to supporting pages, not search results.
- Dates and versions are explicit for volatile facts.
- Quotes are minimal and legally compliant; paraphrase by default.
- Missing evidence is visible, not silently filled.

## Output

Decision question; findings table; contradictions; recommendation; confidence; limitations; sources; next validation date. Add a row to `context/research-index.md` only when the result will be reused.

## Companion boundaries

Use `market-intelligence` for category, customer, and competitor synthesis. Use `data-analysis` for supplied structured data. Use `security-engineering` for vulnerability judgments.

## Sources and adaptation

Original synthesis informed by the research output contracts in Anthropic Knowledge Work Plugins and the source-isolation pattern in Anthropic Skills. Source-available Skill bodies are not incorporated.

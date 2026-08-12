---
paths:
  - "**/test/**"
  - "**/tests/**"
  - "**/__tests__/**"
  - "**/*.{test,spec}.*"
---

# Test rules

- Test observable behavior at the cheapest reliable boundary.
- A bug fix includes a regression test that fails for the demonstrated cause when practical.
- Avoid timing sleeps, shared mutable fixtures, network dependence, and assertions on implementation trivia.
- Keep test failures actionable and deterministic across supported operating systems.

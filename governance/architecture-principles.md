# Architecture principles

1. Configure Claude Code; do not rebuild it.
2. Keep work in the main conversation unless context isolation has measurable value.
3. Give each domain one procedural owner.
4. Use deterministic tools for deterministic questions.
5. Load specialized context progressively.
6. Keep versioned project files authoritative.
7. Default integrations and credentials to off.
8. Prefer reversible actions and explicit human approval at sensitive boundaries.
9. Pin and curate external influences; never bulk import.
10. Optimize for a small, understandable system before adding abstraction.

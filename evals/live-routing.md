# Live Claude Code routing evaluation

The offline evaluator is a deterministic description-regression proxy. Before release, run representative cases in fresh Claude Code sessions with the installed plugin:

1. Start from an initialized fixture project with no prior invoked Skills.
2. Submit each prompt from `skill-routing/cases.json` without naming the expected Skill, except the two manual-only command cases.
3. Record the Skill tool invocation from the transcript/JSONL log, or `none`.
4. Score exact expected owner. A companion Skill is allowed only after the expected owner and does not replace it.
5. Require at least 90% overall, 100% for manual-only cases, no automatic `work`/`project-context`, and no high-risk collision between security/database/external-action domains.
6. Investigate failures by tightening positive/negative description triggers and adding a regression case. Do not add a runtime router.

Run at least one English and one Portuguese prompt for every Skill. Live evaluation requires a configured Claude Code account and is intentionally not executed in unauthenticated CI.

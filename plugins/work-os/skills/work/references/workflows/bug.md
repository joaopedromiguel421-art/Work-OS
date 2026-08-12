# Bug workflow

## Entry

- Required: observed symptom, expected behavior, environment/version, and impact.
- Helpful: minimal reproduction, logs with secrets removed, failing check, and suspected change window.

## Main-conversation sequence

1. Read project authority and the smallest relevant code path. Preserve the original failure evidence.
2. Reproduce deterministically or define the missing observation needed. Do not change code before separating symptom from cause.
3. Establish a baseline and trace inputs, state, boundaries, timing, and recent changes. Form one falsifiable cause hypothesis at a time.
4. Use `testing-strategy` to add the cheapest regression test that fails for the demonstrated cause when practical.
5. Use `security-engineering`, `database-changes`, or `performance-engineering` only if the root cause crosses those domains.
6. Implement the smallest root-cause fix in the main conversation; avoid unrelated refactoring.
7. Run the reproduction, regression, affected tests, fast profile, then standard profile.
8. Update a spec/ADR/context only when the bug revealed a durable contract or architecture fact.

## Separate context and parallelism

Do not create a debugger subagent. Debugging depends on evolving state and stays in the main conversation. A read-only `security-reviewer` may challenge a security-sensitive fix after the cause is established; independent external-doc research may use `research-scout`.

## Complete when

The original symptom is no longer reproducible for the identified cause; the regression test proves the fix where feasible; neighboring behavior is checked; standard gates pass; root cause and remaining uncertainty are reported without claiming more than the evidence.

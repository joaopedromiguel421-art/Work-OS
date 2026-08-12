---
name: work
description: "Manual entry point for initializing Work OS and running one of its named end-to-end workflows. Use when the user explicitly invokes /work-os:work with init or a workflow name. Do not use automatically for ordinary requests or as a replacement for a domain Skill."
disable-model-invocation: true
argument-hint: "<init|new-project|feature|bug|refactor|audit|security-audit|research|landing-page|seo|campaign|competitor-analysis|offer|prospecting|data-analysis>"
---

# Work OS workflow controller

Interpret `$ARGUMENTS` as exactly one operation. This Skill selects a documented workflow; it does not create a second runtime or transfer write ownership away from the main conversation.

## `init`

1. Run `node "${CLAUDE_PLUGIN_ROOT}/runtime/init.mjs" --project "${CLAUDE_PROJECT_DIR}"` to preview.
2. Show created, merged, unchanged, and conflicting paths. Explain any conflict; never overwrite it.
3. Obtain explicit approval for the displayed project changes.
4. Run the same command with `--apply`.
5. Run `node "${CLAUDE_PLUGIN_ROOT}/runtime/doctor.mjs" --project "${CLAUDE_PROJECT_DIR}"`.
6. Report the initialized context and the disabled-by-default optional checks. Do not add an MCP or credential.

## Named workflows

For any other accepted argument, read only `references/workflows/<name>.md`, then follow it in the main conversation.

- Keep integrated reasoning and every write in the main conversation.
- Invoke a domain Skill only at the step named by the workflow.
- Invoke a custom subagent only when the workflow names it and the evidence branch is independent.
- Maximum two custom subagents concurrently and three total for the task.
- Run the quality profile specified by the workflow. Deterministic failures must be fixed or reported; do not substitute model judgment.
- Record consequential decisions in the spec or an ADR and archive the change only after its completion criteria pass.

If the argument is missing or not one of the listed operations, list the accepted names and stop. Do not silently choose a workflow.

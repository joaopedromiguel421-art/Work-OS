---
name: business-operations
description: "Operations procedure for processes, SOPs, ownership, capacity, project cadence, controls, vendor evaluation, risk, and decision routines. Use when making repeatable cross-functional work reliable and measurable. Do not use for product discovery, sales execution, software architecture, or automating an unvalidated process."
---

# Business operations

## Method

1. Define the outcome, customer of the process, scope, trigger, inputs, outputs, owner, constraints, volume, current performance, and failure cost.
2. Observe/map the current flow, handoffs, queues, decisions, exceptions, systems, approvals, and evidence. Do not design from an idealized narrative alone.
3. Remove unnecessary steps and clarify ownership before adding automation.
4. Design the target process with entry/exit criteria, roles, service expectations, controls, exception paths, escalation, records, and recovery.
5. Choose measures for outcome, flow, quality, risk, and capacity. Avoid metrics that reward throughput while hiding rework or harm.
6. Pilot a small reversible slice, train owners, collect failure evidence, and revise.
7. Encode stable deterministic validations in existing systems/CI only where appropriate; do not create a general workflow engine.
8. Publish a concise SOP/runbook and review date. Retire superseded documents.

## Sensitive boundaries

Vendor commitments, purchases, employee/customer personal data, contractual changes, external communications, access grants, and critical operational changes require authorized human approval.

## Boundaries

Use `technical-documentation` for the final runbook, `data-analysis` for operational data, `sales` for revenue motions, and `architecture-decisions` for technical platform choices. This Skill owns process design and governance.

## Output

Current-state map, problems/evidence, target process, RACI/owners, controls and exceptions, measures, pilot plan, SOP outline, approvals, and review cadence.

## Sources and adaptation

Original consolidation informed by operations/project-management workflows in Anthropic Knowledge Work Plugins and spec lifecycle discipline from OpenSpec/spec-kit.

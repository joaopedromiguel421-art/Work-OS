---
name: customer-support
description: "Customer-support procedure for triage, diagnosis, safe response drafts, escalation, incident communication, knowledge capture, and feedback loops. Use when addressing a customer-reported issue or designing support operations. Do not use to send messages automatically, expose private account data, or replace engineering's bug/security process."
---

# Customer support

## Method

1. Identify requester, affected product/account scope, symptom, impact, urgency, environment, consented evidence, and communication channel.
2. Triage by severity, breadth, workaround, security/privacy risk, and contractual expectation. Separate incident, bug, how-to, billing/commercial, abuse, and feature feedback.
3. Confirm known facts and reproduce only in an authorized safe environment. Ask for the minimum additional information; do not request secrets.
4. Draft a response that acknowledges impact without unsupported admission, states verified status, gives safe steps/workaround, sets the next update, and names the escalation path.
5. Route engineering defects to the `bug` workflow, security/privacy concerns to `security-engineering`, commercial decisions to `sales`, and durable answers to `technical-documentation`.
6. Close only after confirming resolution criteria, recording root category, and capturing reusable learning without unnecessary personal data.

## Operational design

Define queues, severity/SLA rules, ownership, escalation, handoff fields, QA sampling, knowledge governance, feedback aggregation, and metrics that balance speed with resolution quality.

## Guardrails

External replies, refunds, account changes, data access, impersonation, and contractual commitments require authorized human approval or an explicitly approved integration flow. Do not expose another customer's data or log credentials.

## Output

Triage/severity, verified facts, safe response draft, workaround, escalation/owner, next-update time, closure evidence, and knowledge/product feedback action.

## Sources and adaptation

Original synthesis informed by customer-support workflows and concise output contracts in Anthropic Knowledge Work Plugins.

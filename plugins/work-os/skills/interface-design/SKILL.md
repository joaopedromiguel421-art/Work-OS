---
name: interface-design
description: "Interface and UX procedure for flows, information architecture, interaction states, accessibility, responsive behavior, and design-system fit. Use when creating or materially changing a user-facing screen, journey, component behavior, or usability. Do not use for brand positioning, campaign strategy, standalone copy, or backend-only implementation."
---

# Interface design

## Method

1. Define the user, context, job, primary action, success signal, constraints, and actual content.
2. Map the journey and information hierarchy before choosing visual form. Remove steps and ambiguity before decorating.
3. Reuse the project's design tokens and component primitives. Add a primitive only when a repeated gap is demonstrated.
4. Specify all states: first use, loading, partial, empty, success, validation, recoverable error, permission denied, offline/timeout, disabled, and destructive confirmation as relevant.
5. Design semantics, keyboard flow, focus order/visibility, labels, contrast, target size, zoom/reflow, reduced motion, localization, and assistive feedback with the core interaction.
6. Check responsive behavior against content pressure rather than device names alone.
7. Prototype or implement the smallest end-to-end flow, then verify with deterministic accessibility/build tests and representative manual review.

## Independent critique

Use `ux-critic` for a separate read-only review after a material flow is coherent, especially before high-traffic or high-consequence release. Provide user/job, screenshots or code paths, design authority, and constraints. The main conversation chooses and writes changes.

## Boundaries

Use `brand-system` for identity/tokens, `copy-and-content` for message craft, `landing-page` for conversion-page integration, and `cro-experimentation` for testable conversion hypotheses. This Skill owns interaction quality, not those domains.

## Output

User/job, flow, hierarchy, component/state specification, accessibility requirements, responsive rules, design-system changes, verification evidence, and unresolved tradeoffs.

## Sources and adaptation

Original synthesis of critique dimensions and anti-pattern awareness from Impeccable, with frontend quality concepts from Addy Osmani's Agent Skills. Anthropic's source-available frontend Skill is reference-only and not copied.

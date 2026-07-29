# Research basis

Research snapshot: 2026-07-29. Refresh the official sources before making claims about the latest detector rules or saturated aesthetic patterns.

## Contents

- Central finding
- Primary sources
- Portability basis
- What the evidence changes in practice
- Limits

## Central finding

AI slop is best understood as accelerated design homogenization. An underspecified prompt is converted into an authoritative-looking, statistically average artifact; the first plausible result creates design fixation; the cost of revising generated code makes “good enough” sticky. The visual tells are downstream symptoms.

The practical countermeasure is productive friction: pause before generation or editing, clarify context, compare genuinely different product-grounded directions, anchor to the existing design system and cultural context, and verify the rendered result rather than accepting polish as proof.

## Primary sources

### Impeccable

- [Impeccable Slop Catalog](https://impeccable.style/slop/) distinguishes AI-slop rules from general quality rules and separates deterministic CLI checks, browser-layout checks, and LLM-only judgment. The catalog documents evolving waves: first purple gradients, glass and neon; later cream palettes, editorial scaffolding, italic-serif heroes, glows, cardification, and copy cadences. It explicitly flags the rounded icon tile stacked above a heading and identical icon-card grids.
- Impeccable names the short label or pill immediately above a hero headline **Hero eyebrow / pill chip** and recommends dropping it, integrating necessary context into the headline, or using a real breadcrumb. Its [v3.0.7 changelog](https://impeccable.style/changelog/) records deterministic detection for the uppercase, letter-spaced and pill-chip variants.
- [Impeccable repository](https://github.com/pbakaus/impeccable) describes one skill, 23 commands, and 60 deterministic detector rules. The source inspected for this snapshot was repository HEAD `adf7d706fa7cc4155ddceca241748e3de021ec8e` on 2026-07-29. The project is Apache-2.0 licensed.
- Current Impeccable practice adds four visitor modes—Persuade, Operate, Read, Experience—plus explicit refinement/redesign semantics, a product-grounded concept procedure, a direction contract, authored assets instead of decorative chrome, bounded browser QA, and a separate finishing verdict.

### Design homogenization research

- Shin, Gao, Pang, Lee, Reinecke, and Tseng, [“Interrogating Design Homogenization in Web Vibe Coding”](https://arxiv.org/abs/2603.13036) (2026), argues that frictionless generation can amplify homogenization. The paper identifies vulnerable moments at initial intent expression and iterative refinement, when creators are likely to accept model defaults.
- The paper’s mitigation is productive friction: deliberate pauses for reflection, clarification, comparison, and negotiation. It also recommends anchoring organizational generation to existing design tokens, brand guides, or live product context rather than treating every task as a blank slate.
- The paper warns that dominant global defaults can erase regional or cultural preferences, and that framework and model defaults can incrementally replace a bespoke design system.

### Accessibility and performance floor

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) requires at least 4.5:1 contrast for ordinary text and 3:1 for large text at Level AA, supports 200% text resize without loss of content or function, and includes focus and target-size requirements.
- [WCAG 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) sets a 24×24 CSS pixel minimum or sufficient spacing at Level AA; larger important controls remain a sound usability target.
- [Core Web Vitals](https://web.dev/articles/vitals) currently define “good” field thresholds as LCP ≤2.5 seconds, INP ≤200 milliseconds, and CLS ≤0.1 at the 75th percentile.
- [Nielsen’s usability heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) remain a useful non-aesthetic check for status, real-world match, control, consistency, prevention, recognition, efficiency, minimalism, recovery, and help.

### Practitioner corroboration

- [Slopless.design](https://www.slopless.design/) catalogs practitioner-observed patterns: purple/blue gradients, generic typography and AI imagery, background blobs, nested icon boxes, meaningless dashboard chrome, bento grids, and generic copy. Treat this as field observation, not a formal standard.

## Portability basis

- The [Agent Skills specification](https://agentskills.io/specification) defines the portable core as a directory containing `SKILL.md` with `name` and `description`, plus optional scripts, references, and assets. Relative paths resolve from the skill root.
- [Claude Code skills](https://code.claude.com/docs/en/slash-commands) follow the open Agent Skills standard and add optional Claude-specific features. This skill does not depend on those extensions.
- [OpenAI Skills](https://help.openai.com/en/articles/20001066) also follow the open standard and can move between supported OpenAI products and other compatible clients.
- Cursor describes skills as the same open, dynamically loaded `SKILL.md` format. Product-specific invocation syntax, metadata, and discovery paths are optional client concerns, not workflow dependencies.

## What the evidence changes in practice

1. **Assess before detecting.** Automated findings can anchor a reviewer on visible signatures and hide deeper interchangeability.
2. **Anchor to truth.** Existing tokens, components, assets, product behavior, and cultural context are stronger inputs than aesthetic adjectives.
3. **Interrupt the first plausible answer.** Name the category default and predictable anti-default; compare materially different directions before a redesign.
4. **Use mode-specific judgment.** Distinctiveness is a higher bar for Persuade and Experience; earned familiarity is often correct for Operate.
5. **Replace chrome with evidence.** Product artifacts, real imagery, specific copy, and honest demonstrations reduce both visual sameness and false claims.
6. **Treat quality as part of authorship.** A visually unusual page with low contrast, broken states, or mobile overflow is still low-quality output.
7. **Bound iteration.** Inspect desktop and mobile together, batch fixes, confirm once, and disclose remaining gaps rather than polishing indefinitely.

## Limits

- “AI slop” has no stable formal definition; the visible tells shift as generators and design trends change.
- A pattern is not proof of AI authorship. Humans use the same trends, and a strong brief can legitimately require them.
- Distinctiveness is not universal weirdness. Product interfaces often benefit from familiar controls and restrained systems.
- Static code detection cannot judge cultural fit, truthfulness, emotional tone, hierarchy, or whether the design is memorable.
- Lab performance and screenshots cannot prove real-user field performance, assistive-technology behavior, or device coverage.

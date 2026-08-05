---
name: unslopify
description: Audits and improves websites or web interfaces that feel AI-generated, generic, template-like, overdecorated, visually homogeneous, or insufficiently crafted. Use for requests to remove AI slop, de-AI a design, make a landing page feel authored, replace generic SaaS aesthetics, remove default icon tiles, standalone card icons, or AI metaphors, reduce card soup or decorative effects, strengthen product-specific art direction, improve UI hierarchy and copy, or perform an anti-slop review before shipping. Supports landing pages, marketing sites, portfolios, docs, dashboards, apps, and individual components; can produce a read-only critique or implement and verify fixes. Uses the open Agent Skills format without requiring a specific agent or harness.
---

# Unslopify

Turn a generic interface into a specific, coherent, production-ready one. Treat slop as a failure of intent, truth, hierarchy, identity, and finish—not as a fixed list of forbidden CSS properties. Follow the open Agent Skills format and operate through capabilities, not product-specific tool names.

## Non-negotiables

- Preserve working behavior, product truth, factual copy, routes, accessibility, and confirmed brand commitments unless the user explicitly authorizes a redesign.
- Never invent customers, testimonials, prices, benchmarks, capabilities, live status, or data. Label illustrative content clearly.
- Judge the rendered interface before reading detector findings. Mechanical findings can anchor taste and cannot assess specificity.
- Do not swap one saturated default for its fashionable opposite. “No purple gradient” does not imply cream editorial; “no cream” does not imply neon dark mode.
- Fix causes, not signatures. Removing a glow while leaving an interchangeable hero and empty claims is still slop.
- Remove decorative hero or section eyebrow badges completely, including their text and wrapper. Do not merely remove the pill styling or turn the copy into a floating overline. Preserve only labels with real navigation, state, filtering, taxonomy, or required-context value, and place those in the appropriate semantic pattern.
- Remove decorative Sparkles, Brain, Bot, emoji, and similar stock symbols used as shorthand for “AI,” “smart,” “automation,” “innovation,” or a broad card category. Do not let a lone icon consume its own row above a card title. Remove it by default; retain it only when it identifies a real action, object, state, or destination, and then integrate it compactly into the title row or another semantically appropriate control. Do not replace Lucide with another generic icon library.
- Inspect a real browser path at representative desktop and mobile sizes whenever the target is viewable and browser control exists. Disclose a source-only review as degraded.
- Keep audit-only requests read-only. Implement only when the user asks to fix, redesign, improve, or remove the problems.

## Load the right references

- Read [references/surface-modes.md](references/surface-modes.md) before choosing a direction or changing a visual system.
- Read the relevant sections of [references/anti-slop-catalog.md](references/anti-slop-catalog.md) after the unanchored visual assessment and before editing.
- Read [references/research.md](references/research.md) when explaining the rationale, updating the skill, or when the user asks for current research. If “latest” matters, refresh the official Impeccable sources first; anti-slop tells change over time.

## Harness-neutral execution

Resolve `<skill-root>` to the directory containing this `SKILL.md`. Keep the working directory at the user’s project when running bundled scripts.

Use capabilities in this order:

1. **Files and code:** use the agent’s native read, search, edit, and shell tools. When shell search exists, prefer `rg`.
2. **Rendered inspection:** use any available browser automation or preview tool. Reuse an existing project Playwright, Puppeteer, or browser-test setup before adding dependencies.
3. **Screenshots:** use the harness’s screenshot capability or the project’s existing browser tooling. Capture files when another reviewer or later verification pass needs stable evidence.
4. **External research:** use an available web or browser tool and prefer primary sources. Do not block an implementation on browsing unless current information is material.
5. **No browser available:** inspect source and build output, mark visual conclusions `DEGRADED: source-only`, and list the desktop/mobile checks still required.
6. **No shell or Node available:** skip the optional detector helper and continue with manual catalog review. Never treat tool absence as a clean scan.

Do not require subagents, a particular invocation prefix, an MCP server, or product-specific metadata. If isolated workers are available and authorized, they may separate unanchored visual judgment from detector evidence; otherwise run those passes sequentially and keep detector results out of the first pass.

The optional `agents/openai.yaml` file only improves OpenAI UI presentation. It is not part of the workflow and other agents may ignore it.

## Workflow

### 1. Resolve scope and authority

Resolve the request to concrete files, routes, and—when possible—a live URL. Determine whether the task is:

- **Audit:** diagnose and report without editing.
- **Refine:** preserve the incumbent visual world and improve execution.
- **Redesign:** preserve product truth and function while replacing the visual world.

Inspect, in this order:

1. product, brand, and design documentation;
2. the target route or component;
3. tokens, theme, shared components, and real assets;
4. neighboring screens that establish visual or interaction truth.

Write a short private preservation list: behavior, content, brand assets, system conventions, and out-of-scope areas that must remain unchanged.

### 2. Select the visitor mode

Choose by the surface, not by the company:

- **Persuade:** the visitor must understand, believe, and act.
- **Operate:** the user must complete a task.
- **Read:** the reader must understand and navigate information.
- **Experience:** the visitor is exploring the work itself.

Use [references/surface-modes.md](references/surface-modes.md) for mode-specific standards. A tool’s marketing page is Persuade; its dashboard is Operate.

### 3. Run an unanchored visual assessment

Do this before any detector or grep scan.

Inspect the rendered desktop and mobile experience with the best available browser capability. Record evidence for:

- **Specificity:** Could an unrelated product reuse the composition, copy, imagery, and motion unchanged?
- **Product truth:** Does the page demonstrate the actual mechanism, task, artifact, or proof—or merely claim benefits?
- **Hierarchy:** Does the squint test reveal one lead, clear groups, and a deliberate reading or task path?
- **Identity:** Do type, color, imagery, shape, and motion form one recognizable world?
- **Content:** Are real assets and specific language doing the work, or is decorative chrome filling missing content?
- **Eyebrow check:** Is a short badge, pill, chip, kicker, overline, or uppercase label sitting immediately above the hero H1 or repeated section headings? If it is promotional decoration rather than essential context, mark the whole element for deletion.
- **Icon check:** Are Sparkles, WandSparkles, Brain, BrainCircuit, Bot, emoji, or similar stock symbols standing in for an AI concept or broad category? Does each card reserve an otherwise empty first row for one icon before the title? Do cards repeat the same icon-title-copy grammar? Mark decorative instances and their reserved space for removal, regardless of icon source.
- **Usability:** Do controls, states, responsive behavior, focus, contrast, and errors work?
- **Finish:** Are spacing, alignment, wrapping, loading, and edge cases consistent?

Name both:

1. the category’s predictable default; and
2. the predictable “anti-default” currently used to avoid it.

If the interface lands in either by reflex, it needs a stronger product-grounded direction.

### 4. Gather deterministic evidence

After the visual assessment, run the bundled helper:

```bash
node <skill-root>/scripts/run-detector.mjs --json <target-file-or-directory>
```

The helper searches common shared and client-specific skill locations plus `PATH`, and uses an installed Impeccable detector without downloading anything. If Node or the detector is unavailable, report that and continue with source inspection plus browser evidence; do not pretend a manual grep is equivalent. If the user authorizes package download and `npx` exists, the direct fallback is:

```bash
npx impeccable detect --json <target-file-or-directory>
```

For a live URL, scan desktop and mobile separately:

```bash
node <skill-root>/scripts/run-detector.mjs --json --viewport 1280x800 <url>
node <skill-root>/scripts/run-detector.mjs --json --viewport 390x844 <url>
```

Verify every finding in context. Classify it as confirmed, false positive, intentional exception, or advisory. A clean detector result is a floor, not proof of authorship or quality.

Also search likely component and class names such as `eyebrow`, `kicker`, `overline`, `badge`, `pill`, `chip`, and `tag`. Confirm candidates against the rendered hierarchy: names alone are not evidence, but a decorative short label directly preceding a hero or section heading is.

Search imports from `lucide-react`, `lucide-vue-next`, `lucide-svelte`, `lucide-preact`, `lucide-angular`, `lucide-react-native`, `lucide`, and comparable icon packages. Inspect uses of `Sparkles`, `WandSparkles`, `Brain`, `BrainCircuit`, `Bot`, `BotMessageSquare`, emoji literals, and repeated `icon` fields or props in card data. An import, glyph, or icon name alone is not a finding; confirm that the rendered symbol is decorative, a generic metaphor, or repeated explanatory-card scaffolding—especially a standalone first child above the card heading.

### 5. Build the root-cause map

Cluster evidence instead of producing a long bag of nits:

1. **Truth and relevance:** generic claims, invented proof, empty imagery, product mechanism absent.
2. **Structure and hierarchy:** default page scaffold, cardification, equal visual weight, weak task path.
3. **Identity and art direction:** category-default palette/type, mixed motifs, decorative effects without a world.
4. **Interaction and states:** broken affordances, missing states, modal reflexes, decorative motion.
5. **Craft and integrity:** contrast, overflow, spacing, typography, responsiveness, performance, accessibility.

Prioritize in this order:

- **P0:** broken task, data loss, inaccessible path, misleading state.
- **P1:** unclear offer/task, absent proof, category-interchangeable structure, major hierarchy or responsive failure.
- **P2:** inconsistent system, missing states, weak content, repeated template tells.
- **P3:** isolated cosmetic tell with little user impact.

Keep P3 noise out of the way of P0–P2 work.

### 6. Set a direction contract

Before editing, state six concise decisions:

- **Thesis:** the one product-specific idea the surface should own.
- **Visitor success:** what the visitor understands or completes.
- **Proof/artifact:** what real content demonstrates the claim or task.
- **Composition:** what leads, what supports, and how the first viewport works.
- **Visual world:** type, color strategy, shape, imagery, and motion in one coherent vocabulary.
- **Refusal:** the category default and anti-default this direction will not imitate.

For refinement, derive the contract from the incumbent system. For redesign, introduce productive friction:

1. Name the audience’s real use scene and cultural or professional world.
2. Derive three to five concrete references from artifacts, interfaces, publications, places, or rituals that audience actually knows.
3. Reject near-duplicates and candidates based only on generic aesthetic adjectives.
4. Choose by audience identification and product clarity, not novelty alone.
5. Ask for the user’s decision when the alternatives would materially change brand identity; otherwise follow a precise brief.

Use the first-viewport memory test: if someone leaves after one viewport, can they describe something more specific than a mood?

### 7. Implement in cause-first order

When edits are authorized, work in this sequence:

1. **Truth and content:** specific copy, real product artifacts, honest data, useful imagery.
2. **Information architecture:** remove repetition, expose the primary task/action, fix grouping and disclosure.
3. **Composition:** replace default scaffolds with a structure shaped by the content or task.
4. **Visual system:** normalize type roles, color roles, spacing, radii, elevation, and icon/imagery grammar.
5. **Components and states:** default, hover, focus, active, disabled, loading, empty, error, success, and permission states as applicable.
6. **Motion:** one authored moment for Persuade/Experience, or concise state/continuity feedback for Operate/Read.
7. **Integrity:** accessibility, responsiveness, performance, semantics, localization, and code cleanup.

Prefer subtraction before decoration:

- Replace nested or identical cards with proximity, rhythm, dividers, lists, tables, or a content-specific composition.
- Replace a generic hero with the product mechanism, artifact, or primary task.
- Delete decorative Lucide-style Sparkles, Brain, Bot, and generic AI/automation metaphors. Remove their icon containers and spacing; do not swap in another stock glyph or emoji.
- Replace icon-tile feature grids with real evidence, workflow, comparison, demonstration, or a typographic list. If cards remain, let their content and relationships create hierarchy instead of assigning every card an icon.
- Remove any decorative icon-only row above a card title and reclaim its height, gap, wrapper, and padding. If a retained icon has concrete semantic value, use a compact card-header layout: keep the title as the lead, place the icon beside it or aligned to the trailing edge in the same row, avoid a large tile, and preserve sensible reading order and wrapping on narrow screens.
- Delete decorative hero and repeated section eyebrows, including the badge wrapper, icon, and copy. Do not preserve the same slogan as unboxed microcopy. Fold genuinely essential context into the heading or body; render real breadcrumbs, statuses, filters, or taxonomy through their established semantic component.
- Replace glow, glass, gradient, and fake depth with a deliberate surface and one elevation model.
- Replace vague buzzwords with a specific verb, object, outcome, and constraint.
- Remove fabricated proof; use verified proof or an explicit replacement placeholder.

Do not rewrite unrelated areas merely to make the diff look comprehensive.

### 8. Verify in bounded passes

Run the project’s build, typecheck, lint, and relevant tests through the available shell or task runner. Then verify the real path:

1. Capture desktop and mobile together with available browser or screenshot tooling.
2. Test the primary path with keyboard and pointer.
3. Exercise long copy plus relevant loading, empty, error, disabled, and success states.
4. Check focus visibility, contrast, zoom/reflow, reduced motion, overflow, and image loading.
5. Check that the contract survived and preserved behavior still works.
6. Confirm that removed eyebrow elements left no empty wrapper, orphan icon, stray margin, or awkward vertical gap above the heading.
7. Confirm that removed decorative icons left no empty first row, tile, gap, misaligned card padding, stale icon prop, unused import, or unused dependency. Confirm that retained semantic icons share a compact header or appropriate control instead of pushing the title downward; retest them for accessible names, recognizable meaning, and narrow-screen wrapping.
8. Fix material findings in one batch and confirm once more.
9. Run one final detector pass when the detector is available. Do not keep polishing in an open-ended loop.

For performance-sensitive work, measure rather than infer. Current Core Web Vitals targets are LCP ≤2.5 s, INP ≤200 ms, and CLS ≤0.1 at the 75th percentile; lab checks are proxies, not field proof.

### 9. Report evidence

Lead with the outcome. Include:

- the root causes removed, not just CSS symptoms;
- files and routes changed;
- what product truth and brand identity were preserved;
- desktop/mobile and interaction evidence;
- build/test/detector results and verified false positives;
- any blocked real assets, claims, states, devices, or field-performance proof.

For an audit, use a compact evidence matrix:

| Area | Status | Evidence | Priority | Remedy |
|---|---|---|---|---|
| Specificity | PASS/FAIL/BLOCKED | concrete route or screenshot observation | P0–P3 | cause-level change |

Never claim “fully unslopped” from static analysis alone.

## Completion gates

The work is complete only when all applicable gates have evidence:

- **Specific:** the surface could not be relabeled for a neighboring product without structural changes.
- **Truthful:** claims, data, imagery, and states are real or clearly marked.
- **Directed:** one thesis, one reading/task path, and one coherent visual world survive.
- **No decorative pre-headline chrome:** promotional eyebrow badges, pills, chips, kickers, icons, and their copy are absent above hero and repeated section headings; any retained label has a concrete semantic job.
- **No stock AI iconography:** generic Sparkles, Brain, Bot, emoji, and repeated icon-tile card decorations are absent; retained icons communicate concrete actions, objects, states, or destinations.
- **No icon-only card shelf:** no decorative icon occupies a separate row above a card title; any justified icon is compactly integrated without outranking or displacing the heading.
- **Useful:** the offer or task is obvious and the primary path works.
- **Systematic:** repeated roles use shared tokens and components without drift.
- **Inclusive:** responsive, keyboard, focus, contrast, motion, and content extremes work.
- **Finished:** the rendered before/after was inspected, material regressions were fixed, and remaining gaps are disclosed.

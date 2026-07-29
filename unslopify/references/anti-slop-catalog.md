# Anti-slop catalog

Treat these as diagnostic signals. A single pattern can be intentional; a cluster of unexamined defaults, interchangeable content, and weak execution is the stronger diagnosis. The brief and an established brand can legitimately require a saturated pattern.

## Contents

- Structural sameness
- Typography tells
- Color and surface tells
- Imagery and evidence tells
- Motion tells
- Copy tells
- Product-quality failures
- Repair principles

## Structural sameness

### Default landing-page scaffold

**Signal:** centered hero, generic subhead, two CTAs, floating dashboard mockup, logo strip, three or six feature cards, testimonials, pricing, FAQ, final CTA.

**Why it reads as slop:** the structure follows training frequency rather than the product’s proof or the visitor’s decision.

**Repair:** start with the mechanism, strongest artifact, real workflow, comparison, or decisive proof. Let content determine section topology and order.

### Identical card grid

**Signal:** repeated same-size cards containing rounded icon tile, heading, and two lines of copy.

**Repair:** decide whether the content is a list, sequence, comparison, table, narrative, demonstration, or genuinely independent set. Use cards only for independent, actionable units.

### Stock AI metaphor icons

**Signal:** Sparkles, WandSparkles, Brain, BrainCircuit, Bot, BotMessageSquare, or a lookalike line icon is used to mean “AI,” “smart,” “automation,” “assistant,” “innovation,” or “magic.” The pattern often comes from Lucide because it is readily available, but the same metaphor from another library, inline SVG, or emoji is equivalent.

**Why it reads as slop:** the symbol names a vague category instead of demonstrating the product’s mechanism. Repeating the same small set of metaphors makes unrelated AI products visually interchangeable.

**Default repair:** delete the decorative icon, its tile or container, and the space reserved for it. Strengthen the heading and copy or show a truthful product artifact. Do not substitute another stock sparkle, brain, robot, wand, bolt, orbit, or circuit glyph.

**Exception:** retain a symbol when it has a concrete interface job and improves recognition, such as Search, Menu, Close, Back, Upload, Download, Calendar, visibility, media controls, a verified status, or a domain-specific object. Give icon-only controls accessible names; library origin alone is not a defect.

### Icon-decorated explanation cards

**Signal:** every feature, benefit, process, or “how it works” card starts with a Lucide-style icon, often inside a rounded square or circle, followed by a heading and similar-length paragraph.

**Why it reads as slop:** the icons manufacture superficial variety while the cards remain structurally identical. The treatment gives decorative glyphs more prominence than the explanation.

**Default repair:** first decide whether the content should remain cards. Prefer a workflow, comparison, annotated artifact, ordered steps, typographic list, or fewer asymmetric groups. If cards are genuinely independent units, remove decorative icons and create hierarchy through content, typography, spacing, and evidence.

**Cleanup:** remove empty icon wrappers, icon props, dead mapping fields, and unused imports. Remove the package dependency only when the project no longer uses it for legitimate controls or states.

### Nested cards and container soup

**Signal:** panels inside bordered, rounded, shadowed panels; every grouping gets its own surface.

**Repair:** flatten with proximity, headings, whitespace, dividers, alignment, and shared background fields. Depth must communicate state or elevation.

### Hero metric

**Signal:** giant number, small label, supporting stats, gradient accent.

**Repair:** use verified evidence in the context where it changes a decision. Do not make a metric the hero merely because a number looks impressive.

### Bento by reflex

**Signal:** irregular box grid with unrelated screenshots, charts, or AI images arranged mainly to fill space.

**Repair:** make each region support one coherent story or task. If the grid has no reading order, replace it.

### Modal reflex

**Signal:** a multi-step, multi-column, or scroll-heavy task is placed in a modal.

**Repair:** use inline disclosure, a drawer, dedicated page, or progressive flow unless interruption and protected focus are essential.

## Typography tells

### Typeface chosen by trend

**Signal:** Inter, Geist, Space Grotesk, Instrument Serif, Fraunces, Playfair, Cormorant, or another currently saturated face chosen without a role-specific reason.

**Context:** familiar sans faces can be correct in Operate UI. The problem is reflex, especially when a Persuade or Experience surface needs identity.

**Repair:** name three physical or cultural voice references, browse real font catalogs, and choose by glyph character, language coverage, weights, performance, and role.

### Oversized italic serif hero

**Signal:** large italic high-contrast serif used as the universal marker of taste.

**Repair:** only retain when the subject or established identity genuinely calls for it. Otherwise choose a voice rooted in the product’s world and set the real copy at realistic widths.

### Decorative hero eyebrow or pill badge

**Signal:** a short promotional label sits immediately above the hero H1, often in a rounded pill with an icon, uppercase lettering, wide tracking, accent color, or tinted background. Common source names include `eyebrow`, `kicker`, `overline`, `badge`, `pill`, and `chip`.

**Why it reads as slop:** it is the default AI SaaS pre-headline and usually repeats a category, audience, or promise that the headline and body should communicate. Removing only the border or background retains the same generated scaffold.

**Default repair:** delete the entire element: wrapper, icon, and text. Close the leftover gap and let the heading begin the hero. Do not demote the same slogan into plain microcopy above the H1.

**Example:** remove `<div class="hero-badge">⚡ AI for marketing results</div>` rather than restyling it.

**Exception:** preserve information that genuinely functions as a breadcrumb, status, active filter, taxonomy, event date, version, or required disclosure. Use the product’s established semantic component, and move it away from the decorative eyebrow position when practical.

### Repeated section kicker labels

**Signal:** the same tiny label-above-heading construction repeats across sections, whether boxed or unboxed.

**Repair:** delete decorative kickers and rebuild hierarchy with stronger headings, artifacts, imagery, spacing, or section structure. Fold unique essential context into the heading or opening sentence instead of keeping the scaffold.

### Numbered section labels

**Signal:** 01 / 02 / 03 repeated as editorial decoration.

**Repair:** keep numbers only when order carries information, such as an actual process or timeline.

### Flat or crushed type

**Signal:** adjacent roles have nearly identical size/weight, or display tracking is tighter than -0.04em.

**Repair:** define a small role scale with unmistakable contrast. Tune tracking optically and stress-test long words, localization, fallback, and mobile widths.

### Giant long headline

**Signal:** a full sentence at 6rem or larger consumes the first viewport.

**Repair:** shorten the headline or reduce scale. Display scale is earned by concise language.

## Color and surface tells

### First-wave AI palette

**Signal:** purple-to-blue gradients, cyan on dark, neon glow, blurred orbs, gradient text.

**Repair:** choose a color strategy and roles from the product world. Use color to own a region, encode meaning, or direct attention—not to declare “modern.”

### 2026 tasteful default

**Signal:** cream or beige ground, high-contrast serif, terracotta or signal-red accent, hairline editorial rules.

**Repair:** do not automatically invert to dark mode. Derive the palette from brand material, use scene, assets, and audience; neutral chroma zero is valid.

### Dark technical costume

**Signal:** near-black surface, one neon accent, colored box-shadow halos, monospace labels, fake terminal cues.

**Repair:** use dark mode only when the scene supports it. Reserve mono for code, data, or measurement. Use neutral elevation and actual product structure.

### Glass and glow as filler

**Signal:** blur, translucent borders, radial spotlights, or floating ambient color with no layering or material reason.

**Repair:** use one defined surface model. Blur should solve layering; lighting should belong to a deliberate scene.

### Side stripe and ghost card

**Signal:** thick colored `border-left`/`border-right`, or a 1px border paired with a wide diffuse shadow.

**Repair:** use a full border, tint, icon, label, or semantic status; choose either edge or elevation.

### Over-rounding

**Signal:** 24–40px radii on ordinary cards, sections, and inputs; everything approaches a pill.

**Repair:** define a small radius scale. Ordinary card radii often sit around 12–16px; pills belong to compact controls and tags.

### Decorative grid or stripes

**Signal:** repeating gradients or two-axis grid-line backgrounds on surfaces that are not maps, canvases, blueprints, or measuring tools.

**Repair:** use a plain field, real artifact, or texture from the subject’s world.

## Imagery and evidence tells

### Chrome instead of content

**Signal:** gradients, icon tiles, empty charts, sparklines, progress rings, or soft rectangles occupy the space where proof or imagery should be.

**Repair:** author the missing material: product screenshots, real examples, diagrams, data, covers, thumbnails, photos, or honest synthetic demonstrations.

### Generic AI or stock imagery

**Signal:** polished but context-free people, plasticky objects, random blobs, or images that do not support the message.

**Repair:** search for the subject’s physical object and specific scene. One decisive image beats five generic ones. Verify URLs, rights, crop, loading, and alt text.

### Shape-assembled hero illustration

**Signal:** a large scene built from many primitive SVG shapes as a fallback for real art.

**Repair:** use crisp geometry for diagrams and icons, but use a real photograph, illustration, generated raster asset, or intentionally authored graphic for a pictorial hero.

### Fake dashboards and data

**Signal:** complex UI mockups and charts that look credible but communicate nothing or imply nonexistent capability.

**Repair:** show a truthful workflow or label demonstration data as synthetic. Never invent commercial claims.

## Motion tells

### Motion without a job

**Signal:** every section fades upward; buttons bounce; icons wiggle; cards lift; images scale on hover.

**Repair:** define one focal moment for Persuade/Experience or use motion only for feedback, state, and continuity in Operate/Read.

### Fake liveness

**Signal:** pulsing status dot or blinking cursor disconnected from live data or input.

**Repair:** use a static labeled state unless the system is genuinely changing.

### Auto-scrolling marquee

**Signal:** content moves continuously and cannot be read at the user’s pace.

**Repair:** make the content stationary or user-controlled. Use continuous motion only when motion itself is the subject.

### Hidden-at-rest reveal

**Signal:** core content starts at `opacity: 0` or hidden and depends on JavaScript to appear.

**Repair:** keep content visible by default and enhance the entrance. Provide reduced-motion behavior and pause expensive loops offscreen.

### Bounce or elastic easing

**Signal:** springy easing applied as a generic personality layer.

**Repair:** prefer purposeful deceleration; use a physical spring only when the interaction’s material behavior earns it.

## Copy tells

### Generic SaaS language

**Signal:** streamline, empower, supercharge, world-class, enterprise-grade, next-generation, cutting-edge, seamless.

**Repair:** use a specific verb, object, user, outcome, and constraint. Explain what the product literally does.

### Aphoristic AI cadence

**Signal:** repeated “Not X. Y.”, “X, without Y.”, “No X. Just Y.”, or dramatic fragments across sections.

**Repair:** make the specific claim once. Vary sentence structure because meaning changes, not to simulate voice.

### Meta-criticism and theater framing

**Signal:** the page attacks a strawman or calls alternatives “theater” instead of explaining its own value.

**Repair:** state the product’s behavior, evidence, and tradeoff directly.

### Redundant UX writing

**Signal:** label, heading, helper, hint, and empty-state text repeat the same idea.

**Repair:** decide the one fact needed now, the next action, and only the context that changes the decision.

### Fabricated confidence

**Signal:** unsupported metrics, customer logos, live status, testimonials, or precise promises.

**Repair:** remove, verify, or mark a clear replacement placeholder. Visual polish never legitimizes invented proof.

## Product-quality failures

These are not uniquely AI-generated, but slop often hides them behind surface polish:

- body text below WCAG AA contrast; gray text on colored backgrounds;
- invisible or obscured keyboard focus;
- missing labels, names, semantics, and logical tab order;
- text or controls overflowing at mobile, zoom, or localization extremes;
- one-column first viewports stretched by an imbalanced sibling;
- line measure beyond roughly 75–80 characters and tight leading;
- touch targets too small or crowded;
- layout-property animation and unbounded filters/shadows;
- missing loading, empty, error, disabled, success, and permission states;
- broken or placeholder images;
- arbitrary type, color, radius, and spacing values drifting from the system;
- dropdowns, tooltips, and popovers clipped by overflow containers;
- first-load script errors or content hidden when reveal code fails.

## Repair principles

1. Specific content beats decorative treatment.
2. Proximity and hierarchy beat container count.
3. One coherent material world beats a collection of tasteful moves.
4. Real proof beats a claims section.
5. Familiarity is valuable in task UI; distinctiveness is valuable in brand surfaces.
6. Accessibility and performance are part of craft, not cleanup.
7. A detector catches signatures; only rendered judgment catches product interchangeability.

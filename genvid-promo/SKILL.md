---
name: genvid-promo
description: Create polished Remotion product-promotion videos from a repository, live product, design files, screenshots, or a product brief. Use when asked for a launch video, hero video, feature promo, product teaser, social promo, or narrated product showcase that must use verified product UI, components, tokens, transitions, animation, synchronized TTS voiceover, and a rendered MP4.
---

# GenVid Promo

Produce the finished video, not only a script or storyboard. Build a deterministic Remotion composition whose narration, visuals, product claims, and timing are verified.

## Mandatory startup

1. Inspect the invocation for both a TTS provider and an API-key value or explicit environment-variable/secret reference.
2. If either is missing, stop and ask: **Which TTS provider should I use, and how should I access its API key? Prefer a secret environment variable such as `OPENAI_API_KEY` or `GEMINI_API_KEY`; I will not commit or print it.**
3. Do not silently choose a provider, assume an existing key, synthesize placeholder speech, or continue past this gate.
4. Immediately load the installed `remotion-best-practices` skill in full. Load its `video-layout` rule before design; load its audio, transitions, captions, FFmpeg, and metadata rules when those features are used. Explicitly say that this dependency is being used. If unavailable, state that and use [references/production-pipeline.md](references/production-pipeline.md) as the minimum fallback.
5. Read [references/tts-providers.md](references/tts-providers.md) before implementing synthesis. Verify current provider models and SDK/API formats against official documentation because they change.

## Workflow

### 1. Establish the brief

Determine product, audience, launch goal, platform, aspect ratio, target length, tone, CTA, locale, and required claims. Infer reversible creative choices when absent. Ask only for choices that materially alter the result.

Default to 1920x1080, 30 FPS, 35-75 seconds, one narrator, captions, and a clear CTA. Add vertical or square compositions when the requested channel needs them.

### 2. Verify the real product

Inspect the repository and run the actual app when available. Trace real routes, components, data states, design tokens, fonts, icons, copy, plan names, prices, and feature behavior. For a live product, inspect the real rendered experience with browser automation. Never invent a screen, capability, metric, testimonial, price, or interaction.

Use product visuals in this order:

1. Import real components into a controlled Remotion/demo harness with deterministic mock data.
2. Extract animation-safe display components while preserving the actual DOM, tokens, copy, and states.
3. Build source-derived replicas only when real components cannot render outside the app; compare them with actual screenshots and disclose this fallback.
4. Use screenshots or screen recordings only where animation-safe components are impractical.

Do not expose production secrets or mutate live data merely to film a state.

### 3. Write the story and storyboard

Use a compact arc: hook -> problem -> reveal -> proof through real usage -> strongest benefits -> CTA. Give every scene one message and one focal visual. Write scene narration before final timing.

Create `storyboard.json` using [references/storyboard-schema.md](references/storyboard-schema.md). Include exact UI state, component/source provenance, actions, narration, claims, and transition intent for every scene.

### 4. Build the Remotion system

Create a reusable visual system for product tokens, typography, safe areas, browser/device frames, cursor, highlights, typewriter text, camera moves, and transitions. Use `useCurrentFrame()` with `interpolate()` or justified `spring()` calls; never CSS animations or transitions.

Prefer designed motion: camera focus, masked reveals, shared-axis moves, tasteful crossfades, object continuity, and temporal staging. Avoid random motion, generic card grids, tiny UI, and simultaneous competing focal points.

### 5. Generate and synchronize narration

Generate one audio file per scene. Preserve the transcript as the source of truth. Measure real audio duration and write `voiceover-manifest.json`; derive scene duration from audio plus lead-in and breathing room. Start narration after the visual establishes, and schedule visible actions to the exact sentence that describes them.

Do not stretch audio to fit fixed scenes. Regenerate or retime when delivery and visuals diverge. Add captions from the known transcript; use STT only when the spoken output differs enough to require word-level timestamps.

Run `node <skill-dir>/scripts/validate-genvid.mjs <storyboard> <manifest> [project-root]` before rendering.

### 6. Render and inspect

Render representative stills near each scene's entrance, midpoint, key interaction, and exit. Inspect them at normal viewing size. Fix clipping, unreadable text, accidental overlap, cursor drift, unfaithful UI, dead time, abrupt cuts, and narration mismatches.

Render the final MP4 with H.264, BT.709, and high-quality AAC audio unless the destination requires another format. Watch the entire result with sound. Confirm runtime, dimensions, codecs, audio presence, final CTA, and artifact paths.

## Completion standard

Finish only when the MP4 exists and has been watched or sampled across the full timeline. Report the rendered path, dimensions, FPS, duration, TTS provider/model/voice, source of product visuals, verified claims, tests performed, and any intentional replica/capture fallback.

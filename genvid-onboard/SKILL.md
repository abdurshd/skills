---
name: genvid-onboard
description: Create detailed step-by-step onboarding and product-demo videos for a specific website, app, repository, project, or workflow using verified real UI and behavior. Use when asked to explain how a product works, demonstrate setup or a user journey, record an onboarding walkthrough, or teach exact product usage with Remotion animations, cursor actions, synchronized TTS narration, captions, and a rendered MP4.
---

# GenVid Onboard

Produce a truthful, reproducible walkthrough of a real product. The final video must show the exact labels, states, actions, and outcomes a user will encounter.

## Mandatory startup

1. Inspect the invocation for both a TTS provider and an API-key value or explicit environment-variable/secret reference.
2. If either is missing, stop and ask: **Which TTS provider should I use, and how should I access its API key? Prefer a secret environment variable such as `OPENAI_API_KEY` or `GEMINI_API_KEY`; I will not commit or print it.**
3. Do not silently choose a provider, assume an existing key, synthesize placeholder speech, or continue past this gate.
4. Immediately load the installed `remotion-best-practices` skill in full. Load its `video-layout` rule before design; load its audio, transitions, captions, FFmpeg, and metadata rules when used. Explicitly say that this dependency is being used. If unavailable, state that and use [references/production-pipeline.md](references/production-pipeline.md) as the minimum fallback.
5. Read [references/tts-providers.md](references/tts-providers.md) and verify current provider details against official documentation.

## Workflow

### 1. Define the journey

Identify the user persona, starting state, prerequisites, exact goal, environment, authentication needs, target runtime, locale, aspect ratio, and whether sensitive information must be obscured. Break large products into chapters rather than rushing through every feature.

Default to 1920x1080, 30 FPS, captions, one narrator, visible cursor/click feedback, and chapter title cards.

### 2. Reproduce the real flow

Inspect the repository and run the app, or operate the authorized live/test environment. Perform the journey yourself from the stated starting state. Record exact routes, labels, validation messages, loading states, menus, dialogs, keyboard steps, success states, and recoverable errors.

Never fabricate a click path or use stale documentation when the product can be checked directly. Do not alter production data, submit real payments, send messages, invite users, or publish content without explicit authorization.

Use product visuals in this order:

1. Render real components with deterministic mock state in a dedicated Remotion/demo harness.
2. Capture the real test/local UI and augment it with Remotion cursor, zoom, highlights, and callouts.
3. Build source-derived replicas only when components and captures are impractical; verify against screenshots and disclose the fallback.

### 3. Script exact steps

Write narration as actions and outcomes: orientation -> prerequisite -> action -> visible result -> why it matters -> next action. Use the same labels the user sees. Do not narrate a control before it is visible.

Create `storyboard.json` with [references/storyboard-schema.md](references/storyboard-schema.md). Every scene must identify starting UI state, exact action, expected state change, source component or capture, narration, and transition.

### 4. Build the walkthrough

Use browser/device frames, cursor paths, click ripples, keyboard indicators, focus rings, camera moves, and state transitions. Keep the target control large enough to identify. Reserve space for captions and callouts. Use `useCurrentFrame()` with deterministic interpolation; never CSS animations or transitions.

Keep chronology honest: the cursor arrives before clicking, the click precedes the state change, loading lasts plausibly, and success appears only after the action completes. Use cuts between distant routes and continuous movement within a single task.

### 5. Generate and align narration

Generate one audio file per step or coherent scene. Measure actual duration and derive scene lengths from the voiceover manifest. Align cursor arrival, click, typed input, loading, and success state to the exact narrated clauses. Leave a short visual lead-in and breathing room.

Add captions from the known transcript. Use STT only when word-level timing or speech drift requires it. Run `node <skill-dir>/scripts/validate-genvid.mjs <storyboard> <manifest> [project-root]` before rendering.

### 6. Validate the walkthrough

Replay the actual product flow and compare it with the video. Render representative stills for each action and result. Watch the entire video with sound. Fix incorrect labels, stale routes, cursor misses, unexplained jumps, hidden controls, unreadable text, narration drift, secret exposure, and misleading outcomes.

Render the final MP4 with H.264, BT.709, and high-quality AAC unless another format is required.

## Completion standard

Finish only when the MP4 exists and the demonstrated journey has been rechecked against the product. Report the output path, product version/commit or URL checked, journey covered, dimensions, FPS, duration, TTS provider/model/voice, visual-source method, captions status, test account/data assumptions, and verification performed.

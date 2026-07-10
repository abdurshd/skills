---
name: genvid-tutor
description: Create complete narrated teaching videos for any topic using Remotion, including lesson design, accurate research, animated explanations, diagrams, examples, synchronized TTS voiceover, captions, visual QA, and final MP4 rendering. Use for educational explainers, concept lessons, course segments, worked examples, training videos, or animated tutorials that are not necessarily tied to a software product.
---

# GenVid Tutor

Turn a topic into a finished, pedagogically coherent video. Produce the storyboard, Remotion implementation, synchronized narration, captions, QA artifacts, and rendered MP4.

## Mandatory startup

1. Inspect the invocation for both a TTS provider and an API-key value or explicit environment-variable/secret reference.
2. If either is missing, stop and ask: **Which TTS provider should I use, and how should I access its API key? Prefer a secret environment variable such as `OPENAI_API_KEY` or `GEMINI_API_KEY`; I will not commit or print it.**
3. Do not silently choose a provider, assume an existing key, synthesize placeholder speech, or continue past this gate.
4. Immediately load the installed `remotion-best-practices` skill in full. Load its `video-layout` rule before design; load its audio, transitions, captions, FFmpeg, and metadata rules when used. Explicitly say that this dependency is being used. If unavailable, state that and use [references/production-pipeline.md](references/production-pipeline.md) as the minimum fallback.
5. Read [references/tts-providers.md](references/tts-providers.md) and verify current provider details against official documentation.

## Workflow

### 1. Define the lesson

Identify the learner level, learning objective, prerequisite knowledge, language, tone, target runtime, aspect ratio, and desired depth. When unspecified, infer a reasonable audience and state the assumption.

Default to 1920x1080, 30 FPS, captions, a single narrator, and the shortest runtime that teaches the objective without rushing.

### 2. Establish factual ground truth

Research unstable, technical, medical, legal, financial, or niche claims using current primary sources. Separate consensus, simplification, analogy, and uncertainty. Build examples that are correct, solvable, and appropriate for the learner. Do not animate a confident falsehood.

### 3. Design the pedagogy

Structure the lesson as: promise/objective -> prerequisite bridge -> concept chunks -> concrete example or demonstration -> retrieval check -> recap. Introduce one new idea at a time. Use narration to explain reasoning and visuals to show relationships, state changes, spatial structure, or worked steps.

Create `storyboard.json` using [references/storyboard-schema.md](references/storyboard-schema.md). Give each scene a learning purpose, narration, visual model, action timing, and transition intent.

### 4. Build explanatory visuals

Use Remotion components for diagrams, timelines, equations, code, maps, labeled objects, simulations, and stepwise transformations. Preserve visual continuity so learners can track what changed. Highlight only the element currently discussed.

Use `useCurrentFrame()` and `interpolate()` for deterministic motion. Avoid decorative animation that competes with the explanation, unexplained icons, illegible code, long paragraphs, and generic slides full of bullets. For equations and code, reveal logical units rather than individual characters unless typing is itself instructional.

### 5. Generate and synchronize narration

Generate one audio file per scene from the approved transcript. Measure the audio and derive scene durations from it. Time diagrams, highlights, examples, and answers to the spoken clauses that explain them. Include short thinking pauses before revealing answers.

Add captions from the transcript. Use STT only when generated speech materially diverges or word-level timing is required. Run `node <skill-dir>/scripts/validate-genvid.mjs <storyboard> <manifest> [project-root]` before rendering.

### 6. Verify learning and rendering

Render representative stills and inspect readability at normal video size. Watch the full video with sound and confirm that every visual is introduced before it is needed, every label is readable, no answer appears prematurely, captions match, and pacing leaves time to think.

Render the final MP4 with H.264, BT.709, and high-quality AAC unless another destination format is required.

## Completion standard

Finish only when the MP4 exists and has been watched or sampled across the full timeline. Report the output path, lesson objective, audience assumption, dimensions, FPS, duration, TTS provider/model/voice, factual sources used, captions status, and verification performed.

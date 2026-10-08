# GenVid production pipeline

Use this baseline only after loading the installed `remotion-best-practices` skill. The installed skill is authoritative for current Remotion APIs.

## Required artifact flow

```text
verified facts or product state
  -> scene storyboard and narration
  -> one TTS file per scene
  -> measured voiceover manifest
  -> audio-derived Remotion scene durations
  -> representative still QA
  -> final MP4 and full-timeline QA
```

## Project shape

Prefer this separation:

```text
scripts/
  generate-voiceover.*
  render-all.*
  render-stills.*
src/
  Root.tsx
  videos/
  components/
  lib/timing.ts
  storyboard.json
  voiceover-manifest.json
public/
  voiceover/<video>/<scene>.<format>
  assets/
out/
stills/
```

Keep story data, provider calls, timing math, visuals, and render orchestration separate. A provider swap must not require rewriting the video components.

## Timing contract

Measure the audio file rather than estimating from word count. For each scene:

```text
sceneFrames = ceil((audioSeconds + tailPaddingSeconds) * fps) + leadInFrames
audioStart = sceneStart + leadInFrames
nextSceneStart = sceneStart + sceneFrames - transitionOverlapFrames
```

Good starting values at 30 FPS are 0.3-0.55 seconds lead-in, 0.6-1.0 seconds tail padding, and 10-18 frames transition overlap. Tune from the actual delivery.

Map visual actions to narrated clauses. A scene being the correct total length is not sufficient if the click, highlight, diagram, or state change happens under the wrong words.

## Visual fidelity

- Use verified design tokens, fonts, icons, labels, content, and states.
- Import real application components when they can run deterministically.
- Mock network and user data at the boundary; do not fork the visible component into an invented design.
- When a replica is unavoidable, cite its source component and compare rendered stills with real screenshots.
- Keep readable content in layout containers. Reserve absolute positioning for layering, cursors, callouts, and decoration.
- Give each scene one focal message. Use time to reveal secondary information.

## Motion

- Use `useCurrentFrame()` with `interpolate()` for deterministic entrances, exits, focus, and camera motion.
- Use `spring()` only when physical settling or overshoot is intentional.
- Keep transforms editable with individual `scale`, `translate`, and `rotate` properties.
- Never use CSS transitions, CSS keyframes, or Tailwind animation classes.
- Use transitions to express continuity or a chapter change, not to decorate every cut.
- Ensure a cursor reaches a control before click feedback and before the resulting state change.

## Narration and captions

- Store the approved transcript beside the storyboard.
- Generate scene-sized clips so a failed line can be regenerated independently.
- Preserve the provider, model, voice, prompt/style, format, sample rate, and duration in the manifest or generation log.
- Build captions from the transcript when sentence-level timing is enough.
- Use provider timestamps or STT when word-level highlighting is required. Do not describe TTS as STT.

## QA gates

1. Validate the storyboard and manifest with `validate-genvid.mjs`.
2. Typecheck and lint the Remotion project.
3. Render stills at each scene's entrance, midpoint, key action, and exit.
4. Inspect stills at expected playback size.
5. Render the final media.
6. Confirm codec, dimensions, FPS, duration, audio stream, and output size.
7. Watch the full timeline with sound and captions.
8. Recheck product claims or lesson facts against their sources.

Do not call the task complete merely because the render command exited successfully.

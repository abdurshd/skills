---
name: genvid-explainer
description: Turns a topic into a finished 2–3 minute narrated motion-graphics explainer MP4 — Uzbek Gemini voice via Speko, ChatGPT stills, Veo 3.1 clips from Google Flow, Remotion 3D and motion design, word-synced captions and music. Use when asked to make an explainer video about a topic ("X haqida video", "explain X in a video").
---

# GenVid Explainer

The user gives a topic; you deliver a reviewed `out/<slug>.mp4`. One gate stops for the user: the **greenlight** (script + asset plan + Flow credit spend). Everything else runs on the defaults below unless the user's words override them.

| Setting | Default |
| --- | --- |
| Language / voice | Uzbek (Latin), Gemini `gemini-3.8-flash-tts`, voice Charon, through Speko |
| Audience / length | Total beginners, 2:30–3:00 (≈ 280–340 spoken words, 12–15 scenes) |
| Format | Standalone 1920x1080, 30 fps, burned-in word captions |
| Look | Dark, teal + amber, Unbounded / Manrope / JetBrains Mono (template `theme.ts`) |
| Visual mix | ChatGPT stills, ≤ 4 Veo clips (1 Quality hero + Fast), Remotion 3D, motion graphics |
| Project | `<projects_dir>/<slug>` |

**Machine settings** live in `local.md` beside this file (git-ignored, paths only). Read it first. If it is missing, ask the user once for each value listed in [local.example.md](local.example.md) and write `local.md`. `<name>` below means that setting.

- Speko credentials: `set -a; . <speko_env>; set +a` gives `SPEKO_API_KEY`, `SPEKO_BASE_URL`. Never print the key.
- Python with numpy, soundfile, torch, torchaudio: `PY=<python>`. If it is gone, `python3 -m venv ~/.venvs/genvid && ~/.venvs/genvid/bin/pip install numpy soundfile torch torchaudio` and update `local.md`.
- SFX: `template/public/sfx` is git-ignored (React Bits Sound Lab renders may be used in videos, not redistributed). If it is empty, copy the WAVs named in `template/src/components/Sfx.tsx` from `<sfx_dir>`.
- Browser work happens in the user's own Chrome, signed in to ChatGPT and Google Flow. In Claude Code that is Claude in Chrome (load the `chrome-browser` skill first); in Codex it is Codex's Chrome / computer-use tools. Read `~/Downloads` with `osascript` (`do shell script`): in Claude Code through the Control-your-Mac tool, in Codex from the shell.
- `<skill dir>` is the folder holding this `SKILL.md`; agents reach it through symlinks, so resolve it (`realpath`) before use.

Worked example (the Kubernetes video): [narration](references/examples/kubernetes-narration.json), scenes [S06Shipping](references/examples/S06Shipping.tsx), [S09Kitchen](references/examples/S09Kitchen.tsx), [S11Terms](references/examples/S11Terms.tsx), prop [Kazan](references/examples/Kazan.tsx).

## Steps

1. **Research and script.** Verify every fact the script states. Write `work/narration.json` (ordered `{ "s01_hook": "…", … }`) and a scene plan following [references/script.md](references/script.md). Done when every scene has narration, a visual beat list keyed to its words, and an asset tag (still / clip / 3D / motion).

2. **Greenlight.** Send the user one message: the narration table with an English gloss, the still list, the Veo shot list with its credit cost (Fast 20, Quality 100), the Flow balance if known, and the scene coder. Wait for a clear yes; adjust and re-ask on changes. Skip only when the user's request already pre-approves the plan and a credit budget. Never exceed the approved credits.

3. **Scaffold.** `<skill dir>/scripts/new-project.sh <projects_dir>/<slug>`; set the composition id in `src/Root.tsx` to the slug. Done when `npx tsc --noEmit` passes.

4. **Voice.** Generate, verify, align and time the narration per [references/voice.md](references/voice.md). Done when every line passes `tts_qa.py` (or was listened to and accepted), `public/vo/*.wav` exist and `src/data/timeline.json` is rebuilt.

5. **Visual assets.** Start the Veo clips first (they queue for minutes), then make the stills while they render: [references/stills-chatgpt.md](references/stills-chatgpt.md), [references/clips-flow.md](references/clips-flow.md). Build the music bed: `python3 scripts/music_bed.py <track> <total_seconds+5>` with a track from `<music_dir>` (check its licence file; an upbeat corporate track suits tech topics). Done when every planned asset exists in `public/` (stills 16:9, ≥ 1600 px wide; clips 1080p), each still was looked at, and each clip's frames were inspected.

6. **Scenes.** Stub and register every scene, brief the scene coder per scene, then review every sheet yourself and send defects back: [references/coder.md](references/coder.md), with the scene rules in [references/scenes.md](references/scenes.md). Done when you have signed off every scene's sheet: no collision, clipping, empty half-frame or unreadable text, and every visual lands on the word that names it.

7. **Render and QA.** Follow [references/render-qa.md](references/render-qa.md). Done when the MP4 is sampled across the whole timeline and the audio sits at −16 ± 1.5 LUFS integrated with peaks ≤ −0.5 dB.

8. **Wrap up.** Write the project `README.md` (commands + an assets-and-credits table: voice model/voice, image source, each clip with Veo tier, music licence). Delete test files, contact sheets, `work/bundle*`, `work/briefs`, temporary frames, and generated assets the final cut does not use; keep `work/narration.json`, `work/tts*`. Close every Chrome tab you opened. Deliver the MP4 (Claude Code: `SendUserFile`; Codex: link the path) and report: path, duration, voice, scene coder, sources, Flow credits spent and left, what was verified.

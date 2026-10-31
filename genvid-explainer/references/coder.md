# Scene coder: briefs, dispatch, review

You are the **director**: you own the plan, assets, timeline and final verdict. The **scene coder** (resolved in SKILL.md → Scene coder) writes every line of Remotion code: scenes, 3D models, new components and icons. When the resolved coder is the model you are running on, write the scenes yourself from the same briefs. You may still split them across subagents of that same model.

## 1. Prepare

1. Write a stub for every scene so the registry is final before anyone codes. Each `src/scenes/SNNName.tsx` exports `SNNName = () => null`, and `src/scenes/index.ts` maps every narration id to its component. Coders never touch `index.ts`.
2. Write one brief per scene at `work/briefs/<id>.md` from the template below. A coder knows only its brief, so put in it everything it needs.

```markdown
# Scene brief: <id>

Project: <absolute project path>. You own `src/scenes/<File>.tsx` (replace the stub) and any NEW files named
`src/scenes/parts/<id>_*.tsx`. Edit no other file; no git commands.

Read first: <skill dir>/references/scenes.md (rules, toolkit, review loop) and the remotion-best-practices skill
(<skills dir>/remotion-best-practices/SKILL.md). Toolkit sources: src/components, src/three, src/lib.

Scene: <id>, <duration> frames at 30 fps (composition `<id with hyphens>`). Comes after: <one line on the previous
scene's last image>. Leads into: <one line on the next scene>.
Narration: "<text>"
Word frames: read `src/data/timeline.json` → scenes[id="<id>"].words (scene-relative `s` frames); use `at(ID, prefix, nth)`.

Beats (word → what appears):
- <word> → <visual, position, motion>
- …

Assets: <public path> — <what it shows, where the subject sits, crop/sync notes, e.g. "clips/phone.mp4: tap at 3.8 s">
Look: dark bg, teal/amber (src/theme.ts); hero object: <e.g. ShipWheel, reused in s12–s14>.

Done when: `npx tsc --noEmit -p .` passes and your own contact sheets (scripts/sheet.sh <comp> f1 f2 f3 f4 at each
beat's peak) pass every check in scenes.md → Review loop. Look at each sheet image yourself; iterate until clean.
Report: files changed, the sheet frames you used and the sheet path, anything you could not resolve.
```

## 2. Dispatch

Run up to three coders at once; each renders stills, so more just thrash the CPU. Scenes are independent, so any order works. Start the visually riskiest (3D-heavy) scenes first.

**Claude Opus 5.5 from Claude Code.** Use the `Agent` tool, `subagent_type: "general-purpose"`, `model: "opus"`, `run_in_background: true`, one call per scene in a single message. Prompt: `Read <project>/work/briefs/<id>.md and carry it out.` Continue a coder with `SendMessage` to its agent id.

**GPT-6 Astra (from Claude Code, or from Codex when your session is not already Astra).** One background shell per scene:

```bash
codex exec -m gpt-6-astra -c 'model_reasoning_effort="high"' -C <project> --skip-git-repo-check \
  -o work/briefs/<id>.report.md \
  "Read work/briefs/<id>.md and carry it out." < /dev/null > work/briefs/<id>.log 2>&1
```

- `< /dev/null` is required: without it `codex exec` waits on stdin forever ("Reading additional input from stdin...").
- Leave the sandbox to the user's Codex config (`sandbox_mode` in `~/.codex/config.toml`; rendering works under `danger-full-access`). Under `-s workspace-write`, headless Chrome dies ("Failed to launch the browser process!"), so the coder can write and typecheck but cannot render its own sheets. If a coder reports it could not render, render its sheet yourself and hand it over as an image (below). The same applies when you are the Codex host: rendering needs full access.
- The log header prints `model:`, `sandbox:` and `session id: <uuid>`; check that `model: gpt-6-astra` is there. Continue a coder with the same model, effort and git flags, because `resume` otherwise falls back to the Codex default model:

```bash
codex exec resume <uuid> -m gpt-6-astra -c 'model_reasoning_effort="high"' --skip-git-repo-check \
  [-i work/sheet_<comp>.png] -o work/briefs/<id>.report.md "<observations to fix>" < /dev/null >> work/briefs/<id>.log 2>&1
```

  Never use `--last`, because several coders run at once.

**Claude Opus 5.5 from Codex** (only when the user asks for Opus there):

```bash
cd <project> && claude -p "Read work/briefs/<id>.md and carry it out." \
  --model opus --permission-mode acceptEdits --allowedTools=Bash,Read,Edit,Write < /dev/null > work/briefs/<id>.log 2>&1
```

Put the prompt first: `--allowedTools` takes a list and swallows a prompt placed after it. Continue a coder with `claude -p --resume <session-id> "…"` (add `--output-format json` to the first call to get its `session_id`).

## 3. Review and fix

When a coder reports, do not take its word: render or open its sheet yourself (`REUSE=1 scripts/sheet.sh <comp> …`) and `Read` it against the review checklist and the brief's beats. Send each defect back to the same coder as an observation with a location ("frame 430: the osh.yaml card covers NODE 3's right corner; shift the camera or narrow the card"). Repeat until you would sign off the sheet. A scene is done only on your sign-off.

Cross-scene polish (matching the hero object's placement between scenes, transition continuity) is a fresh brief to one coder, listing exactly which scene files it may edit.

Record the coder (tool and model) in the final report and in the project README credits.

---
name: claude-use
description: Launch Claude Code from Codex as a detached implementation worker after a plan is already agreed. Use when Codex should stay the manager, convert an approved plan into a detailed execution brief, and hand large or parallelizable repo work to Claude Code in headless `claude -p` mode with custom agents, `--model opus`, and bypassed permission prompts. Best for medium/large implementation tasks, UI-heavy work where Claude should drive visual decisions, multi-file refactors, or verification-heavy changes in a local repo. Do not use for trivial edits, pure brainstorming, or tasks that still need open questions resolved first.
---

# Claude Use

Use this skill only after the task is scoped well enough that Codex can act as manager and Claude Code can execute.

Claude Code CLI is mandatory for this skill. Use the authenticated `claude` executable directly and never silently substitute another harness. If `claude` is unavailable or unauthenticated, stop and report that prerequisite.

## Workflow

1. Build or confirm the plan in Codex first.
2. Reduce the task to an execution brief using [references/prompt-template.md](./references/prompt-template.md).
3. Save that brief to a temporary or repo-local Markdown file.
4. Launch Claude detached with [scripts/claude_use.sh](./scripts/claude_use.sh).
5. Watch the log file until the run finishes, then review Claude's changes yourself before reporting back.

## Decision Rules

- Use this skill for implementation, not for initial discovery.
- Prefer this skill when the work can be split into parallel streams or when frontend/UI judgment matters.
- Keep Codex as the owner of plan quality, task decomposition, and final review.
- Let Claude own implementation details inside the handed-off brief, especially UI/layout decisions.
- Do not use this skill when the task is tiny enough that Codex should just edit the files directly.

## Execution Brief Requirements

Every brief should include:

- Repository path and branch context
- Task objective in one paragraph
- Approved plan with ordered workstreams
- File or module hints if already known
- Constraints: no destructive git, preserve user edits, verify changes
- Validation commands Claude must run
- Output contract: changed files, verification, unresolved risks

For UI tasks, explicitly say that Claude should make the final call on visual hierarchy, spacing, layout, and interaction polish while still respecting the existing product patterns.

## Detached Launch

Run the launcher with a prompt file:

```bash
/Users/ricky/.codex/skills/claude-use/scripts/claude_use.sh \
  --cwd /absolute/repo/path \
  --prompt-file /absolute/path/to/claude-brief.md \
  --label feature-name
```

The launcher will:

- Copy the prompt into a run folder
- Generate a reusable `agents.json` file for Claude custom agents
- Create a `launch.sh` file with the exact command
- Start Claude detached with `nohup`
- Write `pid`, `log`, and `meta` files so Codex can monitor the run

## Built-In Agent Roles

The launcher defines four temporary Claude agents and expects the brief to tell Claude to use them aggressively when workstreams are independent:

- `repo-explorer`: map files, dependencies, and risks before editing
- `implementer`: own concrete code changes for one workstream
- `ui-director`: decide visual/UI changes and interaction quality
- `verifier`: run lint/build/tests and look for regressions

Tell Claude to split work across these agents when the repo changes do not overlap.

## Monitoring

Check the generated log file while Claude runs:

```bash
tail -f /path/to/.claude-use/runs/<timestamp>-<label>/claude.log
```

When the run ends, inspect the repo diff and rerun the key checks yourself. Codex stays accountable for the final handoff.

## Notes

- Use the actual current Claude Code flag `--dangerously-skip-permissions`. Do not invent a split `--dangerously --skip-permissions` form.
- The launcher also sets `--permission-mode bypassPermissions` so the run is explicit about its permission model.
- Stop and report the blocker when Claude Code launch or authentication fails; do not change harnesses.
- Read [references/research-notes.md](./references/research-notes.md) if you need the verified CLI facts behind this skill.

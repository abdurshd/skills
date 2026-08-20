# Claude Use Prompt Template

Use this template to create the prompt file that Codex hands to Claude.

```md
# Claude Execution Brief

## Operating Model

You are Claude Code running in headless print mode. Codex is the manager above you.
Treat this brief as the complete instruction set. Do not ask for permissions. Work
autonomously unless blocked by a truly missing external dependency or credential.

## Goal

[One paragraph describing the end state.]

## Repository Context

- Repo: [absolute path]
- Branch: [branch name if relevant]
- Important directories: [paths]

## Approved Plan

1. [Workstream 1]
2. [Workstream 2]
3. [Workstream 3]

## Mandatory Execution Rules

- Inspect the repo before editing. Confirm assumptions from code, not memory.
- Split the work into independent workstreams and use multiple custom agents in parallel when possible.
- Use `repo-explorer` first for codebase mapping if the affected files are not already obvious.
- Use separate `implementer` agents for disjoint write scopes.
- Use `ui-director` for layout, spacing, interaction, typography, and visual hierarchy decisions.
- Use `verifier` near the end to run validation and spot regressions.
- Do not revert unrelated user changes.
- Do not use destructive git commands.
- Keep edits scoped to the approved plan unless a nearby fix is clearly necessary.

## UI Direction

[Fill this in only for UI work. Example: "Claude has final say on the UI details. Make the interface feel premium, deliberate, and production-ready while preserving the site's existing brand language."]

## File Hints

- [Optional likely files/modules]

## Validation

Run these before finishing:

```bash
[command 1]
[command 2]
[command 3]
```

## Final Output Contract

Return:

- What you changed
- Which files you touched
- What you verified
- Any remaining risks or blockers
```

## Prompting Notes

- Keep the brief concrete and operational.
- Prefer explicit workstreams over vague goals.
- When the task is UI-heavy, make that explicit so Claude uses the `ui-director` agent early.
- When the task is broad, tell Claude which work can safely happen in parallel and which part is on the critical path.

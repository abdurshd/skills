---
name: claude-review
description: Use Claude Opus 5 through the authenticated Claude Code CLI as a detached critical reviewer for either (1) implementation-plan review before coding or (2) uncommitted-code review before commit. Trigger this skill when Codex already has a concrete task and either needs an independent Claude review to stress-test the plan against the codebase, security, and correctness concerns, or needs Claude to review local workspace changes for correctness, regressions, security, and alignment with the target task. Best for medium/large tasks, security-sensitive changes, refactors, and any work where Codex should iterate with Claude until the plan or implementation is defensible.
---

# Claude Review via Claude Code

Use this skill when Codex should remain the manager and Claude Opus 5, accessed through the user's authenticated Claude Code CLI, should act as the critical reviewer.

## Runtime Defaults

- CLI: `claude`
- model: `opus` (the current Opus alias exposed by Claude Code)
- reasoning: high
- execution mode: Claude Code `--permission-mode plan`, which is read-only

Claude Code CLI is mandatory for this skill. Invoke the authenticated `claude` executable directly and never silently substitute another harness. If `claude` is unavailable or unauthenticated, stop and report that prerequisite.

The stable skill and launcher names remain `claude-review` and `claude_review.sh` for compatibility with existing callers.

## Review Modes

- `plan`: review a proposed implementation plan before code changes begin
- `changes`: review the current uncommitted workspace before commit

## Workflow

### Plan Review Loop

1. Let Codex produce the first detailed plan.
2. Write a review brief using [references/prompt-template.md](./references/prompt-template.md).
3. Run [scripts/claude_review.sh](./scripts/claude_review.sh) with `--mode plan`.
4. Read Claude's findings and update the plan in Codex.
5. Repeat until Claude reports no material plan gaps or only low-risk notes.

### Changes Review Loop

1. Let Codex implement the task locally.
2. Write a review brief with the task, intended behavior, and validation context.
3. Run [scripts/claude_review.sh](./scripts/claude_review.sh) with `--mode changes`.
4. Read Claude's findings, fix the issues in Codex, and rerun if needed.
5. Commit only after the review is clean enough for the risk level of the change.

## What Claude Should Review

In both modes, Claude should inspect:

- repository reality versus assumptions
- correctness versus the requested task
- likely regressions
- security and data-handling risks
- missing validation or brittle edge cases

In `plan` mode, Claude should focus on whether the plan is implementable and complete.

In `changes` mode, Claude should focus on the actual workspace diff and any surrounding code it touches.

## Detached Launch

Run the launcher with a prompt file:

```bash
/Users/ricky/.codex/skills/claude-review/scripts/claude_review.sh \
  --cwd /absolute/repo/path \
  --prompt-file /absolute/path/to/review-brief.md \
  --mode plan \
  --label task-name
```

For code review:

```bash
/Users/ricky/.codex/skills/claude-review/scripts/claude_review.sh \
  --cwd /absolute/repo/path \
  --prompt-file /absolute/path/to/review-brief.md \
  --mode changes \
  --label task-name
```

The launcher will create a run folder with:

- the copied brief
- a generated combined prompt
- the specialist review lenses supplied to Claude Code
- git status and diff snapshots for `changes` mode
- `launch.sh`, `claude.log`, `pid`, and `meta.txt`

## Built-In Review Lenses

The launcher supplies these review-focused custom agents to Claude Code. Claude may delegate independent lenses when its runtime supports that, or cover them directly:

- `repo-explorer`: inspect architecture, touchpoints, and hidden dependencies
- `plan-auditor`: challenge feasibility, sequencing, and missing work in a plan
- `correctness-reviewer`: look for logic bugs, regressions, and task mismatch
- `security-reviewer`: look for auth, validation, data exposure, and injection risks
- `validation-reviewer`: look for missing tests, missing checks, and weak verification

Tell Claude to apply these lenses in parallel when its available agent facilities support safe delegation.

## Output Expectations

Claude should return findings first, ordered by severity, with file references when possible.

For `plan` mode, ask for:

- critical plan gaps
- incorrect assumptions about the codebase
- missing workstreams
- sequencing problems
- security or validation gaps
- explicit statement if the plan is acceptable

For `changes` mode, ask for:

- correctness bugs
- regressions
- security issues
- missing tests or validation
- explicit statement if no material findings were found

## Notes

- Claude Code must be installed, authenticated, and available as `claude`.
- When Codex runs the launcher from a restricted sandbox, use the required execution authority so Claude Code can access its authentication and network. Stop and report authentication failures rather than changing harnesses.
- Do not use `--dangerously-skip-permissions` or another permission bypass for review. The launcher uses Claude Code's read-only `--permission-mode plan` for both review modes.
- `--model` accepts a Claude Code alias or full model name; the default is `opus`. `--effort` defaults to `high` independently.
- Claude is the reviewer, not the final approver. Codex still owns the final judgment and user handoff.

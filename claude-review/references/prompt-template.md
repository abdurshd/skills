# Claude Review Prompt Template

Use one of these templates depending on the review mode. The launcher sends the completed brief to Claude Opus 5 through Claude Code CLI in read-only Plan permission mode.

## Plan Review Brief

```md
# Claude Plan Review Brief

## Goal

[Describe the user task and intended end state.]

## Current Proposed Plan

1. [Step 1]
2. [Step 2]
3. [Step 3]

## Review Instructions

Review this plan critically against the actual repository.

- Inspect the codebase before judging the plan.
- Use `repo-explorer`, `plan-auditor`, and `security-reviewer` early.
- Identify incorrect assumptions, missing workstreams, sequencing mistakes, risky omissions, and weak validation.
- Focus on whether this plan is implementable, complete, and safe.
- Do not rewrite the whole solution unless the current plan is materially flawed.

## Output Contract

Return findings first, ordered by severity:

- `Critical`: plan will likely fail or miss the goal
- `High`: major risk, missing step, or likely regression path
- `Medium`: useful correction or sequencing improvement
- `Low`: optional improvement

Then provide:

- `Plan verdict`: acceptable / needs revision
- `Required changes`: concise list
```

## Changes Review Brief

```md
# Claude Changes Review Brief

## Goal

[Describe the original task and intended behavior.]

## Review Scope

Review the current uncommitted workspace changes against the goal above.

## Review Instructions

- Inspect the workspace diff and the touched code around it.
- Use `correctness-reviewer`, `security-reviewer`, and `validation-reviewer` in parallel where possible.
- Look for correctness bugs, regressions, broken assumptions, security issues, and missing tests/checks.
- Judge the implementation against the intended task, not only against the diff itself.
- Do not make code changes. This is a review pass.

## Output Contract

Return findings first, ordered by severity, with file references when possible.

If no material findings are present, say that explicitly and note any residual risk or test gaps.
```

## Prompting Notes

- Keep the brief concrete.
- Include the plan or intended behavior in plain language.
- For plan review, include the full proposed plan.
- For changes review, include any important constraints that are not obvious from the diff.

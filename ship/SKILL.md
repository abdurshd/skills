---
name: ship
description: Commit, push, and ship the current work with a consistent, safe ritual — survey the diff, clean gitignore, short commits with no AI attribution, then the requested delivery mode. Use when the user says "commit", "push", "ship", "merge to main", "make a PR", or invokes /ship. Modes via args - (none) commit+push current branch; "migrate" run DB migrations then push; "merge" merge to main and return to this branch; "pr" new branch + PR to main; "review" fetch and address PR review comments.
---

# Ship

Standardized end-of-work delivery, so the same git ritual doesn't have to be re-typed every time.

## Always, in order (every mode)

1. **Survey first.** `git status` + `git diff --stat`. If there are changes you did not make in this session, list them and ask before including them — commit only what belongs together. Never `git add -A` blindly.
2. **Clean before staging.**
   - Delete leftover test files, temp scripts, debug logs, and scratch code created during the session.
   - Check for junk that should be gitignored (`.env*`, `node_modules`, build output, `.DS_Store`, IDE dirs, coverage, `*.log`). Add missing entries to `.gitignore` before staging.
   - Never commit secrets. If a diff contains an API key or DB URL, stop and say so.
3. **Commit style.** Short, imperative, lowercase-ish messages ("fix dropdown overflow in dashboard"). No AI/agent attribution, no Co-Authored-By, no emoji, no body unless the change genuinely needs one. If the diff spans unrelated concerns, split into logical commits without being asked.
4. **Push and confirm.** Push to the correct branch, then report: branch, commit hash(es), one-line summary of what shipped. If push is rejected, pull --rebase and retry once; if conflicts, stop and explain.
5. **No false "done".** After shipping, explicitly list anything that still needs env vars, provider/dashboard setup, data seeding, or a device install before the change actually works for a user. Pushed ≠ working.

## Modes (from args or context)

### (default) — commit + push current branch
Just steps 1–5.

### migrate — migrations + push
For projects that pair schema changes with a deploy:
1. Detect pending migrations (drizzle / prisma / supabase / raw SQL — from the repo). The DB URL is typically in `.env`.
2. Run migrations against the project's database. Show the output. If a migration fails, do NOT push — report and stop.
3. Then steps 1–5.

### merge — merge to main and come back
1. Steps 1–5 on the current branch first.
2. `git checkout main` (or `master` — detect), `git pull`, merge the feature branch, push.
3. **Always return to the original branch** — work usually continues there.

### pr — branch + pull request
1. If on main/master: create a descriptive feature branch first. Otherwise use the current branch.
2. Steps 1–5, push with `-u`.
3. `gh pr create` to main/master with a detailed description of what changed and why (the PR body can be long even though commits are short).
4. Report the PR URL.

### review — address reviewer comments on the PR
For when another reviewer (human or an AI review bot) leaves comments:
1. `gh pr view --comments` + `gh api` for inline review threads on the current branch's PR.
2. For each finding: verify it is real in the code before fixing. Skip and say so if a comment is wrong or stale — do not blindly apply.
3. Fix the real ones, commit (short messages), push to the same branch, and summarize per-comment: fixed / rejected-why.

## Notes

- "push" often means commit + push, not just push.
- If the user chained extra steps in the same request ("...and apply the same change to <other project>"), finish shipping FIRST, then do the extra steps — chained trailing steps are easy to drop.
- If a pre-merge review step is part of the workflow (e.g. `/codex-review`), run it and only ship when it passes.

---
name: fix-findings
description: Processes a pasted findings list from an external reviewer, PR review bot, security audit, or coding agent by verifying every claim against current code, fixing confirmed defects, rebutting stale or intentional findings, and reporting per-finding outcomes. Use when the user pastes P1/P2-style findings, says an agent found issues, asks to fix a review, or requests the fix-findings skill.
---

# Fix external reviewer findings

Findings from another agent or an earlier audit are claims, not facts. The code may have moved since the review, the reviewer may be wrong, and some "issues" are documented, deliberate decisions. Never blindly apply a findings list.

## Step 1 — Parse

Split the input into individual findings. For each, extract: severity (P0/P1/P2/...), the claimed defect, and the file/line/route it points at. If a finding is too vague to locate, mark it `unverifiable` and ask about it at the end rather than guessing.

## Step 2 — Verify each finding against the CURRENT code

For every finding, before touching anything:
1. Read the exact file/lines it references. Trace the actual behavior with real inputs — don't trust the finding's narrative or the code's names.
2. Classify:
   - **CONFIRMED** — the defect is real, right now, in this tree.
   - **STALE** — it was real once but is already fixed (check git log/blame for the fix if useful).
   - **INTENTIONAL** — the behavior is a documented decision. Check `AGENTS.md`, `CLAUDE.md`, client-specific project instructions, and relevant decision/audit docs; some tradeoffs are deliberate and must NOT be "fixed".
   - **WRONG** — the reviewer misread the code.
   - **UNVERIFIABLE** — cannot be located/reproduced from the description.
3. Do not broaden scope: fix exactly the issue set given, not everything you notice along the way. (Note genuinely serious unrelated discoveries at the end instead.)

## Step 3 — Fix the confirmed ones

- Smallest correct diff per finding; match surrounding code style.
- Highest severity first.
- After all fixes: run the project's typecheck / lint / relevant tests and show the real output. Where the finding is behavioral (auth, billing, routing), verify the fixed behavior directly, not just compilation.
- Delete any temp/test scaffolding you created while verifying.

## Step 4 — Report per finding

A table or list, one line per finding, in the original order:

| # | Severity | Verdict | Action |
|---|---|---|---|
| 1 | P1 | CONFIRMED | fixed in `api/route.ts:42` |
| 2 | P1 | INTENTIONAL | not changed — documented decision in AGENTS.md (<reason>) |
| 3 | P2 | STALE | already fixed in commit `abc123` |

End with: verification command output, and a suggested reply the user can paste back to the reviewing agent (fixed / rebutted-with-reason per finding).

## Rules

- Never mark a finding fixed without having verified the fix compiles/passes.
- Never "fix" an INTENTIONAL finding — rebut it with the documented reason.
- Do not commit or push unless asked; the user ships separately (see the `ship` skill).

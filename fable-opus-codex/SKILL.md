---
name: fable-opus-codex
description: The full fable-opus pipeline (Fable 5 plans and orchestrates, Opus 4.8 subagents implement, Fable verifies) plus a final Codex CLI review gate of the implemented changes - Codex findings are fixed by Opus fixer agents and re-reviewed until Codex approves. Use when the user invokes /fable-opus-codex or asks for the fable/opus orchestration with a codex check at the end.
---

# Fable orchestrates, Opus implements, Codex signs off

Extension of the `fable-opus` skill: the identical plan → implement → verify pipeline, plus a mandatory Codex CLI review gate on the finished work before it can be called done. This gives a second, independent model (Codex/GPT) a final adversarial pass over the actual diff.

## Steps 1–3: run the fable-opus pipeline

Follow the `fable-opus` skill exactly (plan file → Opus implementers with disjoint file ownership → Fable verifies against the plan, spawning Opus fixers until every plan item is implemented and typecheck/lint/tests pass). Do NOT start the Codex gate while your own verification still has open findings — Codex reviews finished work, not work in progress.

## Step 4: Codex review gate (of the CODE, not the plan)

This reuses the `codex-review` skill's mechanics (session-id capture, resume, `VERDICT: APPROVED/REVISE`, no fast tier, xhigh reasoning, max 5 rounds) but points them at the implemented diff instead of a plan.

1. Session-scoped ids and files:
```bash
REVIEW_ID=$(uuidgen | tr '[:upper:]' '[:lower:]' | head -c 8)
git diff --stat $(git merge-base HEAD main 2>/dev/null || git merge-base HEAD master) > /tmp/impl-${REVIEW_ID}.md 2>/dev/null || git diff --stat > /tmp/impl-${REVIEW_ID}.md
```
Append to `/tmp/impl-${REVIEW_ID}.md`: the plan file path, the list of changed files, and a short summary of what each workstream implemented. Keep it a map, not a dump — Codex runs read-only in the repo and reads the real files itself.

2. Round 1:
```bash
codex exec -m gpt-5.5 -s read-only -c model_reasoning_effort="xhigh" -o /tmp/codex-review-${REVIEW_ID}.md \
"Review the IMPLEMENTED changes described in /tmp/impl-${REVIEW_ID}.md against the plan file referenced inside it. Read the actual changed files in this repo. Focus on:
1. Plan compliance - is every plan item genuinely implemented, not stubbed?
2. Correctness bugs in the new code (trace real inputs, don't trust names)
3. Regressions - did the changes break adjacent behavior?
4. Security issues introduced by the changes
5. Leftover debris - test files, debug logs, dead code that should be deleted
Be specific: file, line, failure scenario. End with exactly VERDICT: APPROVED or VERDICT: REVISE"
```
Capture `session id: <uuid>` from the output as `CODEX_SESSION_ID` (never `--last`, which can grab the wrong concurrent session).

3. Verdict loop (max 5 rounds):
   - **REVISE** → for each real finding, spawn an Opus 4.8 fixer agent (`model: "opus"`, precise file/line/expected-vs-actual in the prompt) — the orchestrator still writes no code. First verify each finding is real; if Codex is wrong, or the behavior is an intentional, documented decision (check the project's AGENTS.md / CLAUDE.md "Key decisions" — some tradeoffs are deliberate), rebut it in the re-submission instead of "fixing" it.
   - Re-run your own typecheck/tests after fixes, then resume:
     ```bash
     codex exec resume ${CODEX_SESSION_ID} -c model_reasoning_effort="xhigh" \
     "Fixed: <list>. Rebutted: <list with reasons>. Re-review the changed files. End with VERDICT: APPROVED or VERDICT: REVISE" 2>&1 | tail -80
     ```
   - **APPROVED** → done. Max rounds without approval → report the unresolved findings and let the user decide.

4. Cleanup: `rm -f /tmp/impl-${REVIEW_ID}.md /tmp/codex-review-${REVIEW_ID}.md`

## Step 5: Final report

One report: plan status (all items verified), Codex verdict and number of rounds, what was fixed vs rebutted per round, real command output for typecheck/tests, and anything that still needs env/provider/device setup. Then offer to commit (see the `ship` skill) — this skill does not commit or push; shipping stays a separate explicit step.

## Requirements

- Codex CLI installed and authenticated (`npm install -g @openai/codex`). See the `codex-review` skill for the base configuration this gate reuses.

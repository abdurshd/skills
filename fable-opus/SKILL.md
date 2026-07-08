---
name: fable-opus
description: Fable 5 orchestrates, Opus 4.8 implements. Fable plans and supervises but never writes code itself - all implementation is delegated to Opus 4.8 subagents (xhigh effort for code, high for browser tasks), then Fable verifies against the plan and spawns Opus fixers until everything is done. Use when the user invokes /fable-opus, says "implement this plan with opus subagents", "you orchestrate, opus implements", or wants a large plan executed without the main session burning tokens on implementation.
---

# Fable orchestrates, Opus implements

A big-feature pipeline where the main session (Fable 5, high effort) is the planner, orchestrator, and inspector, and Opus 4.8 subagents do the hands-on coding. The orchestrator writes NO implementation code itself and keeps its own token spend minimal.

Why split this way: Fable 5 is strong at planning, decomposition, and judgment; Opus 4.8 at xhigh is strong at careful implementation. Keeping the orchestrator out of the code keeps its context clean for supervision and avoids spending the expensive planning model on mechanical edits.

## Preconditions

- The session model should be Fable 5. If it isn't (check which model you are), tell the user to switch with `/model` and re-invoke — don't run this pipeline as the implementer model.
- Args may name a plan file, a pasted findings list, or a feature description. All three work; they just enter at different steps.

## Step 1 — Plan (skip if a plan file already exists)

Produce a **written plan file in the repo root** (e.g. `FEATURE_X_PLAN.md`), not just a chat message. It must contain:
- Numbered phases/workstreams sized so one Opus agent can finish one workstream in one run.
- Per workstream: the exact file list it will create/modify, what "done" means, and any contracts shared with other workstreams (types, function signatures) spelled out in full so parallel agents don't drift.
- Which workstreams are independent (parallel) vs dependent (sequential).

For large scopes, show the plan and wait for the user's green light before spawning agents. Between phases the user often wants a commit (see the companion `ship` skill).

## Step 2 — Delegate to Opus

Spawn implementers with the Agent tool: `subagent_type: "general-purpose"`, `model: "opus"`. Launch independent workstreams in parallel (one message, multiple Agent calls). Every agent prompt MUST include:

1. Repo root and current branch.
2. The plan file path + exactly which sections to read first.
3. **FILE OWNERSHIP**: "you may ONLY modify/create these files — other agents are working in parallel on <other areas>; don't touch those." Disjoint ownership is what makes parallelism safe; if two workstreams need the same file, sequence them instead.
4. Current state of the code: "all landed and green — verify by reading, don't assume."
5. Acceptance criteria + instruction to run typecheck/tests scoped to its files before returning, and to report what it changed and anything it could not finish.

Effort rules:
- Code implementation → **xhigh**. The Agent tool inherits the session's effort by default, which may not be xhigh — so either have the user set `/effort` accordingly, or for big fan-outs use the Workflow tool's `agent(prompt, {model: 'opus', effort: 'xhigh'})`, which sets effort per agent directly.
- Browser-driving / computer-use tasks → **high, not xhigh** (over-thinking navigation wastes time; the orchestrator's job is precise step-by-step instructions so the agent doesn't wander to the wrong pages/tabs).

Orchestrator token discipline: do NOT read whole diffs or re-read the codebase after each agent. Rely on agent reports + targeted spot-checks. Your context is for supervision, not implementation detail.

## Step 3 — Verify (the orchestrator's real job)

After each phase completes:
1. Run the project's typecheck / lint / tests yourself (cheap shell commands, not agents).
2. Walk the plan checklist: for each item, spot-check the actual code (targeted Reads, not full files) to confirm it exists and matches the plan. "Agent said done" is not done.
3. Anything broken, missing, or off-plan → spawn a fresh Opus fixer agent with the precise finding (file, line, expected vs actual). Never fix it yourself.
4. Re-verify after fixes.

**Do not stop until every part of the plan is implemented and verified.** Don't end the turn with "phase 1 done, shall I continue?" — continue. Only stop for a genuine blocker or a decision that belongs to the user.

## Step 4 — Report and hand off

Per phase: one short report — what shipped, verification results (actual command output, not "should work"), what still needs env/provider/device setup, and what phase is next. Then offer to commit (see `ship`). For a review gate on the finished code, see the companion `fable-opus-codex` skill.

---
name: fable-opus-codex
description: Runs a delegated implementation pipeline followed by an independent iterative code-review gate. Defaults to Fable 5 orchestration, Claude Opus 5 through the latest Opus model selector for implementation, and OpenAI Codex CLI review, but honors any host, implementer, reviewer tool, or model explicitly selected by the user. Use for large multi-agent implementations that require disjoint ownership, orchestrator verification, and a second-agent approval verdict before shipping.
---

# Delegate implementation, then require independent review

Compose the `fable-opus` implementation protocol with the `codex-review` iterative reviewer protocol. The skill name records the default Fable → Opus → Codex pairing; each role is independently replaceable.

## Role selection

Resolve all roles before work:

1. Apply explicit user selections for host, orchestrator, implementer, reviewer, and models.
2. Fill unspecified roles from compatible project or session configuration.
3. Use defaults only for remaining roles:
   - orchestrator: Fable 5 at high effort;
   - implementer/fixer: the provider or harness's `opus` latest-model alias, currently Claude Opus 5 (`claude-opus-5`), at xhigh for code and high for browser work;
   - reviewer: Codex CLI with `gpt-5.6-sol`, high reasoning, regular service tier, and read-only access.

Settings propagate by role. For example, `implementer=cursor-agent reviewer=claude-opus` replaces both defaults while leaving the active host free to be Codex, Claude Code, Cursor, or another Agent Skills client.

Never silently replace an explicitly requested role. If only a default is unavailable, declare the compatible fallback before continuing.

## Steps 1–3: implement and verify

Load the companion `fable-opus` skill when it is installed. Otherwise use this self-contained implementation protocol:

1. create or adopt a written plan;
2. delegate disjoint workstreams to the selected implementation workers;
3. verify the real diff, project checks, runtime behavior, and every plan item;
4. send confirmed defects to fresh workers using the same selected implementer.

Do not start independent review while orchestrator verification has open findings. The reviewer evaluates finished work, not work in progress.

## Step 4: independent code-review gate

Load the companion `codex-review` skill when it is installed. Otherwise apply the tool-selection, session handling, verdict, and five-round protocol described below, reviewing the implemented diff against the plan.

### 1. Prepare the review packet

Create a session-scoped review directory using the platform's safe temporary-directory mechanism. Write an implementation map containing:

- repository root and branch;
- merge base or exact commit range;
- plan path;
- changed files;
- summary of each workstream;
- verification already completed;
- documented constraints and intentional decisions.

Keep the map concise. The selected reviewer must inspect the actual changed files through read-only repository access.

### 2. Review

Ask the selected reviewer to assess:

1. plan compliance and missing or stubbed work;
2. correctness with real input and state tracing;
3. regressions in adjacent behavior;
4. security, privacy, data-loss, and permission risks;
5. leftover debug code, temporary artifacts, or dead paths;
6. gaps in tests and runtime verification.

Require file/line/scenario evidence and one exact final line: `VERDICT: APPROVED` or `VERDICT: REVISE`.

The default reviewer is the `codex-review` Codex CLI configuration. When the user selects another reviewer, use that agent's native isolated review capability or authenticated non-interactive CLI while preserving read-only access and the same verdict protocol.

### 3. Verify and resolve findings

For every finding:

- verify it against the current checkout;
- classify it as confirmed, stale, wrong, intentional, or blocked;
- send confirmed fixes to a fresh worker using the selected implementer;
- rebut stale, wrong, or intentional findings with evidence;
- rerun relevant checks after fixes.

The orchestrator must not implement reviewer fixes directly.

### 4. Re-review

Resume the exact reviewer session when supported. Otherwise start a fresh read-only round whose packet includes the previous review, verified fixes, rebuttals, and current diff. Never use a global “last session” selector during concurrent work.

Stop after approval or five rounds. Five rounds without approval is not success; report unresolved findings for the user to decide.

## Step 5: report

Report:

- selected host and all role/model choices;
- plan completion evidence;
- review verdict and round count;
- findings fixed, rebutted, or blocked;
- exact test/build/runtime outcomes;
- remaining environment/provider/device setup.

Do not commit or push. Shipping remains a separate explicit action through the `ship` skill.

## Requirements

- An isolated implementation-worker capability or compatible external coding-agent CLI.
- A read-only reviewer capability or compatible external reviewer CLI.
- Defaults require access to Fable 5, the runtime-resolved latest Opus model, and an installed/authenticated Codex CLI; user-selected alternatives replace only the corresponding requirement.

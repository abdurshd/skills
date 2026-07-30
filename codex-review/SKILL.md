---
name: codex-review
description: Iteratively reviews and improves an implementation plan with an independent coding agent. Defaults to OpenAI Codex CLI using GPT-5.6 Sol with high reasoning and a read-only sandbox, but honors any reviewer tool, model, or harness explicitly selected by the user. Use for second-opinion plan reviews, adversarial risk checks, iterative approval gates, or requests to have Codex, Claude, Cursor, or another agent critique a plan before implementation.
---

# Iterative plan review

Run a bounded review loop between the active agent and an independent reviewer. The skill name records the default reviewer; it does not lock the workflow to Codex or to a particular host application.

## Reviewer selection

Resolve the reviewer once before round 1, in this order:

1. Use the reviewer tool, CLI, agent, or model explicitly named by the user.
2. Otherwise use a reviewer configured by the current project or session.
3. Otherwise default to OpenAI Codex CLI with `gpt-5.6-sol`, `model_reasoning_effort="high"`, regular service tier, and read-only access.

Treat host and reviewer as separate choices. Claude Code, Codex, Cursor, or another Agent Skills client may run this workflow while Codex, Claude, Cursor Agent, or another isolated coding agent performs the review.

Never silently replace an explicitly requested reviewer. If it is unavailable, report the missing executable, authentication, model access, or harness capability and stop. If only the default is unavailable, declare the fallback before using the host's standard isolated read-only reviewer.

## Harness-neutral review protocol

Use the host's native isolated-agent capability when it can select the requested reviewer and enforce read-only access. Otherwise invoke the selected reviewer through its authenticated non-interactive CLI.

The reviewer must be able to:

- read the plan and relevant repository context;
- return durable text;
- remain read-only;
- end with exactly `VERDICT: APPROVED` or `VERDICT: REVISE`.

Persistent reviewer sessions are preferred, not required. Resume the exact session when supported. For stateless reviewers, include the previous review, revised plan, and revision summary in the next request so no context is lost.

## Workflow

### 1. Create isolated review artifacts

Create one session-scoped temporary directory using the platform's safe temporary-directory mechanism and assign its absolute path to `REVIEW_DIR`. Keep these files inside it:

- `plan.md`: the current full implementation plan;
- `request-N.md`: the review request for round N;
- `review-N.md`: the reviewer's response for round N.

If no plan exists in the conversation or repository, ask the user what should be reviewed.

### 2. Run round 1

Ask the selected reviewer to inspect `plan.md` plus relevant read-only repository context and evaluate:

1. correctness and goal coverage;
2. risks, edge cases, and regression potential;
3. missing steps or verification;
4. simpler or safer alternatives;
5. security and data-loss concerns.

Require specific, actionable feedback and one exact final verdict.

The default Codex command is:

```bash
codex exec \
  -m gpt-5.6-sol \
  -s read-only \
  -c 'model_reasoning_effort="high"' \
  -o "$REVIEW_DIR/review-1.md" \
  "Read $REVIEW_DIR/request-1.md and review the plan it references. End with exactly VERDICT: APPROVED or VERDICT: REVISE."
```

Use the user's requested model or command instead when supplied. Capture the exact reviewer session identifier when the tool exposes one; never resume a global “last session” during concurrent work.

### 3. Present and classify the review

Show each round with reviewer identity:

```text
## Plan review - Round N
Reviewer: <tool/model>

<feedback>
```

- `APPROVED`: finish.
- `REVISE`: continue.
- Missing verdict with no actionable concern: treat as approved and note the inference.
- Missing verdict with actionable concerns: treat as revise.
- Five rounds reached: stop and report unresolved concerns.

### 4. Revise the plan

The active agent—not a hard-coded Claude or Codex role—must verify each finding and revise `plan.md`:

- apply confirmed improvements;
- reject stale, incorrect, or requirement-conflicting suggestions with reasons;
- preserve the user's explicit constraints;
- summarize each change for the next reviewer round.

### 5. Re-review

If the reviewer supports session resume, resume the captured session and point it to the revised plan and change summary. For default Codex:

```bash
codex exec resume "$REVIEW_SESSION_ID" \
  -c 'model_reasoning_effort="high"' \
  "Read the revised plan and revision summary in $REVIEW_DIR/request-N.md. Re-review and end with exactly VERDICT: APPROVED or VERDICT: REVISE."
```

If resume is unavailable or fails, start a fresh read-only review using a request packet containing the prior response, the revised plan path, and the revision summary.

### 6. Report and clean up

Report reviewer tool/model, rounds, final verdict, accepted revisions, rebutted findings, and unresolved concerns. Remove only the exact temporary directory created for this review after its path has been verified.

## Rules

- Maximum five rounds.
- Keep every reviewer read-only.
- Never claim approval when unresolved findings remain.
- Do not let reviewer feedback override explicit user requirements.
- Do not require slash-command syntax, a specific subagent API, or a particular host application.
- Default Codex requires an installed and authenticated `codex` CLI; alternative reviewers require their corresponding tool or native harness access.

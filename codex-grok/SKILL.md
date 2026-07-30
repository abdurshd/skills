---
name: codex-grok
description: Runs the hardened Codex/Grok two-model implementation preset in which OpenAI GPT-5.6 Sol at xhigh plans, orchestrates, and verifies while Grok 4.5 at high performs implementation through bounded Grok Build CLI workers. Use when the user requests codex-grok, asks Codex to supervise Grok, or needs this exact provider-specific safety wrapper. For arbitrary orchestrator or worker tools, use the portable fable-opus protocol instead.
---

# Codex orchestrates, Grok implements

Keep GPT-5.6 Sol's context focused on decomposition, judgment, and verification. Delegate every implementation edit to Grok 4.5 workers. Produce completed, verified work rather than a plan-only handoff.

## Non-negotiable model contract

- Orchestrator: `gpt-5.6-sol` with `model_reasoning_effort="xhigh"`.
- Workhorse: `grok-4.5` with `--reasoning-effort high`.
- Never substitute another model or effort silently.
- Run `scripts/preflight.sh` before planning. In Codex Desktop, if the only failure is sandbox DNS/HTTPS access to Grok, rerun the preflight through the host tool's narrow escalation flow. If live authentication or model access still fails outside that sandbox boundary, stop and ask the user to run `grok login --oauth`.
- If the active session is not verifiably GPT-5.6 Sol xhigh, relaunch through `scripts/launch-orchestrator.sh <repo-root> <objective-file> <result-file>`. The child prompt marks itself as already active to prevent recursive relaunches.
- Keep the child Codex sandbox at `workspace-write`. The launcher may add only the authenticated Grok state directory as an extra writable root.

## Codex Desktop launcher boundary

Try the orchestrator launcher normally first. In Codex Desktop, the outer app sandbox may reject nested Codex startup with a read-only `~/.codex/state_5.sqlite` or `failed to initialize in-process app-server client: Operation not permitted`. If that exact boundary appears, rerun only the outer launcher command through the host tool's explicit escalation flow.

This outer approval lets the nested CLI initialize its own state. It does not authorize `danger-full-access` or a broader filesystem sandbox. The launcher continues to pin `workspace-write`, exposes only `${GROK_HOME:-$HOME/.grok}` for authenticated Grok session state, and enables workspace-sandbox network access because Grok model discovery and worker calls require DNS/HTTPS. Inside that hard OS boundary, the Grok worker uses its own `bypassPermissions` prompt policy so dedicated edit tools and task-specific verification commands can run headlessly. The wrapper's explicit deny rules still block Git publication, history rewriting, and destructive recursive removal.

## Role boundary

Codex may:

- inspect the repository and current diff;
- ask necessary product decisions;
- write the orchestration plan and temporary worker prompts;
- partition file ownership and launch Grok workers;
- run tests, typechecks, builds, linters, browser/device checks, and read-only diagnostics;
- inspect targeted code and diffs;
- accept, reject, or refine worker output.
- repair this skill's own instructions, scripts, references, or metadata when the user explicitly asks for skill maintenance.

Codex must not:

- write, patch, or mechanically rewrite implementation, test, migration, configuration, or product documentation files;
- fix a worker's code directly, even for a one-line issue;
- let a worker commit, push, merge, publish, deploy, or mutate external production state;
- trust a worker's completion claim without checking the actual checkout.

Codex may write only orchestration artifacts such as a plan file and temporary prompt/report files. Send every product-code correction to a fresh Grok worker.

The product-code restriction does not prevent Codex from maintaining the `codex-grok` skill itself when explicitly requested.

## Workflow

### 1. Survey

Confirm repository root, branch, worktree status, project instructions, relevant tests, and the exact user objective. Preserve pre-existing user changes. Identify implementation dependencies and external-state boundaries before delegation.

### 2. Plan

Create a written plan in the repository root unless the user supplied one. Include:

- numbered workstreams small enough for one Grok worker;
- exact files or non-overlapping globs owned by each workstream;
- shared contracts written in full;
- acceptance criteria and required verification commands;
- dependency order and which workstreams can run concurrently;
- files that no worker may touch.

If two workstreams need the same file, sequence them. Never rely on workers to merge concurrent edits to a shared file.

### 3. Prepare worker prompts

Read [references/worker-contract.md](references/worker-contract.md). Write one prompt file per workstream under a session-scoped directory inside the repository, such as `<repo-root>/.codex-grok/sessions/<session-id>/`. Do not place patch-created orchestration artifacts in `/tmp` or another path outside the child workspace. Include repo root, branch, plan path, assigned section, exclusive file ownership, current state, acceptance criteria, tests, safety limits, and the required report format.

Tell each worker that all current code and other worker output are untrusted until inspected. Tell it to modify only owned files and to stop rather than cross ownership boundaries. Require it to use file-editing tools for authored changes instead of shell redirection, heredocs, `tee`, `sed -i`, or scripted file writers. Require focused verification before it returns.

### 4. Delegate to Grok

Launch workers with:

```bash
scripts/run-grok-worker.sh <repo-root> <prompt-file> <result-json>
```

The wrapper pins `grok-4.5`, high effort, bounded headless execution, prompt-mandated verification, and no Grok subagents. The current Grok CLI rejects `--check` together with `--no-subagents`, so preserve `--no-subagents` and keep verification in the worker contract and wrapper rules. Launch independent workstreams concurrently through separate tool calls; do not use unmanaged background shell jobs. Run dependent workstreams sequentially.

Do not replace the layered boundary with a direct, unsandboxed Grok launch. Grok's `bypassPermissions` mode is permitted only when the worker process is running inside the launcher's pinned Codex `workspace-write` sandbox and the wrapper deny rules remain present. If the OS sandbox itself blocks a required path or external operation, pause and request the narrow approval instead of broadening the sandbox silently.

### 5. Verify

After every wave:

1. Read each worker report.
2. Inspect `git status`, the actual diff, and file ownership compliance.
3. Reject edits outside the worker's assignment; preserve unrelated user changes.
4. Run the project's real checks yourself.
5. Walk every plan item and spot-check the implementation at the relevant lines.
6. Exercise browser, device, database, or runtime behavior when the acceptance criteria depend on it.

Green typecheck alone is not completion.

### 6. Fix through fresh workers

For every confirmed defect or missing item, create a fresh Grok fixer prompt containing the precise file, observed evidence, expected behavior, ownership boundary, and focused verification command. Do not ask a worker to rediscover a finding Codex already knows.

Repeat implementation and verification until all plan items pass. After five failed fixer rounds for the same blocker, stop and report the evidence and required user/external decision.

### 7. Report

Report the workstreams completed, files changed, commands and runtime paths verified, worker findings rejected or corrected, and any remaining environment/provider/device setup. Do not commit or push unless the user separately requests shipping.

## Token discipline

Use targeted reads and diffs. Do not paste whole repositories into worker prompts. Preserve Sol's context for cross-workstream reasoning, acceptance decisions, and final verification.

---
name: fable-opus
description: Orchestrates large implementation plans by keeping the active agent focused on planning, delegation, and verification while isolated worker agents perform all code changes. Defaults to Fable 5 as orchestrator and Opus 4.8 as implementer, but honors any host, worker tool, or model explicitly selected by the user. Use for delegated implementation, parallel workstreams with disjoint ownership, orchestrator-worker pipelines, or requests to implement through Opus, Claude, Codex, Cursor, or another coding agent.
---

# Orchestrator delegates, workers implement

Keep the active agent's context focused on decomposition, cross-workstream judgment, and verification. Delegate implementation edits to isolated workers. `fable-opus` is the default pairing and historical shorthand, not a host lock.

## Agent selection

Resolve roles before planning:

1. Use any orchestrator, worker tool, CLI, or model explicitly named by the user.
2. Otherwise use compatible project or session configuration.
3. Otherwise default to Fable 5 at high effort for orchestration and Opus 4.8 at xhigh effort for code implementation.

For browser-driving or computer-use work, default the worker to high effort rather than xhigh. Map effort names to the closest supported setting without increasing cost or depth beyond the user's request.

Use the host's native isolated-worker or parallel-agent capability when it can select the requested model. Otherwise use the selected coding agent's authenticated non-interactive CLI in the repository. Claude Code, Codex, Cursor, and other Agent Skills clients may all host the orchestration.

Never silently replace a user-selected agent or model. If the named choice is unavailable, report the missing capability and stop. If only a default model is unavailable, declare the closest configured isolated worker before continuing.

## Role boundary

The orchestrator may inspect, plan, partition ownership, dispatch workers, run verification, and assess results. It must not write product implementation code while this delegated pipeline is active.

Workers may edit only their assigned files and run scoped verification. They must not commit, push, merge, publish, deploy, or mutate external production state unless separately authorized.

If no isolated-worker capability or compatible external agent CLI is available, stop and explain that the delegated workflow cannot preserve its role boundary. Do not quietly turn the orchestrator into the implementer.

## Workflow

### 1. Plan

Create a written plan in the repository unless the user supplied one. Include:

- numbered phases and bounded workstreams;
- exact files or narrow globs owned by each worker;
- shared contracts written in full;
- observable acceptance criteria and required verification;
- dependency order and safe parallel groups;
- files no worker may touch.

If two workstreams need the same file, sequence them. For large scopes, obtain the user's approval when the plan would materially determine product direction or external state.

### 2. Dispatch implementation workers

Launch independent workstreams concurrently through the host's managed worker capability. Run dependent work sequentially. Do not require a product-specific tool name such as `Agent`, `Task`, `Workflow`, or `spawn_agent`.

Every worker request must include:

1. repository root and current branch;
2. plan path and assigned sections;
3. exclusive file ownership and known parallel ownership;
4. current checkout state and existing user changes to preserve;
5. exact objective, contracts, and acceptance criteria;
6. scoped typecheck, test, build, or runtime verification;
7. prohibition on commits, pushes, deployments, secrets exposure, and destructive Git;
8. required report: status, files changed, verification output, and remaining blockers.

Implementation workers default to Opus 4.8 xhigh. A user may instead select Cursor Agent, Codex, Claude, Grok, or another coding worker. Apply the same prompt and ownership contract regardless of provider.

### 3. Verify

After each wave, the orchestrator must:

1. inspect repository status and the real diff;
2. verify file-ownership compliance;
3. run the project's actual checks;
4. walk every plan item and inspect targeted implementation evidence;
5. exercise browser, device, database, or runtime behavior when acceptance depends on it;
6. reject unsupported completion claims.

Green typecheck alone is not completion.

### 4. Fix through fresh workers

For each confirmed defect or missing item, dispatch a fresh worker using the selected implementer with:

- observed evidence;
- exact file or route;
- expected behavior;
- minimal allowed files;
- focused reproduction or verification.

Never make the orchestrator fix worker code directly. Continue until every applicable acceptance criterion passes or a genuine user/external blocker remains.

### 5. Report

Report the selected host, orchestrator model, worker tool/model, workstreams completed, files changed, exact verification results, rejected or corrected worker claims, and remaining environment/provider/device setup. Shipping remains a separate explicit step through the `ship` skill.

## Rules

- User-selected agents and models override all defaults.
- Defaults are Fable 5 high for orchestration and Opus 4.8 xhigh for implementation.
- No silent provider or model substitution.
- Preserve disjoint ownership for parallel work.
- Keep the orchestrator out of implementation edits.
- Do not require one invocation prefix, subagent API, or coding harness.

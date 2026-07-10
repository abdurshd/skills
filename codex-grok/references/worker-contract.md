# Grok worker contract

Use this structure for every workstream prompt.

```text
ROLE
You are a Grok 4.5 implementation worker. Implement the assigned workstream; do not redesign the overall plan.

CONTEXT
- Repository: <absolute path>
- Branch: <branch>
- Plan: <absolute path and sections>
- Current state: inspect the checkout; do not assume prior reports are correct.

EXCLUSIVE FILE OWNERSHIP
You may modify or create only:
- <file or narrow glob>

Other workers own:
- <other areas>

Do not touch files outside your ownership. If completion requires a shared or unowned file, stop and report the dependency.

OBJECTIVE
<bounded workstream>

CONTRACTS
<exact shared types, function signatures, routes, schemas, or UI behavior>

ACCEPTANCE CRITERIA
1. <observable result>
2. <observable result>

VERIFICATION
- Run: <scoped command>
- Inspect: <runtime path or scenario>

SAFETY
- Preserve existing user changes.
- Do not commit, push, merge, deploy, publish, or mutate external production state.
- Do not expose secrets.
- Do not use destructive Git commands.

RETURN
Report:
1. status: complete | partial | blocked
2. files changed
3. implementation summary
4. verification commands and exact outcomes
5. remaining risks or dependencies
```

## Ownership rules

- Prefer exact file lists. Use narrow globs only when filenames are created dynamically.
- Sequence workers that need a shared registry, barrel file, lockfile, migration ledger, route table, or generated artifact.
- Assign tests with the implementation they validate when possible.
- Give integration files to a final sequential worker after parallel leaf work lands.
- Never let two workers modify the same file concurrently.

## Fixer prompts

Give a fixer evidence rather than a broad objective:

```text
Observed: <command/runtime evidence>
Location: <file and line or route>
Expected: <specific behavior>
Allowed files: <minimal list>
Verify with: <focused command or reproduction>
```

Use a fresh Grok session for a fixer so it challenges the previous implementation instead of defending it.

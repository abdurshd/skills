# Research Notes

Verified locally against Claude Code 2.1.229 on August 20, 2026.

## Official / observed facts used in this skill

- Claude Code supports headless execution with `-p` / `--print`.
- Claude Code supports `--dangerously-skip-permissions`.
- Claude Code supports `--permission-mode bypassPermissions`.
- Claude Code supports `--model opus` as an alias for the latest Opus model.
- Claude Code supports `--agents <json>` for temporary custom agents.
- Claude Code supports piping input into `claude -p`, which lets this skill keep the detailed execution brief in a file/stdin instead of embedding the full brief directly in the visible command line.
- This skill intentionally calls the authenticated `claude` executable directly and never routes through another coding-agent harness.
- Claude Code 2.1.229 does not expose a `--max-turns` flag. The launcher's optional `--max-turns` input is therefore expressed as turn-budget guidance in the prompt rather than passed as an unsupported CLI option.

## Why this skill uses a detached shell wrapper

Claude Code does not expose a single built-in `--detach` flag for this workflow. This skill therefore launches Claude in the background with `nohup` and writes a run directory containing:

- `prompt.md`
- `agents.json`
- `launch.sh`
- `claude.log`
- `pid`
- `meta.txt`

That makes the run inspectable and resumable from Codex's side.

## Sources

- Anthropic Claude Code overview: https://docs.anthropic.com/en/docs/claude-code/overview
- Anthropic subagents: https://docs.anthropic.com/en/docs/claude-code/sub-agents
- Local CLI help on March 12, 2026:
  - `claude --help`
  - `claude agents --help`

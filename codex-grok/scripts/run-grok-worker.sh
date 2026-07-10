#!/usr/bin/env bash
set -euo pipefail

dry_run=false
if [[ "${1:-}" == "--dry-run" ]]; then
  dry_run=true
  shift
fi

if [[ "$#" -ne 3 ]]; then
  printf 'Usage: run-grok-worker.sh [--dry-run] <repo-root> <prompt-file> <result-json>\n' >&2
  exit 2
fi

repo_root="$1"
prompt_file="$2"
result_file="$3"

[[ -d "$repo_root" ]] || { printf 'Repository directory not found: %s\n' "$repo_root" >&2; exit 2; }
[[ -f "$prompt_file" ]] || { printf 'Prompt file not found: %s\n' "$prompt_file" >&2; exit 2; }
command -v grok >/dev/null 2>&1 || { printf 'Grok Build CLI is not installed\n' >&2; exit 2; }

mkdir -p "$(dirname "$result_file")"

args=(
  grok
  --cwd "$repo_root"
  --model grok-4.5
  --reasoning-effort high
  --prompt-file "$prompt_file"
  --output-format json
  --max-turns 80
  --no-subagents
  --no-memory
  --check
  --permission-mode acceptEdits
  --deny 'Bash(git push*)'
  --deny 'Bash(git commit*)'
  --deny 'Bash(git reset*)'
  --deny 'Bash(rm -rf*)'
)

if [[ "$dry_run" == true ]]; then
  printf 'Command:'
  printf ' %q' "${args[@]}"
  printf '\nResult: %s\n' "$result_file"
  exit 0
fi

"${args[@]}" >"$result_file"
printf 'Grok worker result: %s\n' "$result_file"

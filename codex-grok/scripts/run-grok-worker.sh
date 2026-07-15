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
  --rules 'Use file-editing tools for authored file changes. Do not write files through shell redirection, heredocs, tee, sed -i, or scripted writers. Complete the prompt-required verification before returning.'
  --permission-mode bypassPermissions
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

tmp_result="${result_file}.tmp.$$"
cleanup() {
  rm -f -- "$tmp_result"
}
trap cleanup EXIT HUP INT TERM

"${args[@]}" >"$tmp_result"
[[ -s "$tmp_result" ]] || { printf 'Grok worker returned an empty result\n' >&2; exit 1; }
if grep -Eq '"stopReason"[[:space:]]*:[[:space:]]*"Cancelled"' "$tmp_result"; then
  printf 'Grok worker was cancelled before completing the prompt\n' >&2
  exit 1
fi

mv -f -- "$tmp_result" "$result_file"
trap - EXIT HUP INT TERM
printf 'Grok worker result: %s\n' "$result_file"

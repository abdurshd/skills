#!/usr/bin/env bash
set -euo pipefail

dry_run=false
if [[ "${1:-}" == "--dry-run" ]]; then
  dry_run=true
  shift
fi

if [[ "$#" -ne 3 ]]; then
  printf 'Usage: launch-orchestrator.sh [--dry-run] <repo-root> <objective-file> <result-file>\n' >&2
  exit 2
fi

repo_root="$1"
objective_file="$2"
result_file="$3"
skill_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

[[ -d "$repo_root" ]] || { printf 'Repository directory not found: %s\n' "$repo_root" >&2; exit 2; }
[[ -f "$objective_file" ]] || { printf 'Objective file not found: %s\n' "$objective_file" >&2; exit 2; }
command -v codex >/dev/null 2>&1 || { printf 'Codex CLI is not installed\n' >&2; exit 2; }

mkdir -p "$(dirname "$result_file")"

prompt="You are already the active codex-grok orchestrator running as GPT-5.6 Sol at xhigh. Do not relaunch Codex. Read and follow $skill_root/SKILL.md. Execute the objective in $objective_file inside $repo_root. Delegate every implementation edit to Grok workers as required by the skill. Continue until verified or genuinely blocked."

args=(
  codex exec
  --model gpt-5.6-sol
  --config 'model_reasoning_effort="xhigh"'
  --sandbox workspace-write
  --cd "$repo_root"
  --output-last-message "$result_file"
  "$prompt"
)

if [[ "$dry_run" == true ]]; then
  printf 'Command:'
  printf ' %q' "${args[@]}"
  printf '\n'
  exit 0
fi

"${args[@]}"
printf 'Codex orchestrator result: %s\n' "$result_file"

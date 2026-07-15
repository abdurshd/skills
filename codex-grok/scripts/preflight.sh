#!/usr/bin/env bash
set -euo pipefail

offline=false
if [[ "${1:-}" == "--offline" ]]; then
  offline=true
fi

fail() {
  printf 'codex-grok preflight failed: %s\n' "$1" >&2
  exit 1
}

command -v codex >/dev/null 2>&1 || fail "Codex CLI is not installed"
command -v grok >/dev/null 2>&1 || fail "Grok Build CLI is not installed"

codex_version="$(codex --version 2>&1 | tail -n 1)"
grok_version="$(grok version 2>&1 | tail -n 1)"
codex_exec_help="$(codex exec --help 2>&1)"
grok_help="$(grok --help 2>&1)"

for required_flag in --sandbox --add-dir --ephemeral --output-last-message; do
  grep -q -- "$required_flag" <<<"$codex_exec_help" ||
    fail "Codex CLI does not support required option: $required_flag"
done

for required_flag in --cwd --model --reasoning-effort --prompt-file --output-format --max-turns --no-subagents --no-memory --rules --permission-mode --deny; do
  grep -q -- "$required_flag" <<<"$grok_help" ||
    fail "Grok Build CLI does not support required option: $required_flag"
done
grep -q -- 'bypassPermissions' <<<"$grok_help" ||
  fail "Grok Build CLI does not support the required bypassPermissions worker policy"

models_cache="${CODEX_HOME:-$HOME/.codex}/models_cache.json"
[[ -f "$models_cache" ]] || fail "Codex model cache is missing at $models_cache"
grep -q '"slug": "gpt-5.6-sol"' "$models_cache" || fail "gpt-5.6-sol is not in the Codex model cache"

model_block="$(sed -n '/"slug": "gpt-5.6-sol"/,/"shell_type"/p' "$models_cache")"
grep -q '"effort": "xhigh"' <<<"$model_block" || fail "gpt-5.6-sol does not advertise xhigh reasoning"

printf 'Codex: %s\n' "$codex_version"
printf 'Grok: %s\n' "$grok_version"
printf 'Orchestrator contract: gpt-5.6-sol / xhigh\n'
printf 'Worker contract: grok-4.5 / high\n'

if [[ "$offline" == true ]]; then
  printf 'Offline preflight passed; live Grok auth/model access was not checked.\n'
  exit 0
fi

models_output="$(grok models 2>&1 || true)"
if grep -qiE 'not authenticated|reauthentication required|no auth credentials|token expired' <<<"$models_output"; then
  fail "Grok authentication is unavailable; run: grok login --oauth"
fi
if grep -qiE 'failed to fetch models|settings fetch failed|could not resolve|failed to lookup address|network\(' <<<"$models_output"; then
  fail "Grok model discovery could not reach the Grok service; verify sandbox DNS/HTTPS access"
fi
available_models="$(sed -n '/^Available models:/,$p' <<<"$models_output")"
grep -Eq '^[[:space:]]*[*-]?[[:space:]]*grok-4\.5([[:space:](]|$)' <<<"$available_models" ||
  fail "grok-4.5 is not listed in the authenticated Grok account's available models"

printf 'Live preflight passed.\n'

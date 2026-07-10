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
grep -q 'grok-4.5' <<<"$models_output" || fail "grok-4.5 is not available to the authenticated Grok account"

printf 'Live preflight passed.\n'

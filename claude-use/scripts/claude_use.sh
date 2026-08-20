#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  claude_use.sh --cwd /abs/repo/path --prompt-file /abs/path/to/brief.md [options]

Options:
  --cwd PATH           Absolute working directory where Claude should run
  --prompt-file PATH   Markdown brief file that Claude will read from stdin
  --label NAME         Run label used in the output folder name
  --log-root PATH      Root directory for detached run artifacts
  --model NAME         Claude model alias or full model name (default: opus)
  --effort LEVEL       low|medium|high|max (default: high)
  --max-turns N        Optional turn-budget guidance included in the prompt
  --dry-run            Prepare artifacts and print the command without launching
  --help               Show this help
EOF
}

require_value() {
  local flag="$1"
  local value="${2:-}"
  if [[ -z "$value" ]]; then
    echo "Missing value for ${flag}" >&2
    exit 1
  fi
}

sanitize_label() {
  echo "$1" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9._-]+/-/g; s/^-+//; s/-+$//'
}

CWD=""
PROMPT_FILE=""
LABEL=""
MODEL="opus"
EFFORT="high"
MAX_TURNS=""
DRY_RUN=0
LOG_ROOT=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --cwd)
      require_value "$1" "${2:-}"
      CWD="$2"
      shift 2
      ;;
    --prompt-file)
      require_value "$1" "${2:-}"
      PROMPT_FILE="$2"
      shift 2
      ;;
    --label)
      require_value "$1" "${2:-}"
      LABEL="$2"
      shift 2
      ;;
    --log-root)
      require_value "$1" "${2:-}"
      LOG_ROOT="$2"
      shift 2
      ;;
    --model)
      require_value "$1" "${2:-}"
      MODEL="$2"
      shift 2
      ;;
    --effort)
      require_value "$1" "${2:-}"
      EFFORT="$2"
      shift 2
      ;;
    --max-turns)
      require_value "$1" "${2:-}"
      MAX_TURNS="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if [[ -z "$CWD" || -z "$PROMPT_FILE" ]]; then
  usage >&2
  exit 1
fi

if [[ ! -d "$CWD" ]]; then
  echo "Working directory does not exist: $CWD" >&2
  exit 1
fi

if [[ ! -f "$PROMPT_FILE" ]]; then
  echo "Prompt file does not exist: $PROMPT_FILE" >&2
  exit 1
fi

if ! command -v claude >/dev/null 2>&1; then
  echo "claude CLI is not installed or not on PATH" >&2
  exit 1
fi

if [[ -z "$LOG_ROOT" ]]; then
  LOG_ROOT="$CWD/.claude-use/runs"
fi

STAMP="$(date +%Y%m%d-%H%M%S)"
if [[ -z "$LABEL" ]]; then
  LABEL="claude-use"
fi

SAFE_LABEL="$(sanitize_label "$LABEL")"
RUN_DIR="$LOG_ROOT/${STAMP}-${SAFE_LABEL}"
mkdir -p "$RUN_DIR"

PROMPT_COPY="$RUN_DIR/prompt.md"
AGENTS_FILE="$RUN_DIR/agents.json"
LAUNCH_SCRIPT="$RUN_DIR/launch.sh"
LOG_FILE="$RUN_DIR/claude.log"
PID_FILE="$RUN_DIR/pid"
META_FILE="$RUN_DIR/meta.txt"

cp "$PROMPT_FILE" "$PROMPT_COPY"

cat > "$AGENTS_FILE" <<'JSON'
{
  "repo-explorer": {
    "description": "Map the repository, identify affected files, and isolate risks before editing.",
    "prompt": "You are a repository exploration specialist. Inspect the codebase, trace dependencies, identify the files most likely to matter, surface risks, and hand back a concise implementation map. Avoid code changes unless explicitly asked."
  },
  "implementer": {
    "description": "Own one concrete implementation stream with a clear write scope.",
    "prompt": "You are an implementation worker. Make code changes for one assigned workstream, keep edits tightly scoped, avoid reverting unrelated user changes, and report exactly what you changed and how you verified it."
  },
  "ui-director": {
    "description": "Drive layout, interaction, and visual quality decisions for frontend work.",
    "prompt": "You are a senior UI director. Make the final call on visual hierarchy, spacing, layout, motion, readability, and interaction polish while respecting the product's existing brand and component patterns. Prefer intentional, production-grade decisions over generic defaults."
  },
  "verifier": {
    "description": "Run validation, regression checks, and final consistency review.",
    "prompt": "You are a verification specialist. Run the required checks, inspect outputs for regressions, call out anything suspicious, and summarize what passed, what failed, and what still needs attention."
  }
}
JSON

QUERY="Read stdin as the full execution brief. Treat it as the complete instruction set. Decompose the work into parallel streams, use the provided custom agents aggressively when tasks are independent, implement the plan end to end, and finish with a concise summary of changes, verification, and residual risks."

cat > "$LAUNCH_SCRIPT" <<EOF
#!/usr/bin/env bash
set -euo pipefail
cd $(printf '%q' "$CWD")
AGENTS_JSON=\$(cat <<'__AGENTS__'
$(cat "$AGENTS_FILE")
__AGENTS__
)
QUERY=$(printf '%q' "$QUERY")
MODEL=$(printf '%q' "$MODEL")
EFFORT=$(printf '%q' "$EFFORT")
MAX_TURNS=$(printf '%q' "$MAX_TURNS")
if [[ -n "\$MAX_TURNS" ]]; then
  QUERY="\$QUERY Keep the implementation within approximately \$MAX_TURNS tool or agent turns."
fi
cmd=(claude -p "\$QUERY" --input-format text --model "\$MODEL" --effort "\$EFFORT")
cmd+=(--permission-mode bypassPermissions --agents "\$AGENTS_JSON" --dangerously-skip-permissions)
cat $(printf '%q' "$PROMPT_COPY") | "\${cmd[@]}"
EOF

chmod +x "$LAUNCH_SCRIPT"

cat > "$META_FILE" <<EOF
run_dir=$RUN_DIR
cwd=$CWD
prompt_file=$PROMPT_COPY
agents_file=$AGENTS_FILE
launch_script=$LAUNCH_SCRIPT
log_file=$LOG_FILE
model=$MODEL
effort=$EFFORT
max_turns=$MAX_TURNS
created_at=$(date -Iseconds)
EOF

if [[ "$DRY_RUN" -eq 1 ]]; then
  echo "Prepared detached Claude run."
  echo "run_dir=$RUN_DIR"
  echo "launch_script=$LAUNCH_SCRIPT"
  echo "log_file=$LOG_FILE"
  exit 0
fi

nohup "$LAUNCH_SCRIPT" >"$LOG_FILE" 2>&1 < /dev/null &
PID=$!
disown "$PID" 2>/dev/null || true
echo "$PID" > "$PID_FILE"

echo "Claude detached run started."
echo "pid=$PID"
echo "run_dir=$RUN_DIR"
echo "log_file=$LOG_FILE"

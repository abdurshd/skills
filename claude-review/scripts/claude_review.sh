#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  claude_review.sh --cwd /abs/repo/path --prompt-file /abs/path/to/review.md --mode plan|changes [options]

Options:
  --cwd PATH           Absolute working directory where Claude Code should run
  --prompt-file PATH   Markdown review brief file
  --mode MODE          Review mode: plan or changes
  --label NAME         Run label used in the output folder name
  --log-root PATH      Root directory for detached run artifacts
  --model NAME         Claude model alias or full model name (default: opus)
  --effort LEVEL       low|medium|high|xhigh|max (default: high)
  --max-turns N        Optional review-turn guidance included in the prompt
  --dry-run            Prepare artifacts and print locations without launching
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
MODE=""
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
    --mode)
      require_value "$1" "${2:-}"
      MODE="$2"
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

if [[ -z "$CWD" || -z "$PROMPT_FILE" || -z "$MODE" ]]; then
  usage >&2
  exit 1
fi

if [[ "$MODE" != "plan" && "$MODE" != "changes" ]]; then
  echo "Mode must be 'plan' or 'changes'" >&2
  exit 1
fi

case "$EFFORT" in
  low|medium|high|xhigh|max) ;;
  *)
    echo "Effort must be one of: low, medium, high, xhigh, max" >&2
    exit 1
    ;;
esac

if [[ ! -d "$CWD" ]]; then
  echo "Working directory does not exist: $CWD" >&2
  exit 1
fi

if [[ ! -f "$PROMPT_FILE" ]]; then
  echo "Prompt file does not exist: $PROMPT_FILE" >&2
  exit 1
fi

if ! command -v claude >/dev/null 2>&1; then
  echo "Claude Code CLI is not installed or not on PATH (expected: claude)" >&2
  exit 1
fi

if [[ -z "$LOG_ROOT" ]]; then
  LOG_ROOT="$CWD/.claude-review/runs"
fi

STAMP="$(date +%Y%m%d-%H%M%S)"
if [[ -z "$LABEL" ]]; then
  LABEL="claude-review-$MODE"
fi

SAFE_LABEL="$(sanitize_label "$LABEL")"
RUN_DIR="$LOG_ROOT/${STAMP}-${SAFE_LABEL}"
mkdir -p "$RUN_DIR"

PROMPT_COPY="$RUN_DIR/review-brief.md"
COMBINED_PROMPT="$RUN_DIR/combined-prompt.md"
AGENTS_FILE="$RUN_DIR/agents.json"
LAUNCH_SCRIPT="$RUN_DIR/launch.sh"
LOG_FILE="$RUN_DIR/claude.log"
PID_FILE="$RUN_DIR/pid"
META_FILE="$RUN_DIR/meta.txt"
GIT_STATUS_FILE="$RUN_DIR/git-status.txt"
DIFF_FILE="$RUN_DIR/working.diff"
STAGED_DIFF_FILE="$RUN_DIR/staged.diff"

cp "$PROMPT_FILE" "$PROMPT_COPY"

(
  cd "$CWD"
  git status --short > "$GIT_STATUS_FILE" 2>/dev/null || true
  if [[ "$MODE" == "changes" ]]; then
    git diff --no-ext-diff --submodule=diff > "$DIFF_FILE" 2>/dev/null || true
    git diff --cached --no-ext-diff --submodule=diff > "$STAGED_DIFF_FILE" 2>/dev/null || true
  fi
)

cat > "$AGENTS_FILE" <<'JSON'
{
  "repo-explorer": {
    "description": "Inspect the repository, trace dependencies, and surface hidden touchpoints.",
    "prompt": "You are a repository exploration specialist. Inspect the codebase, map dependencies, identify hidden touchpoints, and summarize the surrounding context needed for a critical review."
  },
  "plan-auditor": {
    "description": "Challenge implementation plans for feasibility, sequencing, and completeness.",
    "prompt": "You are a plan auditor. Stress-test proposed implementation plans against the actual codebase. Look for incorrect assumptions, missing workstreams, sequencing problems, missing migration paths, and weak validation."
  },
  "correctness-reviewer": {
    "description": "Review code changes for logic bugs, regressions, and mismatch with the task.",
    "prompt": "You are a correctness reviewer. Inspect the changed code and the surrounding implementation. Look for behavioral bugs, regressions, mismatch with the intended task, and brittle edge cases."
  },
  "security-reviewer": {
    "description": "Review for security, auth, validation, data exposure, and injection risks.",
    "prompt": "You are a security reviewer. Look for auth problems, input validation gaps, injection vectors, secret exposure, unsafe data handling, broken access control, and unsafe trust boundaries."
  },
  "validation-reviewer": {
    "description": "Review verification quality, tests, and operational confidence.",
    "prompt": "You are a validation reviewer. Look for missing tests, weak verification steps, unproven assumptions, and places where the code may pass superficially while still being wrong."
  }
}
JSON

if [[ "$MODE" == "plan" ]]; then
  MODE_PREAMBLE=$(cat <<EOF
# Claude Review Mode: Plan

Use the review brief below as the main assignment.

Additional local context:
- repository root: $CWD
- git status snapshot: $GIT_STATUS_FILE

Instructions:
- inspect the repository before judging the plan
- apply the repo-explorer, plan-auditor, and security-reviewer lenses early
- parallelize independent review lenses if subagent facilities are available
- do not make code changes
- return findings first, ordered by severity
- clearly state whether the plan is acceptable or needs revision

EOF
)
else
  MODE_PREAMBLE=$(cat <<EOF
# Claude Review Mode: Changes

Use the review brief below as the main assignment.

Additional local context:
- repository root: $CWD
- git status snapshot: $GIT_STATUS_FILE
- unstaged diff snapshot: $DIFF_FILE
- staged diff snapshot: $STAGED_DIFF_FILE

Instructions:
- review the current uncommitted workspace against the intended task
- inspect surrounding code, not just the raw diff
- apply correctness-reviewer, security-reviewer, and validation-reviewer as independent lenses
- parallelize independent review lenses if subagent facilities are available
- do not make code changes
- return findings first, ordered by severity
- explicitly say if no material findings were found

EOF
)
fi

{
  printf '%s\n' "$MODE_PREAMBLE"
  printf '\n'
  printf '%s\n' "# Review lenses"
  printf '%s\n' "Apply the following specialist lenses. If Claude Code can delegate them safely, run independent lenses in parallel; otherwise cover every lens directly."
  cat "$AGENTS_FILE"
  printf '\n\n'
  printf '%s\n' "# User review brief"
  cat "$PROMPT_COPY"
} > "$COMBINED_PROMPT"

QUERY="Perform a critical review of the complete brief below. Inspect the repository before reaching conclusions. Do not make code changes. Return findings first, ordered by severity, then provide a short verdict and any remaining uncertainty."

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
  QUERY="\$QUERY Keep the review within approximately \$MAX_TURNS tool or agent turns."
fi
REVIEW_BRIEF=\$(cat $(printf '%q' "$COMBINED_PROMPT"))
FULL_PROMPT="\$QUERY

\$REVIEW_BRIEF"
cmd=(claude -p "\$FULL_PROMPT" --input-format text --output-format text --model "\$MODEL" --effort "\$EFFORT" --permission-mode plan --agents "\$AGENTS_JSON")
"\${cmd[@]}"
EOF

chmod +x "$LAUNCH_SCRIPT"

cat > "$META_FILE" <<EOF
run_dir=$RUN_DIR
cwd=$CWD
mode=$MODE
prompt_file=$PROMPT_COPY
combined_prompt=$COMBINED_PROMPT
agents_file=$AGENTS_FILE
launch_script=$LAUNCH_SCRIPT
log_file=$LOG_FILE
git_status_file=$GIT_STATUS_FILE
working_diff_file=$DIFF_FILE
staged_diff_file=$STAGED_DIFF_FILE
model=$MODEL
effort=$EFFORT
max_turns=$MAX_TURNS
engine=claude-code
created_at=$(date -Iseconds)
EOF

if [[ "$DRY_RUN" -eq 1 ]]; then
  echo "Prepared detached Claude review run."
  echo "run_dir=$RUN_DIR"
  echo "launch_script=$LAUNCH_SCRIPT"
  echo "log_file=$LOG_FILE"
  echo "mode=$MODE"
  exit 0
fi

nohup "$LAUNCH_SCRIPT" >"$LOG_FILE" 2>&1 < /dev/null &
PID=$!
disown "$PID" 2>/dev/null || true
echo "$PID" > "$PID_FILE"

echo "Claude Code detached review started."
echo "pid=$PID"
echo "run_dir=$RUN_DIR"
echo "log_file=$LOG_FILE"
echo "mode=$MODE"

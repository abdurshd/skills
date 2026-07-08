# Claude Code skills — a cross-agent build pipeline

A small set of [Claude Code](https://claude.com/claude-code) skills for planning, implementing, reviewing, and shipping code with more than one model in the loop. Each skill is a folder with a `SKILL.md`; drop the folders into your skills directory and invoke them as slash commands.

## The skills

| Skill | What it does |
| --- | --- |
| **ship** | One consistent git ritual: survey the diff, clean gitignore, short commits with no AI attribution, then commit / push / migrate / merge / PR / address-review-comments depending on the mode. Ends by listing what still needs env/provider/device setup so "pushed" is never mistaken for "working". |
| **fable-opus** | Fable 5 plans and orchestrates; Opus 4.8 subagents do all the implementation (xhigh effort for code, high for browser tasks) with disjoint file ownership for safe parallelism; the orchestrator verifies every plan item and spawns fixer agents until it's done — without writing code itself. |
| **fable-opus-codex** | The full `fable-opus` pipeline plus a final Codex CLI review gate on the implemented diff. Codex findings are verified, then fixed by Opus agents (or rebutted if they're wrong / an intentional decision) and re-reviewed until `VERDICT: APPROVED`. |
| **codex-review** | Send an implementation *plan* to the Codex CLI for an iterative second-opinion review; revise and re-submit until Codex approves. `fable-opus-codex` reuses its mechanics for reviewing finished code. |
| **fix-findings** | Process a pasted findings list from an external reviewer the right way: verify each finding against the *current* code, fix the confirmed ones, rebut stale/intentional ones, and report per-finding outcomes. |
| **i18n-sweep** | Hunt both kinds of i18n gaps — catalog key drift across locales AND hardcoded user-facing strings that never became keys — then fill every gap with native-quality translations and verify. |

## How they chain

```
fable-opus-codex
├── fable-opus          plan → Opus subagents implement → orchestrator verifies
│   └── (loops fixer agents until every plan item passes)
├── codex-review        final Codex gate on the diff → fix/rebut → re-review until APPROVED
└── ship                commit / push / PR — a separate, explicit final step
```

Typical flow for a large feature: `/fable-opus-codex <plan or description>` to build + verify + get Codex sign-off, then `/ship pr` (or `/ship merge`) when you're happy with it.

## Install

Copy the skill folders into your Claude Code skills directory:

```bash
cp -r ship fable-opus fable-opus-codex codex-review fix-findings i18n-sweep ~/.claude/skills/
```

They then appear as `/ship`, `/fable-opus`, `/fable-opus-codex`, `/codex-review`, `/fix-findings`, and `/i18n-sweep`.

`ship`, `fix-findings`, and `i18n-sweep` are agent-agnostic — they also work in other agents that read the `SKILL.md` format (Codex: `~/.codex/skills/`, Cursor: `~/.cursor/skills/`, Antigravity: `~/.gemini/antigravity/skills/`). The `fable-opus*` skills are Claude Code-specific (they orchestrate Claude subagents).

## Requirements

- **fable-opus / fable-opus-codex**: a Claude Code setup with access to Fable 5 (orchestrator) and Opus 4.8 (implementer subagents). Run these from a Fable 5 session; switch with `/model` if needed.
- **codex-review / fable-opus-codex**: the OpenAI Codex CLI installed and authenticated — `npm install -g @openai/codex`.
- **ship**: `git`, and `gh` (the GitHub CLI) for the `pr` and `review` modes.

## Notes

These are generalized from a personal workflow. Model names (Fable 5, Opus 4.8, Codex/gpt-5.5) and effort levels are the defaults that worked well; adjust them in each `SKILL.md` to match the models you have access to.

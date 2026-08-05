# Portable agent skills for coding workflows

Reusable [Agent Skills](https://agentskills.io/) for implementation, review, design, video production, internationalization, and shipping. Each skill is a self-contained folder with a standard `SKILL.md` plus optional scripts and references.

The workflow belongs to the skill, not to the application hosting it. The same folder can run in Claude Code, Codex, Cursor, or another compatible coding agent when that client exposes the capabilities the workflow needs.

## Portability contract

Every portable skill follows these rules:

1. **Explicit user selection wins.** A tool, model, coding agent, or host named by the user overrides the defaults.
2. **Project/session configuration comes next.** Reuse an already configured reviewer or worker when the user did not choose one.
3. **Defaults fill only unspecified roles.** Names such as `codex-review`, `fable-review`, and `fable-opus` describe the default pairing, not a mandatory host.
4. **No silent substitution.** If an explicitly requested agent is unavailable, report the missing executable, authentication, model access, or harness capability.
5. **Capabilities, not product tool names.** Skills ask for files, shell, browser, isolated workers, or read-only review. Each host maps those capabilities to its native tools.

Host, role, provider, and model are separate choices. For example, Cursor can host `fable-opus` while Opus performs implementation, or Claude Code can host `codex-review` while Codex CLI performs the independent review.

## Skills

| Skill | Purpose | Defaults and portability |
| --- | --- | --- |
| **ship** | Survey, clean, commit, push, migrate, merge, open a PR, or address review comments without confusing “pushed” with “working.” | Fully harness-neutral; requires Git and optionally GitHub CLI. |
| **fable-opus** | Plan and supervise large work while isolated implementation workers own disjoint workstreams and the orchestrator verifies everything. | Defaults to Fable 5 orchestration and Claude Opus 5 through the runtime's latest `opus` model alias for implementation. Both roles and the host are replaceable. |
| **fable-opus-codex** | Run delegated implementation, then require an independent iterative code-review verdict before shipping. | Defaults to Fable 5 → Claude Opus 5 → Codex. Orchestrator, implementer, reviewer, models, and host are independently replaceable. |
| **codex-review** | Iteratively review and improve an implementation plan until approved or five rounds are reached. | Defaults to Codex CLI with GPT-5.6 Sol, high reasoning, and read-only access. Any read-only coding reviewer can replace it. |
| **fable-review** | Iteratively review and improve an implementation plan until approved or five rounds are reached. | Defaults to Claude Code with its latest Fable alias, high effort, and read-only access. Any read-only coding reviewer can replace it. |
| **codex-grok** | Run the hardened Codex/Grok implementation preset with a sandboxed orchestrator and bounded Grok workers. | Intentionally provider-specific because its safety wrapper validates exact CLI flags. Use `fable-opus` for arbitrary worker tools. |
| **fix-findings** | Verify every external-review claim against current code, fix confirmed defects, and rebut stale or intentional findings. | Fully harness-neutral. |
| **i18n-sweep** | Find catalog drift and hardcoded user-facing strings, fill every locale, and verify rendered behavior. | Fully harness-neutral. |
| **unslopify** | Remove generic AI-design tells through product-specific direction, rendered evidence, and bounded visual verification. | Harness-neutral; Impeccable detection is optional. |
| **genvid-onboard** | Produce truthful narrated onboarding and product-demo videos from verified UI and behavior. | Harness-neutral workflow; requires Remotion, a selected TTS provider, and its secret. |
| **genvid-promo** | Produce polished product-promotion videos from real UI, components, tokens, and verified claims. | Harness-neutral workflow; requires Remotion, a selected TTS provider, and its secret. |
| **genvid-tutor** | Produce complete narrated teaching videos with research, pedagogy, animation, captions, and rendered MP4 output. | Harness-neutral workflow; requires Remotion, a selected TTS provider, and its secret. |

## Multi-agent routing

The orchestration and review skills accept choices in ordinary language or the invocation syntax supported by the host.

Examples:

```text
Use fable-opus. Keep Fable as orchestrator, but use Cursor Agent workers.
Use fable-opus with Codex workers instead of Opus.
Run codex-review with Claude Opus as the reviewer.
Run fable-review from Cursor with Fable as the reviewer.
Run fable-opus-codex with implementer=opus and reviewer=codex.
```

Client-specific prefixes are optional conveniences:

```text
/fable-opus ...      # Claude Code or another slash-command client
$fable-opus ...      # Codex
```

The skills do not depend on either prefix. Automatic activation uses the same `name` and `description` in every Agent Skills client.

## How the delegated pipeline composes

```text
fable-opus-codex
├── implementation protocol
│   ├── orchestrator plans and partitions ownership
│   ├── selected workers implement disjoint workstreams
│   └── orchestrator verifies code, checks, and runtime behavior
├── independent review protocol
│   ├── selected read-only reviewer inspects the completed diff
│   └── verified findings return to fresh implementation workers
└── ship
    └── separate explicit commit, push, merge, or PR step
```

The current default pairing is Fable 5 → Claude Opus 5 → Codex. The `opus` alias keeps the implementation role on the latest Opus release. Replacing one role does not change the others unless the user asks.

## Install

The [Agent Skills client guidance](https://agentskills.io/client-implementation/adding-skills-support) recommends `.agents/skills/` as the cross-client location. Copy the complete folder, not only `SKILL.md`, so scripts and references remain available.

### Shared personal installation

```bash
mkdir -p ~/.agents/skills
cp -R ship fable-opus fable-opus-codex codex-review fable-review codex-grok \
  fix-findings i18n-sweep unslopify \
  genvid-onboard genvid-promo genvid-tutor \
  ~/.agents/skills/
```

### Client-specific personal installation

Use a client-specific directory when that client does not scan the shared path or when you want an isolated copy:

```bash
# Claude Code
mkdir -p ~/.claude/skills
cp -R unslopify ~/.claude/skills/

# Codex
mkdir -p ~/.codex/skills
cp -R unslopify ~/.codex/skills/

# Cursor
mkdir -p ~/.cursor/skills
cp -R unslopify ~/.cursor/skills/
```

For a repository-scoped installation, copy folders into `<project>/.agents/skills/` or the client's project-level skills directory. Project-local skills can be reviewed and versioned with the codebase.

Claude Code documents user and project discovery under [`.claude/skills/`](https://code.claude.com/docs/en/slash-commands). OpenAI Skills follow the same open standard and are transferable between supported products ([OpenAI documentation](https://help.openai.com/en/articles/20001066)). Cursor supports Agent Skills in its editor and CLI ([Cursor changelog](https://cursor.com/changelog/2-4)).

## Requirements by workflow

- **Portable core skills:** an Agent Skills-compatible client with the file, shell, browser, or Git capabilities required by the task.
- **Delegated implementation:** a host-native isolated-worker capability or an authenticated non-interactive coding-agent CLI.
- **Default `fable-opus`:** access to Fable 5 and the provider or harness's latest `opus` model alias. The alias currently resolves to Claude Opus 5 (`claude-opus-5`); user-selected alternatives replace the corresponding model requirement.
- **Default `codex-review`:** an installed and authenticated [OpenAI Codex CLI](https://github.com/openai/codex).
- **Default `fable-review`:** an installed and authenticated [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code/cli-usage) with access to its latest `fable` model alias.
- **Alternative review:** a selected reviewer replaces only the corresponding default tool and model requirement.
- **`codex-grok`:** Codex CLI, Grok Build CLI, GPT-5.6 Sol, and Grok 4.5 because its wrapper enforces provider-specific sandbox and permission flags.
- **Video skills:** Node.js, Remotion/FFmpeg dependencies, and a user-selected TTS provider plus secret environment variable.
- **GitHub operations:** [GitHub CLI](https://cli.github.com/) for PR and review-comment modes.

## Design notes

- Skill names remain stable for existing users and encode useful defaults.
- Model versions and effort levels are defaults, not hidden requirements, except where a provider-specific wrapper explicitly validates them.
- Product-specific metadata such as `agents/openai.yaml` is optional and may be ignored by other clients.
- A portable instruction cannot manufacture capabilities the host does not expose. When isolation, read-only enforcement, model access, or authentication is unavailable, the skill must report that boundary rather than pretending it ran the requested workflow.

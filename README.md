# Portable agent skills for coding workflows

[![skills.sh](https://skills.sh/b/abdurshd/skills)](https://skills.sh/abdurshd/skills)

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

## Current coding and reasoning models

Verified against the official provider catalogs on September 26, 2026. This list covers the general-purpose models relevant to these workflows; speech, image, and other specialized models are selected separately.

| Provider | Model | API model ID | Role |
| --- | --- | --- | --- |
| OpenAI | GPT-6 Astra | `gpt-6-astra` | Flagship reasoning, orchestration, and independent review |
| OpenAI | GPT-6 Sol | `gpt-6-sol` | Coding and agent workflows balancing capability and cost |
| OpenAI | GPT-6 Luna | `gpt-6-luna` | Focused tasks and high-volume work |
| Anthropic | Claude Fable 5.1 | `claude-fable-5-1` | Demanding reasoning and long-running orchestration |
| Anthropic | Claude Opus 5.5 | `claude-opus-5-5` | Implementation and independent review |
| Anthropic | Claude Sonnet 5 | `claude-sonnet-5` | Everyday coding and agent work |
| Anthropic | Claude Haiku 4.5 | `claude-haiku-4-5-20251001` | Simple tasks where speed and cost matter |

Sources: [OpenAI model catalog](https://developers.openai.com/api/docs/models), [Anthropic model catalog](https://platform.claude.com/docs/en/models/overview), and [Claude Code model configuration](https://code.claude.com/docs/en/model-config). Claude Mythos 5.1 is restricted to Project Glasswing participants and is not a default for these skills.

Claude Code requires v2.1.280 or later for Opus 5.5 and v2.1.257 or later for Fable 5.1. Alias resolution varies by provider, gateway, environment overrides, and CLI version. Confirm the resolved model; when an alias selects an older release, use the current full model ID or the provider's deployment ID. User-selected models and effort levels continue to override defaults.

## Skills

Choose a skill based on what you need next. These 15 skills cover planning, implementation, independent review, design, video creation, and delivery.

| Skill | When to use it | Defaults and portability |
| --- | --- | --- |
| **ship** | Use this when your changes are ready to commit, push, merge, or turn into a pull request. It checks the diff, keeps temporary files and secrets out of the commit, and reports what still needs verification after shipping. | Fully harness-neutral; requires Git and optionally GitHub CLI. |
| **fable-opus** | Use this when a large feature or refactor needs several focused implementation workers. One agent plans and supervises the work while isolated workers make changes, then the supervisor verifies the result. | Defaults to Fable 5.1 orchestration and Claude Opus 5.5 through the runtime's latest `opus` model alias for implementation. Both roles and the host are replaceable. |
| **fable-opus-codex** | Use this when you want delegated implementation followed by an independent code review before shipping. It separates planning, coding, and review, then sends confirmed findings back for fixes. | Defaults to Fable 5.1 → Claude Opus 5.5 → GPT-6 Astra through Codex CLI. Orchestrator, implementer, reviewer, models, and host are independently replaceable. |
| **codex-review** | Use this before coding when you want an OpenAI reviewer to challenge your implementation plan, especially if another provider's model helped write it. It checks the plan against the codebase and iterates on weaknesses for up to five rounds. | Defaults to Codex CLI with GPT-6 Astra, high reasoning, and read-only access. Any read-only coding reviewer can replace it. |
| **fable-review** | Use this before coding when you want a second opinion on your implementation plan from Claude Fable, especially if you planned with a non-Anthropic model. It stress-tests the approach against the codebase and helps refine it for up to five rounds. | Defaults to Claude Code with its latest Fable alias, high effort, and read-only access. Any read-only coding reviewer can replace it. |
| **claude-review** | Use this when you have a plan or uncommitted changes and want an independent Claude review, especially after working with a non-Anthropic model or agent. It runs Claude Code in read-only mode to look for correctness, security, and regression issues without changing your files. | Intentionally Claude Code-specific; defaults to `claude`, Opus, high effort, and read-only Plan permission mode. |
| **claude-use** | Use this when your plan is already agreed and you want Claude Code to handle the implementation while your current agent stays in charge. It gives the worker a detailed brief, keeps inspectable logs, and checks the delivered changes. | Intentionally Claude Code-specific; defaults to `claude`, Opus, high effort, and explicit implementation permissions. |
| **codex-grok** | Use this when you specifically want Codex to plan and verify while Grok writes the code. It uses a fixed two-model setup with safety checks and bounded worker tasks rather than a general-purpose agent pairing. | Intentionally provider-specific because its safety wrapper validates exact CLI flags. Use `fable-opus` for arbitrary worker tools. |
| **fix-findings** | Use this after receiving a review or audit report and you want to act on it without blindly accepting every claim. It verifies each finding against the current code, fixes confirmed defects, and explains stale, incorrect, or intentional behavior. | Fully harness-neutral. |
| **i18n-sweep** | Use this when your app mixes languages, has missing translations, or needs another locale. It finds hardcoded interface text and translation gaps, fills the supported locales, and checks the rendered result. | Fully harness-neutral. |
| **unslopify** | Use this when a website feels generic or obviously AI-generated and you want it to feel designed for your actual product. It removes decorative badges, standalone card icons, repetitive cards, and empty copy where appropriate, then verifies hierarchy, accessibility, and the rendered design. | Harness-neutral; Impeccable detection is optional. |
| **sidebar-x** | Use this when your dashboard's navigation changes shape between pages or makes settings, accounts, and organizations hard to find. It builds one consistent sidebar with clear submenus, pinned account and organization controls, permission-aware visibility, and mobile navigation. | Fully harness-neutral and framework-neutral; maps onto the host project's own design tokens. |
| **genvid-onboard** | Use this when people need a step-by-step video showing how to set up or use your product. It follows the real interface and workflow to create a narrated walkthrough with cursor actions, captions, and a finished MP4. | Harness-neutral workflow; requires Remotion, a selected TTS provider, and its secret. |
| **genvid-promo** | Use this when you need a launch video, feature teaser, or social promo for your product. It turns verified product screens and capabilities into an animated, narrated video without inventing features, testimonials, or metrics. | Harness-neutral workflow; requires Remotion, a selected TTS provider, and its secret. |
| **genvid-tutor** | Use this when you want to teach a topic through a complete video, not just generate a script. It researches the lesson, builds animated explanations and examples, and renders an MP4 with synchronized narration and captions. | Harness-neutral workflow; requires Remotion, a selected TTS provider, and its secret. |

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

The current default pairing is Fable 5.1 → Claude Opus 5.5 → GPT-6 Astra through Codex CLI. The `fable` and `opus` aliases keep the Anthropic roles on their latest matching releases. Replacing one role does not change the others unless the user asks.

## Install

All skills are published from this public GitHub repository and listed on the [skills.sh repository page](https://skills.sh/abdurshd/skills). The CLI downloads the complete selected folder, including its scripts and references.

### Skills CLI (recommended)

List every available skill without installing anything:

```bash
npx skills add abdurshd/skills --list
```

Install one skill globally for a selected agent:

```bash
npx skills add abdurshd/skills@unslopify --global --agent codex --yes
```

Install the complete collection globally for Codex and Claude Code:

```bash
npx skills add abdurshd/skills --skill '*' --global \
  --agent codex --agent claude-code --yes
```

Future updates use the source recorded by the CLI:

```bash
npx skills update --global
```

skills.sh automatically lists public GitHub skills after the Skills CLI records an installation from the repository. There is no separate npm package or store upload step.

### Manual installation

The [Agent Skills client guidance](https://agentskills.io/client-implementation/adding-skills-support) recommends `.agents/skills/` as the cross-client location. If the Skills CLI is unavailable, copy the complete folder—not only `SKILL.md`—so scripts and references remain available.

#### Shared personal installation

```bash
mkdir -p ~/.agents/skills
cp -R ship fable-opus fable-opus-codex codex-review fable-review \
  claude-review claude-use codex-grok \
  fix-findings i18n-sweep unslopify sidebar-x \
  genvid-onboard genvid-promo genvid-tutor \
  ~/.agents/skills/
```

#### Client-specific personal installation

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
- **Default `fable-opus`:** access to Fable 5.1 through the latest `fable` selector and the provider or harness's latest `opus` model alias. These currently resolve to Claude Fable 5.1 (`claude-fable-5-1`) and Claude Opus 5.5 (`claude-opus-5-5`); user-selected alternatives replace the corresponding model requirement.
- **Default `codex-review`:** an installed and authenticated [OpenAI Codex CLI](https://github.com/openai/codex).
- **Default `fable-review`:** an installed and authenticated [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code/cli-usage) with access to its latest `fable` model alias.
- **`claude-review`:** an installed and authenticated Claude Code CLI with Opus access; the launcher enforces read-only Plan permission mode and does not substitute another harness.
- **`claude-use`:** an installed and authenticated Claude Code CLI with Opus access; the launcher uses explicit bypass permissions for a previously approved implementation brief.
- **Alternative review:** a selected reviewer replaces only the corresponding default tool and model requirement.
- **`codex-grok`:** Codex CLI, Grok Build CLI, GPT-6 Astra, and Grok 4.5 because its wrapper enforces provider-specific sandbox and permission flags.
- **Video skills:** Node.js, Remotion/FFmpeg dependencies, and a user-selected TTS provider plus secret environment variable.
- **GitHub operations:** [GitHub CLI](https://cli.github.com/) for PR and review-comment modes.

## Design notes

- Skill names remain stable for existing users and encode useful defaults.
- Model versions and effort levels are defaults, not hidden requirements, except where a provider-specific wrapper explicitly validates them.
- Product-specific metadata such as `agents/openai.yaml` is optional and may be ignored by other clients.
- A portable instruction cannot manufacture capabilities the host does not expose. When isolation, read-only enforcement, model access, or authentication is unavailable, the skill must report that boundary rather than pretending it ran the requested workflow.

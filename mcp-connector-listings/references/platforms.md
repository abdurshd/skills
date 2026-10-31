# Platform playbook

Use the relevant section, not a mandatory tour of every platform. Official routes below were checked where noted on 2026-10-31; UI lessons dated 2026-10-27 are historical observations. Re-read current official instructions and authenticated forms before executing. Costs, eligibility, health rules, schemas, scopes, and store names can change.

## Official MCP Registry

- [Registry](https://registry.modelcontextprotocol.io/)
- [Publishing guide](https://github.com/modelcontextprotocol/registry/blob/main/docs/modelcontextprotocol-io/quickstart.mdx)
- [Manifest reference](https://github.com/modelcontextprotocol/registry/blob/main/docs/reference/server-json/generic-server-json.md)
- [Publisher CLI reference](https://github.com/modelcontextprotocol/registry/blob/main/docs/reference/cli/commands.md)

Choose remote-only metadata for an already hosted endpoint; package publishing is separate. Verify namespace control rather than assuming domain, endpoint, and GitHub ownership are interchangeable. Use the official publisher, inspect its installed help, validate the final manifest, authenticate the intended namespace, and publish the chosen version. Keep descriptions within current limits and omit private repository references. See the bundled remote example.

Verify the exact name/version and active status through the registry's current UI/API. Metadata publication neither deploys application code nor establishes downstream catalog inclusion. Inspect version rules before updating; do not repeatedly attempt to overwrite an immutable published version.

## Vercel Connect

- [Provider submission instructions](https://vercel.com/docs/connect/providers)
- [Public connector directory](https://vercel.com/connect/browse)

Use the team's **Connect → Browse Connectors → Submit a Service** route, not an unrelated hosting/deployment marketplace. Confirm team permission and reuse an existing draft. Supply service details, optional supported icon, targets, and connection methods.

For OAuth, follow discovery and the offered DCR/CIMD or manual-client path. Create the test connector, obtain the required token with authorized scopes, review, and submit. API-key configuration checks are a different validation level. Record the submission ID and method status.

Official instructions require the OAuth test connector and token to remain present when submission is verified. Do not revoke them as generic test cleanup. Re-test when material discovery or method configuration changes. A saved browser draft or token test is not submission; a receipt is not public publication.

## Docker MCP Catalog

- [Contribution guide](https://github.com/docker/mcp-registry/blob/main/CONTRIBUTING.md)
- [Catalog](https://hub.docker.com/mcp)

Use the current remote-server wizard/format for a hosted endpoint; do not apply container build/source requirements from the local-server route. The inspected remote format uses `servers/<slug>/server.yaml`, dynamic `tools.json` containing `[]`, and `readme.md` with a documentation link. These are submission assets, not disposable test outputs.

Read repository instructions and examples. Run current validation/catalog commands. Test Docker Toolkit authorization/discovery where available; OAuth working in another client does not establish Docker compatibility. State missing coverage plainly in the PR. Preserve the user's existing Docker catalog; do not run a global reset as routine cleanup.

Open the scoped metadata PR and retain its URL. Review, merge, catalog processing, and Toolkit availability are separate milestones. Do not publish customer credentials or private implementation code.

## Glama hosted connector directory

- [Connector directory](https://glama.ai/mcp/connectors)

Distinguish a hosted submission from a repository listing and an account's saved connection profiles. Search the endpoint/product and inspect ownership before creating another listing. Use the current hosted submission form; verify approval email/dashboard and the public page separately.

In the 2026-10-27 campaign, the public page appeared before its health test, and the admin test profile exposed OAuth discovery, authentication, and Test Connection. Health/search indexing was separate from publication. Recheck current indexing criteria. Never place a reusable API key in public configuration to make a health badge green. Inspect the exact OAuth recipient/scopes before granting persistent test access.

That campaign's docs link had `nofollow`; inspect each actual listing instead of advertising a guaranteed followed backlink. Account connection-profile counts did not represent submission-queue counts.

## Notion native integration Marketplace

- [Official listing guide](https://developers.notion.com/guides/get-started/marketplace-listing)
- [Developer portal](https://app.notion.com/developers/connections)
- [Marketplace connection dashboard](https://app.notion.com/profile/connections)

This lists a native Notion connection, not an arbitrary MCP. Current official eligibility requires a public connection installable in **Any workspace**. Confirm the live OAuth client ID/callback matches the registration in the owning account/workspace. Missing access in one account is not proof the app does not exist.

Prepare the separate publisher profile and listing: logo, tagline, accurate feature/category, description, real gallery images, setup instructions, working installation URL, developer contact, privacy/terms, and optional slug. Save, submit, then verify **Submitted / Awaiting approval** in the dashboard. Public availability follows review. Keep full-sync coverage distinct from receipt evidence.

2026-10-27 lesson: the wrong account led to an unused new registration. The actual owner's account exposed the original production integration; no credential deployment was needed. A complete listing also hit a publisher-profile gate before submission. Resolve these before replacing credentials or claiming submission succeeded.

## Claude connector directory

- [Directory](https://claude.ai/directory)

Use its current provider submission/management route and requirements. Check an existing listing, ownership, moderation tier, exposed tools, and relevant reviewer steps. Keep connector metadata, skills/plugin packages, and public discovery distinct; do not assume one automatically publishes the others.

Record Community, Verified, or the currently displayed tier without upgrading the claim. Inspect the public page and actual links; recommendation eligibility does not prove promotion or traffic. Preserve an existing review unless a necessary supported update warrants resubmission.

## OpenAI assistant app/plugin directory

- [Developer platform](https://platform.openai.com/)
- [Official developer documentation](https://developers.openai.com/)

Names and submission formats change. Inspect the current portal and official documentation for the actual app/package type rather than assuming a historical App Directory, plugin, custom GPT, or MCP declaration is equivalent.

Reuse the existing app ID, origin, version, business identity, domain verification, authorized MCP, and review submission where applicable. Prepare required tool definitions, reviewer access/test cases, media, legal links, and package assets using current requirements. Disclose only authorized reviewer credentials through the intended private channel. Let the owner attest to legal/business facts the agent cannot establish.

A tool marked for further review may be a moderation state, not a defect. Distinguish scans, submitted versions, approval, publisher action, and public discovery. Avoid generic wait-time or promotion promises.

## Secondary routes and exclusions

| Destination | Entry point | Decision rule |
| --- | --- | --- |
| GitHub / VS Code catalog | [GitHub MCP registry](https://github.com/mcp) | Inspect current curation/import rules. Official Registry publication alone does not establish appearance; redirected catalogs may be one distribution surface. |
| PulseMCP | [Submission page](https://www.pulsemcp.com/submit) | On 2026-10-27 submissions/changes were paused and the site pointed to the Official Registry. Recheck reopening; record upstream and downstream visibility independently. |
| Smithery | [Registry](https://smithery.ai/) | On 2026-10-27 publishing returned a removal/403 notice while the site announced an October 31 transition. Recheck the supported route; do not retry a removed API or assume the public catalog disappeared. Support outreach needs authorization. |
| MCP.so | [Submission page](https://mcp.so/submit?type=server) | A $39 flow was observed on 2026-10-27. Recheck free availability; never buy merely to finish a free campaign. |
| Other native marketplaces | Vendor's official developer portal | Require a shipped native use case and correct identity. A famous domain does not establish fit. |
| Search-engine URL submission | Search engine's official tool | Optional discovery for public docs, when requested. Record an indexing request, not a store listing, backlink, or guaranteed crawl. |

Do not expand a named-store task into all these routes. For a broad campaign, record rejected, paused, paid, duplicate, and externally pending destinations so the final counts stay honest.

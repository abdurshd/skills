---
name: mcp-connector-listings
description: "Research, prepare, submit, and verify MCP server and native integration listings in registries, assistant stores, and connector marketplaces. Use for MCP directory submissions, OAuth provider listings, Notion Marketplace integrations, or connector campaigns focused on discovery and backlinks. Not a general startup-directory campaign or standalone MCP implementation guide."
---

# MCP & Connector Listings

Carry requested listings through their actual submission boundary and verify the resulting state. A registered OAuth app, working connection, saved draft, review submission, and public listing are different outcomes. Report the one the evidence establishes.

Use the host's available source access, official documentation, authenticated browser, provider tools, and Git tools. Follow its browser, credential, approval, and repository rules. No particular browser extension, cloud, coding agent, or MCP provider is required.

## Choose the mode and route

- **Research:** deliver eligible destinations, current free/paid conditions, prerequisites, and evidence. Do not publish.
- **Prepare:** assemble copy, assets, metadata, and reviewable drafts within the requested scope.
- **Submit or resume:** finish authorized submissions, verify receipts and public pages, and preserve actionable pending items.
- **Check status:** inspect existing receipts, review feedback, health, and public availability before editing or resubmitting.

Read only the supporting material needed for the current destination:

- [Platform playbook](references/platforms.md): official registry, Vercel Connect, Docker, Glama, Notion, assistant stores, and secondary catalogs.
- [Identity, authentication, and verification](references/verification.md): account mismatches, OAuth tests, technical evidence levels, browser recovery, and backlink checks.
- [Campaign template](assets/campaign-template.md): copy into the product's existing research/artifact location and maintain it across sessions.
- [Remote manifest example](assets/server.remote.example.json): hosted MCP metadata; update the schema and example values against current official instructions before validation.

For a named store, work that store first. For a broad campaign, agree or infer a relevant bounded inventory, then give every included destination a disposition. General startup directories and unrelated integration development do not become prerequisites merely because they might improve reach.

## Recover the product and existing work

Read the current request, approvals, holds, repository instructions, Git status, and existing campaign record. Preserve unrelated changes. Verify the canonical website, live MCP endpoint, actual transport, authentication, public docs, support, privacy/terms, logos, and shipped use cases.

Search existing listings and account drafts before creating anything. For each destination, distinguish account, workspace/team, publishing identity, app registration, and listing. A product can have multiple registrations with the same display name.

For OAuth integrations, compare the **live authorization flow's client ID and callback** with the candidate registration before declaring production unconfigured or creating a replacement. Configuration code alone does not establish which values are live. If a registration is missing from one account, check authorized account/workspace alternatives; ask for the owning account only when evidence cannot resolve it. Let the owner complete private authentication challenges.

Do not replace working credentials, change the MCP origin, expose private source, or modify an unrelated integration to obtain a listing. If an unused duplicate was created, record it and stop using it; follow applicable approval rules before deleting registrations or revoking credentials.

## Classify eligibility before implementation

Identify what the destination actually accepts:

| Route | What is being listed | Evidence needed |
| --- | --- | --- |
| MCP metadata registry | Hosted endpoint or distributable MCP server | Namespace ownership, valid metadata, correct transport/package |
| Assistant connector/app store | Tools an assistant can call | Current app requirements, authentication, tool definitions, reviewer materials |
| OAuth provider directory | Service users authorize through the platform | Discovery/configuration and required real token test |
| Native integration marketplace | Real integration with that platform | Correct public registration, install flow, supported native behavior |
| Curated catalog / repository PR | Proposed catalog entry | Current contribution format, validation, review status |

An arbitrary MCP URL does not make a product eligible for Notion's native integration marketplace. If the required integration does not exist, explain the gap and prepare what is possible; do not start a large integration project or invent capability claims without scope to do so.

Read current official submission instructions and the actual form. Recheck prices, access, paused submissions, renamed stores, required scopes, dimensions, attestations, and review prerequisites. Treat the playbook's dated observations as leads, not current guarantees.

## Prepare a reusable submission pack

Prepare a factual name, short description, longer use-case copy, setup instructions, categories, docs, install URL, support, privacy/terms, current logo formats, and real product screenshots. Adapt these to each form's limits and audience.

Use an installation link that preserves required product/session context. A raw OAuth URL without a product's signed state or agent/workspace selection can fail even when it looks valid. Use the product's real connection entry point or documented setup deep link.

Inspect assets before upload. Crop out customer records, personal account navigation, balances, credentials, and private workspace contents. Show actual behavior; label mockups as mockups. Do not force one gallery's suggested dimensions onto every store.

Public remote metadata does not require publishing a private application's implementation unless that destination explicitly requires source. Prefer the remote-server route when it fits. Do not fabricate a public repository or point reviewers to a private one they cannot access.

## Execute within the existing authorization

A request to submit a named listing authorizes its ordinary publication steps. Reuse that instruction and prior concrete approvals; do not ask again just because a new session began. Follow the host's action-time confirmation rules for legal acceptance, new sensitive access, attestations, or other consequential actions. Skill invocation itself supplies no new permission.

Prepare independent work before asking for a missing final approval. Describe the exact recipient, company/workspace, scopes, credential retention, and purpose of a reviewer grant. Listing permission does not silently authorize broad customer-data access, outreach, paid purchases, or unrelated production releases.

For each destination:

1. Reopen the existing app/listing/draft and confirm identity and eligibility.
2. Fill supported fields, upload reviewed assets, and complete any required publisher profile using the approved business identity. Leave optional private facts blank.
3. Save and verify persistence with a safe navigation or reload. Resolve field errors and profile-completeness gates using the observed UI.
4. Run the destination's required validation/authentication checks. Record exactly what passed and what remains untested.
5. Submit when its actual requirements and authorization are satisfied. A missing optional end-to-end test is a disclosed limitation, not an invented platform blocker. Conversely, never claim a required test passed when it did not.
6. Inspect the receipt and review queue. Capture the listing/app ID, version, receipt, timestamp/timezone, status, and evidence path. Verify public availability separately.

After an uncertain Submit result, inspect the queue and receipts before retrying. Do not cancel a review, regenerate secrets, or resubmit an unchanged version merely to make progress appear visible. A review-required tool definition is not automatically an implementation bug.

For catalog PRs, change only required public metadata, run meaningful repository checks, and disclose client-specific tests not run. Follow current repository terms and host approval rules. Attach the PR to the chat when the host supports or requires it; a PR is not a merged/live listing.

If a genuine implementation/configuration gap blocks submission, prepare the smallest reviewable fix, identify the exact production target and validation/rollback, and use applicable release authorization. Do not deploy unrelated dirty work. Verify mutable cloud and secret references; a new secret version may not update a numerically pinned deployment.

## Verify, persist, and close the pass

Track independent dimensions rather than a misleading single “done” checkbox:

- Registration/configuration and the account that controls it.
- Saved draft and confirmed submission/review status.
- Public availability and correct outbound product/docs links.
- Authentication, tool discovery, safe operation, and provider health/indexing status.
- Rendered link attributes, crawl/index evidence, referrals, and measured SEO changes.

Use **unknown** or **not tested** where evidence is missing. Token retrieval does not prove a safe tool call; a public Glama page does not prove health/search indexing; an upstream registry entry does not prove every downstream catalog imported it.

Keep secrets, authorization codes, signed-state URLs, raw customer data, and private account details out of public artifacts and Git. Retain only non-secret identifiers and references to secure storage. Clean up temporary test files/data within authorized recovery/approval rules. Keep reviewer connectors/tokens the platform still requires for review; record their purpose and later cleanup dependency.

For backlink work, inspect the startup's actual rendered link and `rel` attributes. Separate a vendor promise or another listing's sample from the earned link. Record a dated baseline with scope and source; do not promise DR, rankings, indexing, or traffic. Search-engine URL submission is an indexing request, not an earned backlink.

End an execution pass only when every agreed destination is public or has an accurate disposition such as submitted/awaiting review, owner action needed, paused, paid-only, ineligible, or declined. Finish authorized independent work before handing back a blocker. Report public links, receipts, exact remaining actions, and the campaign record. Explicitly say **not submitted** when only a registration or draft exists. Create future monitoring only when requested.

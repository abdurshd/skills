# Identity, authentication, and evidence

## Establish the account-to-registration chain

Resolve these entities separately: browser login → publishing account → workspace/team → OAuth/app registration → production endpoint/configuration → listing → review submission/version.

Use the production connection entry point to observe its public client ID, callback origin/path, requested scopes, and recipient without granting access yet. Compare them to the developer dashboard. Client IDs are non-secret identifiers; never dump secrets or retain full signed-state/code URLs as evidence.

If an app is not visible, check legitimate account/workspace choices and owner evidence. An access-denied/not-found page is a boundary, not an invitation to probe private APIs. Ask the user to switch to the owning account when needed. Account changes can invalidate other tabs: refresh their identity before writing. Do not submit under a stale account or register another app simply because its display name is absent from one dashboard.

If replacement is necessary, review impact on existing grants, refresh behavior, callback routing, app IDs/origins, and review queues. Prepare the precise change before seeking missing authorization. Never refresh a client secret merely to reveal its value.

## Use graded technical evidence

| Check | Establishes | Does not establish |
| --- | --- | --- |
| Public docs/icon loads | Asset availability at that time | Authenticated MCP behavior |
| MCP request gets expected auth challenge | Authentication boundary reachable | Usable token or tool result |
| OAuth metadata/discovery loads | Declared endpoints/capabilities | Successful DCR, CIMD, refresh, or execution |
| Consent page opens | Launch and displayed recipient/scopes | Completed grant/token exchange |
| Token retrieved | That client's tested authorization exchange | Discovery, safe calls, all clients or tenants |
| Tools/resources enumerated | Authenticated discovery in that client | Correct results or safe customer-facing writes |
| Safe read/import works | Tested path and tenant/data scope | All operations, refresh, or long-term health |
| Provider health check passes | That provider's current test | Public indexing, ranking, SLA, or all clients |

Choose checks proportionate to requirements and claims. Validate with current official schemas/tools. Reuse applicable evidence while naming client-specific gaps. Do not require an application release for metadata-only changes or invent a mandatory successful page sync when the platform does not require one. Do not misrepresent untested behavior as working.

Inspect protected-resource and authorization-server discovery, transport, public/confidential-client expectations, callbacks, DCR/CIMD, PKCE, scopes, expiry, and refresh only as relevant to that client. Derive discovery URLs from current protocol/vendor instructions and observed challenges; do not guess every well-known path. A remote endpoint can be public in network reachability while requiring authorization.

Do not hardcode a tool count from an old snapshot. Record which client/version discovered tools and when. One crawler/user agent failing can be an edge restriction; compare meaningful client behavior before changing security protections.

## Reviewer access and test data

Use an authorized review tenant or least-sensitive data where available. Follow action-time confirmation rules for persistent sensitive access. Explain **who gets what access, to which company/workspace, for what test, and whether a token is retained**. Another directory's earlier grant does not approve this recipient's broad default scopes.

Prefer a harmless read to a write. For a knowledge importer, select a deliberately approved page/file, verify imported status/content, and record whether it affects a live agent. Do not grant a personal workspace or import unrelated notes for a screenshot. Create dummy content only when it materially helps a required check.

Store credentials only in the authorized secret mechanism. Redacted presence or non-secret client-ID checks usually suffice to diagnose configuration. Do not publish environment payloads, access/refresh tokens, codes, signed state, customer data, or reviewer passwords in source, PRs, screenshots, or the ledger.

Record cleanup and retention requirements. Remove temporary test artifacts under repository/host instructions; do not delete submission files such as Docker's dynamic `tools.json`. Keep required review connectors/tokens with a reason and later review point. Revocation and permanent deletion follow approval rules; a test label does not waive them. Do not reset shared catalogs, production databases, or account-wide settings to clean one test.

## Browser and upload recovery

Use the supported authenticated browser/API. Read current UI after actions, especially login, navigation, save, and submit. Re-inventory after closure or stale handles. Preserve handoff pages and receipt deliverables using supported lifecycle controls.

For uploads, inspect format/dimensions, register the chooser listener before the actual trigger, handle promise rejection, and await completion before another action. A timed-out chooser or native modal is not proof of upload. Inspect state, use the supported native picker when appropriate, then after bounded recovery ask for the exact file selection or required browser setting. Do not let an unhandled async rejection destroy the session.

For account switches or lost control, preserve prepared fields/ledger, identify the exact login/click needed, and continue independent preparation. Do not compete for user focus or repeat stale coordinates. After a submit timeout, inspect the queue, detail page, and narrowly relevant receipt email before retrying. Never email a directory's support without message authorization.

## Publication and SEO evidence

Use independent status fields; these are not a universal linear state machine:

| Dimension | Example values |
| --- | --- |
| Registration | Not needed / existing and matched / new / inaccessible |
| Submission | Not started / draft saved / submitted with receipt |
| Review | Unknown / awaiting approval / changes requested / approved / rejected |
| Availability | Private / public URL verified / dashboard published but public pending |
| Runtime | Not tested / consent launched / token verified / discovery passed / operation passed |
| Provider health | Not offered / not tested / failed / healthy |
| Discovery | Direct URL only / vendor search observed / engine index observed / unknown |
| Link | No link / rendered with attributes / crawler discovered / unknown |

Retain date/timezone, exact page/version/receipt, and non-secret proof for assertions. A success screenshot proves what it says; a saved-state reload confirms persistence. Public verification needs the actual non-admin URL with correct product/links. If unavailable, report that limitation.

For backlinks, inspect the rendered destination, `rel`, redirects, and reciprocal conditions. Missing `nofollow` is an observed attribute, not a ranking promise. Login-only profiles, registry API records, and crawlable editorial links differ. Do not count catalogs on one domain as separate referring domains or infer new links from an unchanged total.

When SEO tools are available, record provider, date, domain/subdomain scope, referring domains, followed breakdown, and baseline score. Measure discovery and referrals separately from score changes. Recheck [Ahrefs' DR explanation](https://ahrefs.com/seo/glossary/domain-rating) when explaining its metric; do not equate a provider score with Google's ranking system.

## Truthful handoff examples

- **Registered, not submitted:** “The OAuth registration exists. The form is saved, but Submit for review has not succeeded. Remaining: publisher profile and gallery image.”
- **Submitted, not public:** “Receipt and queue show Awaiting approval for this app ID. Public availability awaits review.”
- **Public, runtime pending:** “The listing is live. The provider shows Not tested; search inclusion is unverified.”
- **PR proposed:** “Metadata passed validation and the PR is open. Client-specific OAuth is untested; merge and rollout are pending.”

Do not describe these as fully published and verified across all stores. Stop repeated recovery when the same blocker persists and give the smallest concrete owner/external action; preserve completed work.

# Architecture modes

Pick one mode before designing anything. The mode decides which zones exist, what the switcher at the top of the working zone selects, and which pinned sections appear. Adding a zone the mode does not need is the most common way a sidebar becomes confusing.

## Shared skeleton

```
[Brand]
[Tenant switcher]            only when the operator belongs to more than one tenant
────────────────────────────
WORKING CONTEXT              scrolling zone
[context switcher or name]
  Menu
  Menu ▸
    Submenu entry
    Submenu entry
  ...
  Assistant / Search          one click from everywhere
  Settings ▸                  the context's own settings as a submenu
────────────────────────────  pinned zone, never scrolls away
▸ Section (disclosure)
▸ Section (disclosure)
[Account row]                 opens the account menu upward
```

## Mode 1: single-user

A personal tool, a desktop-style app, a solo dashboard. There is one tenant and it is the operator.

| Zone | Content |
| --- | --- |
| Working context | The product's pages as menus with submenus; Settings last. No switcher, show the product or workspace name as a static row. |
| Pinned | Account row only. Its menu holds profile, security, appearance, theme, sign out. |

Leave out: tenant switcher, Organization section, Platform section, "default context" logic (there is exactly one).

## Mode 2: single-tenant with administration

One company runs the product for its own users; some operators are administrators. There may be several projects or sites inside it.

| Zone | Content |
| --- | --- |
| Working context | If there is one project: the product's pages. If there are several: a project switcher, then the selected or default project's pages. Settings of the project last. |
| Pinned | **Administration** disclosure (users, roles, billing, audit, integrations, global settings), visible only to administrators. Account row. |

Leave out: tenant switcher, Platform section. The Administration section replaces both Organization and Platform because there is one tenant and its administration is the platform.

## Mode 3: multi-tenant, organization to application

A control plane where an organization owns several applications, projects or sites, and a separate operator role administers the platform itself.

| Zone | Content |
| --- | --- |
| Tenant switcher | Organization select, only when the operator belongs to more than one. |
| Working context | Application switcher (select with favicon), then the selected or default application's pages: Overview, feature menus with submenus, Assistant, Settings ▸ (general, keys, environments, modules, navigation, data, sharing, integrations). |
| Pinned | **Organization** disclosure (applications, members, credentials, tokens, plan and usage, jobs, audit, settings). **Platform** disclosure (organizations, users, worker health), platform admins only. Account row. |

Rules specific to this mode:

- On organization pages the application zone shows the last-opened application, remembered per organization, so leaving an application does not empty the rail.
- Organization settings and application settings are both called "Settings" but live in different zones, which is how the operator tells them apart; never pin both in the same place.
- Account and platform pages borrow the organization the operator was last inside so the rail keeps its zones; their breadcrumbs do not pretend to be under it.
- Nothing platform-level ever appears in the account menu when a Platform section exists.

## Choosing when it is unclear

- If a user can belong to more than one of something that owns the data, that something is the tenant: mode 3.
- If there is a user-management page but every user shares one data pool: mode 2.
- If the only administrative page is the operator's own settings: mode 1.

Products grow from 1 to 2 to 3. Design the registry so a mode upgrade adds a zone and a section rather than rewriting the tree: keep keys namespaced by zone (`app.`, `org.`, `platform.`) from the start.

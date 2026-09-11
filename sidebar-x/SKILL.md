---
name: sidebar-x
description: Designs and implements a console sidebar that stays the same shape on every page, with clear menus and submenus, a pinned bottom zone for organization, platform and account concerns, an application zone that is never empty, admin-controlled visibility, an icon rail and a mobile drawer. Use when a product's sidebar changes shape as people move between an application, its settings, the organization and the account, when a settings area opens its own sidebar, when operators cannot tell where they are, or when building the navigation of a new admin console, SaaS control plane or dashboard. Adapts to single-user tools, single-tenant apps with an admin, and multi-tenant organization-to-application products. Framework-neutral and stateless; maps onto the host project's own design tokens.
---

# Sidebar X

One sidebar, one shape, on every page. The operator should always be able to answer "where am I" and "how do I get back" without the rail rewriting itself. This skill turns that rule into a registry, a renderer and a verification pass that any project can adopt in its own framework and its own design tokens.

## Non-negotiables

- **One sidebar for the whole console.** No page, section or settings area gets a sidebar of its own. A settings area is a submenu of the thing it configures.
- **Two zones.** A scrolling top zone for the thing the operator works in (the application, project, workspace or site) and a pinned bottom zone for what surrounds it (organization, platform administration, account). The bottom zone never moves.
- **The top zone is never empty.** When no working context is selected, show a default one (last opened, else first) rather than a blank rail.
- **Menus and submenus look different.** A menu row has an icon; a submenu row is indented under a guide line and has none. One open menu at a time (accordion); the menu that contains the current page is always open.
- **Authorization is decided on the server, from one registry.** The renderer receives already-filtered entries and holds no permission logic.
- **Hiding is configuration, not deletion.** An administrator may hide any feature menu or submenu entry for everyone; the page stays reachable by URL and search, and the page the operator is on is never hidden.
- **Collapse means icon rail, not gone.** Full-width pages (editors, assistants) may drop the rail, but must leave a Back control.
- **No emoji, no decorative icons, no invented copy.** Labels are nouns the product already uses.

## Workflow

### 1. Classify the architecture

Read [references/architecture-modes.md](references/architecture-modes.md) and pick one of the three modes. The mode decides what goes in each zone and whether an application switcher, an organization section or a platform section exists at all.

| Mode | Working context (top zone) | Pinned zone |
| --- | --- | --- |
| Single-user | The product itself | Account only |
| Single-tenant with admin | The product, or its projects if there are several | Administration, Account |
| Multi-tenant (organization → application) | The selected or default application | Organization, Platform (admins only), Account |

Do not add a zone the mode does not call for. A single-user tool with an "Organization" disclosure is as confusing as a multi-tenant console without one.

### 2. Inventory the destinations

List every page the sidebar must reach, grouped by the noun it belongs to. For each page record: label, path, the permission that gates it, the feature or module that must be enabled, and whether it is a menu (a noun with sections) or a submenu entry (one section of that noun).

Rules of thumb:

- A menu gets a submenu only when the page really has sibling sections. Two pages under a noun is enough; one is not.
- Cap a submenu at nine entries. Anything beyond that belongs to in-page tabs, not the rail.
- The first submenu entry is the menu's own index page, so clicking the menu label and the first entry land on the same place.
- The last two menus in the top zone are the two destinations that must stay one click away from everywhere: typically an assistant or search, then Settings.
- Settings of the working context is a menu with a submenu; it never opens a different sidebar.

### 3. Write the registry

Follow [references/registry-contract.md](references/registry-contract.md). One file holds every entry; the shell renders from it and nothing else. Keys are stable strings (`app.analytics`, `app.analytics.funnels`, `org.members`), child keys are prefixed by their menu's key, and child paths are appended to the menu path.

Filtering happens in one server-side function per zone: permission, then enabled feature, then administrator-hidden. Children inherit the menu's permission and feature unless they name their own.

### 4. Decide the default working context

When the operator is outside any working context (organization pages, account, platform), the top zone shows:

1. the context they last opened, remembered in a cookie or user preference keyed by the tenant;
2. else the first one they can see;
3. else, only when they have none, a single entry that leads to where one is created.

The remembered value is a hint, never trusted: if it names a context the operator can no longer see, fall through to the fallback.

### 5. Render

Follow [references/anatomy-and-tokens.md](references/anatomy-and-tokens.md) for row anatomy, dimensions, states and the token mapping. The renderer needs exactly three pieces of state, all keyed to the current path so leaving a page resets them:

- which menu is open (default: the one containing the current page);
- which pinned sections are open (default: the one containing the current page);
- whether the rail is collapsed (a per-browser preference, not per page).

Everything else is derived from the registry and the current path by a `locate()` function that returns the deepest matching entry, its menu and its zone.

Breadcrumbs mirror the tree: Tenant › Context › Menu › Submenu. Drop levels the page is not inside. Account and platform pages are not under the tenant, so their trail starts at their own name.

### 6. Give administrators the switch

Provide one settings page, per working context, that mirrors the tree: one fieldset per feature menu, the menu's own switch first, its submenu entries indented under a guide line. Store only the hidden keys, only for features that are enabled, and never the entries of a menu that is itself hidden (the menu's absence already implies them, and recording them would keep them hidden after the menu returns). Audit the change.

### 7. Verify before reporting

Run the checks in [references/checklist.md](references/checklist.md). Every claim about the rail must come from a rendered page at desktop and mobile widths, not from reading the component. If no browser is available, say so and list the checks still owed.

## Load the right references

- [references/architecture-modes.md](references/architecture-modes.md): the three modes, what each zone contains, what to leave out.
- [references/registry-contract.md](references/registry-contract.md): entry shapes, filtering, hiding rules, `locate()`, default-context selection. Framework-neutral TypeScript you can transliterate.
- [references/anatomy-and-tokens.md](references/anatomy-and-tokens.md): row anatomy, spacing, states, collapse, drawer, and the semantic tokens to map onto the host's design system.
- [references/checklist.md](references/checklist.md): acceptance criteria and the browser walk.

## Harness-neutral execution

Resolve `<skill-root>` to the directory containing this `SKILL.md`. Use the agent's native file, search, edit and shell capabilities. Reuse the project's existing browser tooling for the verification walk before adding any dependency. This skill carries no scripts and keeps no state between runs: everything it needs is in the project's registry file and the current path.

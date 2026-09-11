# Verification checklist

Every item below is checked in a rendered browser at a desktop width (1440) and a phone width (375). A source-only review is reported as degraded with the list of checks still owed.

## Shape

- [ ] The rail has the same two zones on: the tenant home, a working-context page, a submenu page, the context's settings, a tenant administration page, the account page, and a platform page (when the mode has one).
- [ ] No page swaps in a different sidebar. Settings areas render as an open Settings submenu.
- [ ] The working zone shows a default context on pages outside any context; it is never blank.
- [ ] The pinned zone stays in place when the working zone scrolls.

## Menus and submenus

- [ ] A menu row has an icon and, with a submenu, a chevron button with `aria-expanded`.
- [ ] Submenu rows are indented under a guide line and have no icon.
- [ ] Opening one menu closes the others. The menu containing the current page is open on load.
- [ ] Clicking a menu label navigates to its page and opens it; the chevron only toggles.
- [ ] The current page's entry carries `aria-current="page"` and the accent style; its menu is emphasized without a background.
- [ ] The current entry is scrolled into view on load.

## Pinned zone

- [ ] Sections are closed by default, open automatically on a page inside them, and can be toggled.
- [ ] The Account row opens a menu upward with profile, security, sessions, appearance, theme and sign out, and nothing that lives elsewhere in the rail.
- [ ] On the account page only the Account row is highlighted.

## Authorization and configuration

- [ ] A viewer role does not see write-only destinations; a disabled feature removes its menu and submenu.
- [ ] Hiding an entry in the administrator's navigation settings removes it for another user of the same tenant, keeps its URL working, and keeps it in the command palette.
- [ ] Hiding a menu hides its submenu; re-enabling the menu brings the submenu back untouched.
- [ ] The page the operator is on is never hidden.
- [ ] The change is audited with the stored hidden keys.

## Collapse, drawer, focus

- [ ] Collapsed rail is the icon width, every link has a tooltip and an accessible name, the context favicon is visible at the top, pinned sections are single icons.
- [ ] `[` toggles the rail and is ignored while typing.
- [ ] At 375: drawer opens from the topbar button, traps focus, closes on Escape and on the scrim, and no horizontal page scroll exists.
- [ ] A full-width page hides the rail, shows Back, and the toggle reveals the rail for that page only.

## Trail and palette

- [ ] Breadcrumbs read Tenant › Context › Menu › Submenu on a submenu page and are not truncated at 1440.
- [ ] Account and platform trails do not start with the tenant.
- [ ] The command palette lists every reachable destination once, submenu entries as "Menu · Entry" and pinned entries as "Section · Entry".

## Code

- [ ] One registry file; keys stable and zone-prefixed; child keys prefixed by their menu.
- [ ] Every entry's path has a shipped page (a test that resolves each path to a route file catches drift).
- [ ] Filtering runs on the server; the renderer has no permission logic.
- [ ] The renderer keeps only three pieces of state, keyed to the current path.
- [ ] No color, radius, shadow or font is hard-coded in the rail; every one is a semantic token.

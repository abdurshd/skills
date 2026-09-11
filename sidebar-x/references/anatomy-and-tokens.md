# Anatomy and tokens

The rail is one raised card inset on the page ground. Everything inside it uses the host project's semantic tokens; the names below are the roles to map, not new values to introduce. If the project has no token for a role, add the token to the project's system rather than hard-coding a value in the rail.

## Token roles

| Role | Used for | Typical host token |
| --- | --- | --- |
| `rail.width` | expanded width | 224px (range 216–240) |
| `rail.width.collapsed` | icon rail | 56px |
| `rail.gap` | inset from the viewport and from the workspace | 8px |
| `rail.radius` | card corners | the project's card radius |
| `surface.primary` | rail background | card surface |
| `surface.secondary` | hover, switcher background | muted surface |
| `surface.accent-soft` | current entry background | soft accent |
| `text.primary` / `text.secondary` / `text.tertiary` | labels / idle rows / eyebrows and guide-line chevrons | body, secondary, tertiary text |
| `text.accent` | current entry label and icon | accent |
| `separator` | zone divider, submenu guide line | hairline |
| `focus-ring` | keyboard focus, `outline: 2px solid; outline-offset: 2px` | the project's focus ring |
| `shadow.raised` | the rail card | raised shadow |
| `shadow.panel` | the account menu | floating panel shadow |
| `font.body-medium` | menu labels | 13–14px medium |
| `font.caption-medium` | submenu and pinned-section entries | 12px medium |
| `font.caption-eyebrow` | zone and section eyebrows | 10–11px semibold, uppercase, 0.08em tracking |
| `duration.fast` / `ease` | chevron rotation, hover | the project's fast duration |

Light and dark themes come for free when every color above is a semantic token. Never branch on theme inside the rail.

## Rows

Menu row (working zone and pinned section entries):

```
[icon 16] [label ..................] [chevron 14, only with submenu]
height 34 (44 on touch), padding 0 10, radius rail.radius-sm, gap 10
idle: text.secondary; hover: surface.secondary + text.primary
current: surface.accent-soft + text.accent, label 600, icon stroke slightly heavier
menu containing the current page (submenu open): label text.primary 600, no background
```

Submenu row:

```
   |  [label ..................]
   indented 19 from the menu icon, guide line 1px separator on the left, 10 padding after it
   height 30 (40 on touch), font caption-medium, no icon
   current: surface.accent-soft + text.accent
```

The chevron is its own button (26×26, `aria-expanded`, `aria-controls`, label "Expand X" / "Collapse X"). The menu label is a link to the menu's own page. Clicking the label also opens the submenu; only the chevron closes it.

Pinned section head:

```
[icon 16] [EYEBROW small / Name strong] ............ [chevron]
height 36, same hover as a menu row, no current background: the entries inside carry it
open: chevron rotated 180°, entries listed as submenu rows with 15px icons
```

Account row (foot of the rail):

```
[avatar 32] [name strong / email small] [chevrons 13]
button, not a link; opens the account menu upward, anchored to the row
current on the account page: accent border and soft accent background
```

Account menu: profile header (avatar, name, email, current tenant chip), then Profile, Security or Passkeys, Sessions, Appearance, theme toggle, Sign out. Nothing that already has a place in the rail (no platform administration, no organization settings).

## Zones

- Working zone: `display: flex; flex-direction: column; overflow-y: auto; scrollbar-width: thin`. Head holds the eyebrow ("APPLICATION", "PROJECT") and the switcher (a select with the context's favicon as media) or a static row when there is only one context.
- Pinned zone: `flex: none`, separated by a 1px separator with 8px padding above.
- On path change, scroll the entry with `aria-current="page"` into view with `block: "nearest"` so a long tree never opens with the current page below the fold.

## Collapsed rail

- Width `rail.width.collapsed`; brand mark only; the context switcher becomes the context favicon (22px, accent-soft fallback with the initial) linking to the context's first page.
- Menu rows show the icon only, centered; the label stays in the DOM for the accessible name and is visually hidden; each link gets `title` for pointer users.
- Submenus are not rendered. Pinned sections become one icon each, linking to the section's first entry.
- The account menu opens to the right of the row instead of above it.
- Toggle with a topbar button and the `[` key (ignored while typing in an input). Persist per browser.

## Mobile drawer (≤ 820px)

- The rail becomes a drawer flush with the viewport edge, 300px or `100vw − 44px`, with a scrim, a close button, focus trapped inside, `role="dialog"`, and body scroll locked.
- Collapse and focus mode do not apply below this width.
- Row heights rise to 44 (menus) and 40 (submenus).

## Full-width pages (focus mode)

Editors and assistants may drop the rail. Decide it from the path with one pure function, leave a Back link in the topbar that returns to the list the editor came from, and let the rail be revealed per page without persisting that choice.

## Topbar

The topbar holds the rail toggle, the breadcrumb trail, the context selectors that change what a page shows (environment, date range belong to the page, not the topbar), search, and notifications. It does not hold the account avatar: the account lives at the foot of the rail. Give the trail column `minmax(0, 1fr)` and cap the search column so a four-level trail is not truncated at common desktop widths.

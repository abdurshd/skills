# Registry contract

One file holds every destination. The shell renders from it and from the current path; nothing else. The code below is framework-neutral TypeScript to transliterate, not a library to install.

## Entry shapes

```ts
type Permission = string;   // the project's frozen permission vocabulary
type Feature = string;      // module, plan feature or flag that must be enabled

type NavChild = {
  key: string;              // "<menu.key>.<segment>", e.g. "app.analytics.funnels"
  label: string;
  path: string;             // appended to the menu path; "" for the menu's index page
  permission?: Permission;  // defaults to the menu's permission
  feature?: Feature;        // only when it differs from the menu's feature
  keywords?: string[];      // for the command palette
};

type NavItem = {
  key: string;              // namespaced by zone: "app.", "org.", "platform."
  label: string;
  path: string;             // appended to the zone base
  icon: string;
  permission?: Permission;
  feature?: Feature;        // hidden when the feature is off
  keywords?: string[];
  children?: NavChild[];    // the submenu
};

export const APP_NAV: NavItem[];        // working-context zone, in render order
export const ORG_NAV: NavItem[];        // pinned Organization section (mode 3) or Administration (mode 2)
export const PLATFORM_NAV: NavItem[];   // pinned Platform section (mode 3)
```

Conventions:

- Keys are stable strings; renaming a label never changes a key, because hidden-entry configuration is stored by key.
- The first child of a menu has `path: ""` so the menu label and the first entry open the same page.
- Settings of the working context is a menu whose children are its settings sections. If those sections already exist as a list elsewhere, derive the children from that list rather than restating them.
- Keep a submenu at nine entries or fewer.

## Filtering (server side, once per request)

```ts
function visibleItems(items: NavItem[], permissions: string[], features: string[]): NavItem[] {
  return items.flatMap((item) => {
    if (item.permission && !permissions.includes(item.permission)) return [];
    if (item.feature && !features.includes(item.feature)) return [];
    if (!item.children) return [item];
    const children = item.children.filter((child) => {
      const permission = child.permission ?? item.permission;
      if (permission && !permissions.includes(permission)) return false;
      return !child.feature || features.includes(child.feature);
    });
    return [{ ...item, children }];
  });
}
```

The renderer receives the result of this function turned into hrefs. It never sees permissions or features.

## Administrator hiding

```ts
/** Every feature menu and every child of one. Overview and Settings are never hideable. */
export const HIDEABLE_KEYS: string[];
/** key -> feature, so the API can refuse to record a hidden entry whose feature is off. */
export const HIDEABLE_FEATURES: Map<string, Feature>;
/** The menu a key belongs to: itself for a menu, its parent for a child. */
export function parentKey(key: string): string;

/** Reads stored configuration defensively: unknown keys and malformed shapes are dropped, never trusted. */
export function hiddenKeys(settings: unknown): string[];
```

Storing, on save of the settings form (`show` is a repeated field listing every checked key):

```ts
const hidden = HIDEABLE_KEYS.filter((key) => {
  const feature = HIDEABLE_FEATURES.get(key);
  if (!feature || !enabledFeatures.includes(feature)) return false;   // off features are not recorded
  if (shown.includes(key)) return false;
  const parent = parentKey(key);
  return parent === key || shown.includes(parent);                      // children of a hidden menu are implied
});
```

Rendering: a hidden entry is omitted unless it, or one of its children, is the current page. There is no "More" overflow; hidden means hidden, and the command palette still lists everything the operator may open.

## Shell navigation object

Every layout builds the same object and hands it to the shell. This is what keeps the rail the same shape on every page.

```ts
type ShellNavItem = { key: string; label: string; href: string; icon: string; keywords?: string[]; hidden?: boolean; exact?: boolean; children?: ShellNavItem[] };

type ShellNavigation = {
  app?: { current: { id: string; slug: string; name: string; icon?: string | null }; isDefault: boolean; items: ShellNavItem[] };
  console?: { items: ShellNavItem[] };        // only for an operator with no working context at all
  organization?: { items: ShellNavItem[] };   // mode 2: administration; mode 3: organization
  platform?: { items: ShellNavItem[] };       // mode 3, platform admins only
};
```

`exact: true` marks an entry that is current only on its own path, which is needed for a tenant home whose path is a prefix of every other page.

## Default working context

```ts
function pickContext<T extends { slug: string }>(contexts: T[], remembered?: string | null): T | undefined {
  return (remembered && contexts.find((c) => c.slug === remembered)) || contexts[0];
}
```

The remembered slug lives in a cookie or user preference keyed by tenant (`ctx_<tenantId>`), written by the shell whenever it renders inside a context. Pages outside any tenant (account, platform) remember the last tenant the same way (`tenant`) and borrow it for the rail; the tenant context is resolved without redirecting, and a null result falls back to the `console` zone.

## locate()

```ts
function isActive(pathname: string, entry: ShellNavItem): boolean {
  if (entry.exact) return pathname === entry.href;
  return pathname === entry.href || pathname.startsWith(`${entry.href}/`);
}

/** The deepest entry containing the page; a child that shares its menu's href wins over the menu. */
function locate(navigation: ShellNavigation, pathname: string): { zone?: string; item?: ShellNavItem; child?: ShellNavItem } {
  let best = { length: -1 } as { length: number; zone?: string; item?: ShellNavItem; child?: ShellNavItem };
  for (const [zone, items] of Object.entries({ app: navigation.app?.items, console: navigation.console?.items, organization: navigation.organization?.items, platform: navigation.platform?.items })) {
    for (const item of items ?? []) {
      for (const [entry, child] of [[item, undefined], ...(item.children ?? []).map((c) => [c, c])] as Array<[ShellNavItem, ShellNavItem | undefined]>) {
        if (!isActive(pathname, entry)) continue;
        const length = entry.href.length + (child ? 1 : 0);
        if (length > best.length) best = { length, zone, item, child };
      }
    }
  }
  return { zone: best.zone, item: best.item, child: best.child };
}
```

From `locate()` derive: which menu is open by default, which pinned section is open by default, which entry carries `aria-current="page"`, and the breadcrumb trail.

## Command palette

Flatten the same object. A submenu entry is listed as "Menu · Entry" and a pinned entry as "Section · Entry", because short labels need their heading back in a flat list. Deduplicate by href: a menu and its index entry are one destination.

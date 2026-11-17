---
name: Sidebar
import: import { Sidebar } from '@wideset/react'
group: navigation
status: stable
parts:
  [
    Sidebar,
    SidebarHeader,
    SidebarFooter,
    SidebarSection,
    SidebarSectionHeader,
    SidebarExpanded,
    SidebarCollapsed,
    SidebarItem,
    SidebarTrigger,
  ]
related: [AppShell, Tabs, Breadcrumbs, Sidepanel]
docs: https://wideset.co/components/sidebar
storybook: components-sidebar--default
---

# Sidebar

> The app's primary navigation: a vertical rail of pages that collapses to icons.

## When to use

- The persistent left-hand navigation of an application shell, between product areas. Put it in
  an `AppShell`: the sidebar then takes the surface of the app's direction (white with a line,
  grey tint, or the bare grey frame) without any prop. `surface` overrides it.
- When the layout needs both a labelled view and a compact icon-only view.

## When not to use

- Switching sections inside one page → `Tabs`.
- Showing the position in a hierarchy → `Breadcrumbs`.
- A temporary panel of filters or details over the page → `Sidepanel`.
- A menu of actions on one element → `DropdownMenu`.

## Anatomy

```tsx
<Sidebar>
  <Sidebar.Header>
    <div className="gap-ws-7 py-ws-3 flex items-center">
      <Sidebar.Expanded>
        <span className="typography-label-strong-sm text-ws-static-strong pl-ws-5">Northwind</span>
      </Sidebar.Expanded>
      <Sidebar.Trigger />
    </div>
  </Sidebar.Header>
  <Sidebar.Section scrollable>
    <nav aria-label="Main" className="gap-ws-2 flex flex-col">
      <Sidebar.Item href="/" icon={RiDashboardLine} label="Dashboard" active />
      <Sidebar.Item href="/projects" icon={RiFolder3Line} label="Projects" />
      <Sidebar.SectionHeader>Products</Sidebar.SectionHeader>
      <Sidebar.Item href="/payments" icon={RiSecurePaymentLine} label="Payments" />
    </nav>
  </Sidebar.Section>
</Sidebar>
```

One tree serves both modes: `Sidebar.Item`, `Sidebar.SectionHeader` and `Sidebar.Trigger` adapt
on their own. `Sidebar.Expanded` and `Sidebar.Collapsed` wrap only what exists in one mode (the
product name, a promo card, an avatar in place of a profile row).

The root fills its parent's height; place it in a full-height flex row next to the page.

## Choosing props

| Prop               | Value                         | Use for                                                                                  |
| ------------------ | ----------------------------- | ---------------------------------------------------------------------------------------- |
| `defaultCollapsed` | boolean                       | Start collapsed, sidebar owns the state.                                                 |
| `collapsed`        | boolean + `onCollapsedChange` | You own the state (persisted preference, responsive rules).                              |
| `surface`          | `page`, `tinted`, `frame`     | Only outside an `AppShell`, or to override its direction.                                |
| `suffixOnHover`    | on `Sidebar.Item`             | A keyboard shortcut in `suffix`: shown on hover and keyboard focus only, its space kept. |
| `scrollable`       | on `Sidebar.Section`          | The one section that takes the remaining height and scrolls.                             |
| `icon` / `label`   | on `Sidebar.Item`             | Remix icon component and visible label; both, always.                                    |
| `active`           | on `Sidebar.Item`             | The current page; one per sidebar.                                                       |
| `disabled`         | on `Sidebar.Item`             | A page the user's plan or role does not include yet.                                     |
| `asChild`          | on `Sidebar.Item`             | Render as a router `Link`; icon and label are injected into it.                          |

## States

- Expanded / collapsed: the root carries `data-state="expanded" | "collapsed"`.
- Collapsed, everything sits on the rail's centre line: the header's trigger and mark, every item
  icon, the footer's avatar. Nothing in the rail is offset to make room for a scrollbar.
- Item active (`aria-current="page"`), hover, pressed, focus, disabled (`aria-disabled`, out of
  the tab order, click blocked).

## Content

- Labels are page names, one or two words, sentence case.
- Every item has an icon: collapsed mode shows nothing else.
- A count or badge on a row is its `suffix` (`suffix={3}`): it sits on the row's right edge,
  in line with every other suffix. Never position it yourself.
- What sits at the bottom (an invite button, the account switcher) goes in `Sidebar.Footer`, which
  keeps the sections' inset so its edges line up with theirs.
- A child page under an item (pages inside "Pages") is `nested`: indented so its icon starts under
  the parent's label, one level deep, with its own icon. The indent is the whole cue: never draw a
  guide line or add margins to build a tree.
- Section headers are one or two words; collapsed, the rail cuts them to their first letters
  ("P…"), so put the distinguishing word first.
- Everything on the right of the sidebar ends on one edge: suffixes, a section's "+", the
  arrows in the header and the footer. An absolutely placed button misses the edge.
- Every icon button in the sidebar is the same `IconButton size="xs"` (secondary, ghost), on the
  right edge above: the header's switcher arrow and a section's "+" then read as one family, with
  the same hover box. A bigger arrow beside a smaller "+" looks like two different controls.
- A keyboard shortcut (`⌘1`) is a hint: put it in `suffix` with `suffixOnHover`, so it shows on
  hover and keyboard focus and the column stays quiet. Counts and badges stay visible.
- A line across the sidebar (above the account, between groups): on `page` it may run edge to
  edge, where it meets the sidebar's own right line; on `frame` it keeps the nav's inset, because
  edge to edge it stops short of the page and reads as broken.
- Prefer hiding a page the user will never reach over showing it disabled.

## Accessibility

- Wrap items in a `<nav aria-label="…">`; the sidebar root is a plain `div`.
- Collapsed items fall back to `label` as `aria-label` when it is a string; pass `aria-label`
  when `label` is a node.
- Write the trigger and the items once, outside `Sidebar.Expanded` / `Sidebar.Collapsed`, so they
  keep focus when the sidebar toggles.
- `Sidebar.SectionHeader` keeps its text in both modes; give it an `id` and point the group's
  `aria-labelledby` at it.
- `Sidebar.Trigger` names itself ("Collapse sidebar" / "Expand sidebar", via `collapseLabel` /
  `expandLabel`) and sets `aria-expanded` / `aria-controls`.

## Do / Don't

```tsx
// Do: router link through asChild, no children besides the Link element
<Sidebar.Item asChild icon={RiFolder3Line} label="Projects" active={isProjects}>
  <Link to="/projects" />
</Sidebar.Item>

// Don't: children on a plain item (the type forbids it); use label
<Sidebar.Item href="/projects">Projects</Sidebar.Item>

// Do: a named group of items under a section header
<Sidebar.SectionHeader id="core-team">Core team</Sidebar.SectionHeader>
<div role="group" aria-labelledby="core-team" className="gap-ws-2 flex flex-col">
  <Sidebar.Item href="/issues" icon={RiStackLine} label="Issues" />
</div>

// Don't: a hand-made heading with its own icon; it falls out of line with the items
<div className="flex items-center gap-ws-3"><RiTeamLine /> Core team</div>

// Do: one level of children, indented by the item itself
<Sidebar.Item href="/pages/important" icon={RiFileTextLine} label="Important" nested />

// Don't: a hand-made tree with a guide line
<div className="ml-ws-9 border-l pl-ws-3"><Sidebar.Item … /></div>

// Do: a count on the row's edge
<Sidebar.Item href="/inbox" icon={RiInboxLine} label="Inbox" suffix={3} />

// Don't: an absolutely placed count over the row; it misses the shared right edge
<div className="relative"><Sidebar.Item … /><span className="absolute right-ws-5">3</span></div>

// Don't: the same navigation twice, once per mode (it remounts and drops focus on toggle)
<Sidebar.Section>
  <Sidebar.Expanded>{nav}</Sidebar.Expanded>
  <Sidebar.Collapsed>{nav}</Sidebar.Collapsed>
</Sidebar.Section>

// Do: one tree
<Sidebar.Section>{nav}</Sidebar.Section>

// Do: a section's one "+" ends the header row, a shortcut shows on hover
<div className="flex items-end">
  <Sidebar.SectionHeader id="shared" className="flex-1">Shared</Sidebar.SectionHeader>
  <IconButton size="xs" preset="ghost" variant="secondary" icon={RiAddLine} aria-label="Add a shared page" className="mr-ws-3" />
</div>
<div role="group" aria-labelledby="shared" className="gap-ws-2 flex flex-col">
  <Sidebar.Item href="/inbox" icon={RiInboxLine} label="Inbox" suffix="⌘1" suffixOnHover />
</div>

// Don't: a "+" laid over the header by hand; it lands off the suffixes' edge
<div className="relative">…<IconButton className="absolute right-ws-0 top-ws-0" … /></div>
```

## Gotchas

- A `Sidebar.Section` whose only children are `Sidebar.Expanded` / `Sidebar.Collapsed` renders
  nothing in a mode it has no content for; any other section stays in both modes.
- A `Sidebar.Trigger` inside `Sidebar.Expanded` or `Sidebar.Collapsed` unmounts on toggle and
  loses focus; keep one trigger outside them.
- A row action (a "…" menu) is a button and cannot sit in `suffix`: the row is a link. Lay it
  over the row's right edge as a sibling, at the suffix's inset.
- The item's `icon` takes a component (`icon={RiFolder3Line}`), not an element.
- `onCollapsedChange` fires in both modes; with `collapsed` set, nothing changes until you update it.
- `Sidebar.Trigger` with `asChild` merges the toggle onto your own button.
- Every part except `Sidebar.Header` throws outside `<Sidebar>`.
- Restyling the sidebar's fill or line through `className` fights the surface classes; set
  `AppShell direction` (or `surface`) instead.

## API

Full props: `https://wideset.co/components/sidebar.md` · Types:
`packages/design-system/src/components/sidebar/Sidebar.types.ts`

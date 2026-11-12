---
name: Sidebar
import: import { Sidebar } from '@wideset/react'
group: navigation
status: stable
parts:
  [
    Sidebar,
    SidebarHeader,
    SidebarSection,
    SidebarSectionHeader,
    SidebarExpanded,
    SidebarCollapsed,
    SidebarItem,
    SidebarTrigger,
  ]
related: [Tabs, Breadcrumbs, Sidepanel]
docs: https://wideset.co/components/sidebar
storybook: components-sidebar--default
---

# Sidebar

> The app's primary navigation: a vertical rail of pages that collapses to icons.

## When to use

- The persistent left-hand navigation of an application shell, between product areas.
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

| Prop               | Value                         | Use for                                                         |
| ------------------ | ----------------------------- | --------------------------------------------------------------- |
| `defaultCollapsed` | boolean                       | Start collapsed, sidebar owns the state.                        |
| `collapsed`        | boolean + `onCollapsedChange` | You own the state (persisted preference, responsive rules).     |
| `scrollable`       | on `Sidebar.Section`          | The one section that takes the remaining height and scrolls.    |
| `icon` / `label`   | on `Sidebar.Item`             | Remix icon component and visible label; both, always.           |
| `active`           | on `Sidebar.Item`             | The current page; one per sidebar.                              |
| `disabled`         | on `Sidebar.Item`             | A page the user's plan or role does not include yet.            |
| `asChild`          | on `Sidebar.Item`             | Render as a router `Link`; icon and label are injected into it. |

## States

- Expanded / collapsed: the root carries `data-state="expanded" | "collapsed"`.
- Item active (`aria-current="page"`), hover, pressed, focus, disabled (`aria-disabled`, out of
  the tab order, click blocked).

## Content

- Labels are page names, one or two words, sentence case.
- Every item has an icon: collapsed mode shows nothing else.
- Section headers are one or two words; collapsed they become a gap between groups.
- Prefer hiding a page the user will never reach over showing it disabled.

## Accessibility

- Wrap items in a `<nav aria-label="…">`; the sidebar root is a plain `div`.
- Collapsed items fall back to `label` as `aria-label` when it is a string; pass `aria-label`
  when `label` is a node.
- Write the trigger and the items once, outside `Sidebar.Expanded` / `Sidebar.Collapsed`, so they
  keep focus when the sidebar toggles.
- `Sidebar.SectionHeader` keeps its text for screen readers when collapsed; give it an `id` and
  point the group's `aria-labelledby` at it.
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

// Don't: the same navigation twice, once per mode (it remounts and drops focus on toggle)
<Sidebar.Section>
  <Sidebar.Expanded>{nav}</Sidebar.Expanded>
  <Sidebar.Collapsed>{nav}</Sidebar.Collapsed>
</Sidebar.Section>

// Do: one tree
<Sidebar.Section>{nav}</Sidebar.Section>
```

## Gotchas

- A `Sidebar.Section` whose only children are `Sidebar.Expanded` / `Sidebar.Collapsed` renders
  nothing in a mode it has no content for; any other section stays in both modes.
- A `Sidebar.Trigger` inside `Sidebar.Expanded` or `Sidebar.Collapsed` unmounts on toggle and
  loses focus; keep one trigger outside them.
- The item's `icon` takes a component (`icon={RiFolder3Line}`), not an element.
- `onCollapsedChange` fires in both modes; with `collapsed` set, nothing changes until you update it.
- `Sidebar.Trigger` with `asChild` merges the toggle onto your own button.
- Every part except `Sidebar.Header` throws outside `<Sidebar>`.

## API

Full props: `https://wideset.co/components/sidebar.md` · Types:
`packages/design-system/src/components/sidebar/Sidebar.types.ts`

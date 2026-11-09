---
name: Tabs
import: import { Tabs } from '@wideset/react'
group: navigation
status: stable
parts: [Tabs, TabsList, TabsItem, TabsIcon, TabsLabel, TabsCount, TabsContent]
related: [SegmentedControl, Sidebar, Breadcrumbs]
docs: https://wideset-docs.widelab.workers.dev/components/tabs
storybook: components-tabs--default
---

# Tabs

> Switch between named, sibling sections of one page without leaving it.

## When to use

- Content splits cleanly into peer groups (Overview / Members / Comments) and the user moves
  between them on the same page.
- A row of route-level sections inside a page, rendered as router links (`asChild` + `active`).

## When not to use

- Picking one value or view mode that changes the current content in place (list vs grid,
  a filter) → `SegmentedControl`.
- App-level navigation between areas of the product → `Sidebar`.
- Showing where the page sits in a hierarchy → `Breadcrumbs`.
- Steps that must be done in order → `ProgressStepper`.
- Sections the user reads one after another or expands several at once → `Accordion`.

## Anatomy

```tsx
<Tabs defaultValue="overview">
  <Tabs.List>
    <Tabs.Item value="overview">
      <Tabs.Icon icon={RiFileList3Line} /> {/* optional, before the label */}
      <Tabs.Label>Overview</Tabs.Label>
    </Tabs.Item>
    <Tabs.Item value="members">
      <Tabs.Label>Members</Tabs.Label>
      <Tabs.Count>8</Tabs.Count> {/* optional, after the label */}
    </Tabs.Item>
  </Tabs.List>
  <Tabs.Content value="overview">…</Tabs.Content>
  <Tabs.Content value="members">…</Tabs.Content>
</Tabs>
```

Every `Tabs.Item` needs a `value`; each `Tabs.Content` with the same `value` is its panel.
Named exports (`TabsList`, `TabsItem`, …) are the same parts for Server Components.

## Choosing props

| Prop       | Value                 | Use for                                                              |
| ---------- | --------------------- | -------------------------------------------------------------------- |
| `type`     | `regular` (default)   | Sections of a page; underline, tabs fit their labels.                |
|            | `fullWidth`           | Two to four tabs sharing the width of a narrow panel.                |
|            | `pills`               | A compact, filter-style switcher; the active tab is filled.          |
|            | `ghost`               | A quiet switcher inside a card or toolbar; no border.                |
| `size`     | `sm` (default) / `lg` | `sm` for panels and dense screens, `lg` for the top level of a page. |
| `divider`  | `true` (default)      | Line under the list, across the container. Not on `pills` / `ghost`. |
| `disabled` | on `Tabs` or one item | Root disables every tab; item disables only that tab.                |
| `active`   | on `Tabs.Item`        | Forces the active look when the item is a router link (`asChild`).   |

State: `value` + `onValueChange` (controlled) or `defaultValue` (uncontrolled), from Radix Tabs.

## States

- Active: set by `value` / `defaultValue`, or `active` on a link item. An active pill takes a
  neutral fill (`tertiary-alpha-strong-hover`, stronger than an unselected pill's hover), not the
  brand colour; pills have no outline.
- Disabled: dimmed and skipped by the keyboard. Keep a disabled tab only when the user can tell
  why it is unavailable.

## Content

- Labels are nouns, one or two words, sentence case: "Members", not "View members".
- Give every tab in a list an icon, or none.
- `Tabs.Count` is how many items wait behind the tab, not a status. It is read as part of the
  tab name.
- One `size` per screen.

## Accessibility

- Radix gives the `tablist` / `tab` / `tabpanel` roles and arrow-key navigation; use the parts,
  not plain buttons.
- `Tabs.Icon` is hidden from screen readers; the label names the tab. Do not ship icon-only tabs.

## Do / Don't

```tsx
// Do: router links keep the tab look through asChild + active
<Tabs.Item value="billing" asChild active={pathname === '/billing'}>
  <a href="/billing"><Tabs.Label>Billing</Tabs.Label></a>
</Tabs.Item>

// Don't: an icon passed as a bare child
<Tabs.Item value="x"><RiTeamLine /></Tabs.Item>
```

- Don't mix `size` or `type` between tab rows on one screen.
- Don't use `pills` for page sections; it reads as a filter.

## Gotchas

- `type` and `size` are set once on `Tabs`; items and list read them from context. There is no
  `type` on `Tabs.Item`.
- `divider={false}` has no effect on `pills` and `ghost`; they never draw it.
- With the divider, a `regular` list is full width so the line spans its container; the tabs
  stay left-aligned. To put tabs and an action in one row, set `divider={false}` and draw the
  line on the row.
- `Tabs.List`, `Tabs.Item` and `Tabs.Count` throw outside `<Tabs>`.
- Animations follow `MotionProvider`; set `defaultMotion={false}` on `Tabs` to turn them off here.

## API

Full props: `https://wideset-docs.widelab.workers.dev/components/tabs.md` · Types:
`packages/design-system/src/components/tabs/Tabs.types.ts`

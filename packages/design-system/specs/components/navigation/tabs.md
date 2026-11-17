---
name: Tabs
import: import { Tabs } from '@wideset/react'
group: navigation
status: stable
parts: [Tabs, TabsList, TabsItem, TabsIcon, TabsLabel, TabsCount, TabsContent]
related: [SegmentedControl, Sidebar, Breadcrumbs]
docs: https://wideset.co/components/tabs
storybook: components-tabs--default
---

# Tabs

> Switch between named, sibling sections of one page without leaving it.

## When to use

- Content splits cleanly into peer groups (Overview / Members / Comments) and the user moves
  between them on the same page.
- The same in-page panels with the open tab kept in the URL for deep linking: derive the root
  `value` from the URL and update it through `onValueChange`.

## When not to use

- Moving between separate pages or routes, where users need real links with middle-click and
  "open in new tab" support: use links inside a `<nav>` with `aria-current="page"`, not Tabs.
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
| `divider`  | `true` (default)      | Line under the list. Ignored by `pills` and `ghost`.                 |
| `disabled` | on `Tabs` or one item | Root disables every tab; item disables only that tab.                |

State: `value` + `onValueChange` (controlled) or `defaultValue` (uncontrolled), from Radix Tabs.

## States

- Active: set by the root `value` / `defaultValue`. For routing, derive `value` from the current URL.
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
import { Tabs } from '@wideset/react';
import { useLocation, useNavigate } from 'react-router-dom';

// Do: keep URL-driven selection and its content panels together.
function RoutingTabs() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const currentTab = pathname === '/billing' ? 'billing' : 'overview';

  return (
    <Tabs
      value={currentTab}
      onValueChange={(value) => {
        if (value !== currentTab) navigate('/' + value);
      }}
    >
      <Tabs.List>
        <Tabs.Item value="overview">
          <Tabs.Label>Overview</Tabs.Label>
        </Tabs.Item>
        <Tabs.Item value="billing">
          <Tabs.Label>Billing</Tabs.Label>
        </Tabs.Item>
      </Tabs.List>
      <Tabs.Content value="overview">Overview content</Tabs.Content>
      <Tabs.Content value="billing">Billing content</Tabs.Content>
    </Tabs>
  );
}

// Don't: an icon passed as a bare child
<Tabs.Item value="x">
  <RiTeamLine />
</Tabs.Item>;
```

- Don't mix `size` or `type` between tab rows on one screen.
- Don't use `pills` for page sections; it reads as a filter.

## Gotchas

- `type` and `size` are set once on `Tabs`; items and list read them from context. There is no
  `type` on `Tabs.Item`.
- `divider={false}` has no effect on `pills` and `ghost`; they never draw it.
- `Tabs.List`, `Tabs.Item` and `Tabs.Count` throw outside `<Tabs>`.
- Animations follow `MotionProvider`; set `defaultMotion={false}` on `Tabs` to turn them off here.

## API

Full props: `https://wideset.co/components/tabs.md` · Types:
`packages/design-system/src/components/tabs/Tabs.types.ts`

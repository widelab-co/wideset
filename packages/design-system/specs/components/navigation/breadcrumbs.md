---
name: Breadcrumbs
import: import { Breadcrumbs } from '@wideset/react'
group: navigation
status: stable
parts: [Breadcrumbs, BreadcrumbsItem, BreadcrumbsDivider]
related: [Tabs, Sidebar, LinkButton]
docs: https://wideset.co/components/breadcrumbs
storybook: components-breadcrumbs--default
---

# Breadcrumbs

> Show where the current page sits in a hierarchy and let the user step back up it.

## When to use

- Pages nested two or more levels deep (Projects › Wideset › Settings), above the page title.
- File and folder paths.

## When not to use

- Switching between sibling sections of the same page → `Tabs`.
- Primary app navigation → `Sidebar`.
- A single "back to …" link → `LinkButton`.
- Progress through ordered steps → `ProgressStepper`.

## Anatomy

```tsx
<Breadcrumbs separator="arrow">
  <Breadcrumbs.Item asChild>
    <a href="/">
      <RiHome5Line className="size-ws-9" />
      Home
    </a>
  </Breadcrumbs.Item>
  <Breadcrumbs.Item asChild>
    <a href="/projects">Projects</a>
  </Breadcrumbs.Item>
  <Breadcrumbs.Item>Wideset</Breadcrumbs.Item> {/* last = current page */}
</Breadcrumbs>
```

The root renders `<nav aria-label="Breadcrumb">` with an ordered list; each child becomes a list
item. Without `separator`, place `<Breadcrumbs.Divider separator="arrow" />` (or custom
children) between items yourself.

## Choosing props

| Prop        | Value                 | Use for                                                              |
| ----------- | --------------------- | -------------------------------------------------------------------- |
| `separator` | `arrow`               | The usual choice; reads as a path.                                   |
|             | `slash`               | Quieter; file and folder paths.                                      |
|             | omitted               | Only when you place `Breadcrumbs.Divider` yourself.                  |
| `asChild`   | on `Breadcrumbs.Item` | Render the crumb as your `<a>` or router `Link` instead of a button. |

## States

- Current page: the last item is marked `aria-current="page"`, removed from the tab order and
  loses hover and press styles automatically. Pass no prop for it.
- Hover, pressed and focus apply to every other item.

## Content

- Use the page titles as they appear on each page; short, sentence case.
- An icon only on the first item (the root), and always next to its label.
- The last item is the current page's title.

## Accessibility

- Navigating crumbs should be links: use `asChild` with `<a>` or a router `Link`. The default
  `<button>` is for in-app handlers that are not URLs.
- Dividers are hidden from screen readers, which hear a numbered list.
- If several `nav` landmarks share the page, override the default label with `aria-label`.

## Do / Don't

```tsx
// Do: one source of dividers
<Breadcrumbs separator="slash">…</Breadcrumbs>

// Don't: separator plus manual dividers draws two between every pair
<Breadcrumbs separator="arrow">
  <Breadcrumbs.Item>Projects</Breadcrumbs.Item>
  <Breadcrumbs.Divider separator="arrow" />
  <Breadcrumbs.Item>Wideset</Breadcrumbs.Item>
</Breadcrumbs>
```

- Don't set `aria-current` or `disabled` on the last item yourself.
- Don't put an icon on every crumb.

## Gotchas

- The last child is treated as the current page, whatever it is. Never end the list with a
  `Breadcrumbs.Divider`.
- `Breadcrumbs.Divider` with neither `separator` nor children renders nothing.
- With `asChild`, layout of the child's content (icon + text) is yours; the item styles still
  apply to the child.

## API

Full props: `https://wideset.co/components/breadcrumbs.md` · Types:
`packages/design-system/src/components/breadcrumbs/Breadcrumbs.types.ts`

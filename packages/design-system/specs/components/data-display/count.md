---
name: Count
import: import { Count } from '@wideset/react'
group: data-display
status: stable
parts: [Count]
related: [StatusBadge, Tag, Tabs]
docs: https://wideset-docs.widelab.workers.dev/components/count
storybook: components-count--default
---

# Count

> How many items sit behind a label: a tab, a list group, a section heading, a filter.

## When to use

- A list group or section title with its size: "Active 3", "Archived 12".
- A filter or a heading that tells the user how many results wait behind it.

## Contained or not

- **Not contained (default):** the quiet grey number, no border. Use it right after a text label
  ("Active 3", a tab, a heading): the label carries it. `Tabs.Count` always uses this look.
- **`contained`:** the same number in an outlined pill (24px tall). Use it where no text label
  comes before it: beside an icon (comments, attachments) or on its own at the end of a row.

## When not to use

- A count on a tab → `Tabs.Count` (it renders a `Count` and lines it up in the tab).
- A state (Paid, Overdue, Draft) → `StatusBadge`.
- A category (Design, Sales) → `Tag`.
- A result total for a whole list → plain text in a `role="status"` element (see
  [list and filters](../../patterns/list-and-filters.md)).

## Anatomy

```tsx
<h3 className="gap-ws-4 typography-label-strong-md text-ws-static-strong flex items-center">
  Active
  <Count>3</Count>
</h3>
```

One part, one size, two looks (`contained`). The quantity is its children.

## Content

- Digits only, no unit or noun: the label says what is counted.
- Cap long values (`99+`) so the label keeps its place.

## Accessibility

- Count is a `span` with no role: it is read in order with the label before it ("Active 3").
- Keep it next to a visible label. Next to an icon only, add the noun in visually hidden text
  (`<span className="sr-only">comments</span>`) and hide the icon (`aria-hidden`).
- A count that changes while the user watches is not announced; announce important changes in a
  `role="status"` element.

## Do / Don't

```tsx
// Do: the label and the count together
<h3 className="gap-ws-4 typography-label-strong-md text-ws-static-strong flex items-center">
  Archived
  <Count>99+</Count>
</h3>

// Do: contained beside an icon, the noun for screen readers
<RiChat3Line aria-hidden className="size-ws-9" />
<Count contained>12</Count>
<span className="sr-only">comments</span>

// Don't: a pill beside a text label
<h3>Active <Count contained>3</Count></h3>  // → <Count>3</Count>

// Don't: a status as a count
<Count>Overdue</Count>                       // → <StatusBadge color="negative">Overdue</StatusBadge>

// Don't: a count as a StatusBadge
<StatusBadge color="neutral">8</StatusBadge>  // → <Count>8</Count>
```

## Gotchas

- Inside `Tabs.Item` use `Tabs.Count`, not `Count`: it sets the digits 8px after the label in
  every tab type and size.
- `className` is for layout (a margin); the look is `contained` or not, nothing else.

## API

Full props: `https://wideset-docs.widelab.workers.dev/components/count.md` · Types:
`packages/design-system/src/components/count/Count.types.ts`

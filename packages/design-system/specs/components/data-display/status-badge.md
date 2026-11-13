---
name: StatusBadge
import: import { StatusBadge } from '@wideset/react'
group: data-display
status: stable
parts: [StatusBadge, StatusBadgeIcon, StatusBadgeLabel]
related: [Tag, Chip, InlineAlert, ProgressBar]
docs: https://wideset.co/components/status-badge
storybook: components-statusbadge--default
---

# StatusBadge

> A small, non-interactive label for the state of a record: done, failing, waiting, neutral.

## When to use

- The status of a row, card or page subject: Paid, Overdue, Draft, Scheduled.
- A short count or state next to a title (`lg` beside a page or card title).

## When not to use

- A category with no judgement (team, topic) → `Tag`.
- A label the user clicks, toggles or removes → `Chip`.
- A message the user must read or act on → `InlineAlert` / `SystemAlert`.
- Progress of a running task → `ProgressBar`.
- A count on a tab → `Tabs.Count`.

## Anatomy

```tsx
<StatusBadge color="positive">Paid</StatusBadge>

<StatusBadge color="positive">
  <StatusBadge.Icon icon={RiCheckboxCircleFill} />{/* before or after the label */}
  <StatusBadge.Label>Paid</StatusBadge.Label>
</StatusBadge>
```

Plain text needs no `Label`; wrap it in `StatusBadge.Label` whenever an icon sits beside it.
Named exports `StatusBadgeIcon`, `StatusBadgeLabel` are the same parts.

## Choosing props

| Prop       | Value                          | Use for                                                     |
| ---------- | ------------------------------ | ----------------------------------------------------------- |
| `color`    | `negative`                     | Failed, overdue, blocked.                                   |
|            | `notice`                       | Needs attention soon (Due soon, Expiring).                  |
|            | `positive`                     | Done, healthy, paid.                                        |
|            | `info`                         | Neutral news (Scheduled, New).                              |
|            | `neutral` (default)            | States with no judgement (Draft, Archived).                 |
| `emphasis` | `low` (default)                | Tables and lists where many badges sit together.            |
|            | `high`                         | The one status that must be seen (a failed payment up top). |
| `size`     | `md` (default) / `sm` / `lg`   | `sm` dense tables; `lg` beside a card or page title.        |
| `shape`    | `square` (default) / `rounded` | Square lines up with cells; rounded for counts on cards.    |

## Content

- One or two words, sentence case, a state: "Paid", "Due soon". Not a sentence, not a verb.
- The label states the status; colour backs it up.
- Use the same word and colour for the same state across the product.

## Accessibility

- StatusBadge is a `div` with text; not focusable, no live region. A status that changes while
  the user watches needs an announcement elsewhere (`Toast`, `InlineAlert`, a `role="status"` node).
- `StatusBadge.Icon` is hidden from screen readers. An icon-only badge needs `role="img"` and
  `aria-label` with the status.

## Do / Don't

```tsx
// Do: icon-only with a name
<StatusBadge color="positive" role="img" aria-label="Paid">
  <StatusBadge.Icon icon={RiCheckboxCircleFill} />
</StatusBadge>

// Don't: an icon next to bare text — spacing is wrong
<StatusBadge color="positive"><StatusBadge.Icon icon={RiCheckLine} />Paid</StatusBadge>
```

- Don't make every badge `high`; then none stands out.
- Don't use StatusBadge for categories, or `Tag` colours for statuses.

## Gotchas

- Values are `negative` / `notice` / `positive` / `info` / `neutral` — not `error`, `warning`,
  `success`. Other feedback components name their statuses differently; check each one.
- `StatusBadge.Icon` throws outside `<StatusBadge>`.
- `color` is the variant, not a CSS colour; there is no `variant` prop.

## API

Full props: `https://wideset.co/components/status-badge.md` · Types:
`packages/design-system/src/components/status-badge/StatusBadge.types.ts`

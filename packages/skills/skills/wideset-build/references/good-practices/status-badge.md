# StatusBadge

## When to use

- The status of a row, card or page subject: Paid, Overdue, Draft, Scheduled.
- A short count or state next to a title (`lg` beside a page or card title).

## When not to use

- A category with no judgement (team, topic) → `Tag`.
- A label the user clicks, toggles or removes → `Chip`.
- A message the user must read or act on → `InlineAlert` / `SystemAlert`.
- Progress of a running task → `ProgressBar`.
- A count on a tab → `Tabs.Count`.

## Do / Don't

```tsx
// Do: icon-only with a name
<StatusBadge color="positive" role="img" aria-label="Paid">
  <StatusBadge.Icon icon={RiCheckboxCircleFill} />
</StatusBadge>
```

- Don't make every badge `high`; then none stands out.
- Don't use StatusBadge for categories, or `Tag` colours for statuses.

## Gotchas

- Values are `negative` / `notice` / `positive` / `info` / `neutral` — not `error`, `warning`,
  `success`. Other feedback components name their statuses differently; check each one.
- `StatusBadge.Icon` throws outside `<StatusBadge>`.
- `color` is the variant, not a CSS colour; there is no `variant` prop.

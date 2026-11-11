# Tag

## When to use

- Categories, teams, topics, projects on a record, in a table cell or on a card.
- A fixed set of labels where each label keeps one colour everywhere.

## When not to use

- A state with a judgement (Paid, Overdue, Failed) → `StatusBadge`.
- A label the user clicks, toggles or removes (filters, selected values) → `Chip`.
- A person → `Avatar`.
- A count → `Count` (`Tabs.Count` on a tab).

See `README.md` in this folder for Tag vs StatusBadge vs Chip.

## Do / Don't

```tsx
// Do: icon-only with a hidden name
<Tag iconOnly>
  <Tag.Icon icon={RiFlashlightFill} />
  <span className="sr-only">Quick win</span>
</Tag>

// Don't: a status as a Tag
<Tag color="green">Paid</Tag>                 // → <StatusBadge color="positive">Paid</StatusBadge>

// Don't: an onClick on a Tag
<Tag onClick={removeFilter}>Design</Tag>      // → Chip
```

- Don't mix `filled` and `border`, or `square` and `rounded`, in one list.

## Gotchas

- `Tag.Icon` takes the component (`icon={RiCodeLine}`), not an element.
- `Tag.Icon` throws outside `<Tag>`; it reads `size` and `color` from it.
- Without `truncate` the label never wraps (`nowrap`) and can overflow a narrow cell.
- `color` is omitted from the HTML attributes; it is the variant, not a CSS colour.

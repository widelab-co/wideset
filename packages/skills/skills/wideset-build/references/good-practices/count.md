# Count

## When to use

- A list group or section title with its size: "Active 3", "Archived 12".
- A filter or a heading that tells the user how many results wait behind it.

## When not to use

- A count on a tab → `Tabs.Count` (it renders a `Count` and lines it up in the tab).
- A state (Paid, Overdue, Draft) → `StatusBadge`.
- A category (Design, Sales) → `Tag`.
- A result total for a whole list → plain text in a `role="status"` element (see
  [list and filters](../specs/patterns/list-and-filters.md)).

## Do / Don't

```tsx
// Do: the label and the count together
<h3 className="gap-ws-4 typography-label-strong-md text-ws-static-strong flex items-center">
  Archived
  <Count>99+</Count>
</h3>

// Don't: a status as a count
<Count>Overdue</Count>                       // → <StatusBadge color="negative">Overdue</StatusBadge>

// Don't: a count as a StatusBadge
<StatusBadge color="neutral">8</StatusBadge>  // → <Count>8</Count>
```

## Gotchas

- Inside `Tabs.Item` use `Tabs.Count`, not `Count`: it adds the offset the tab layout needs.
- `className` is for layout (a margin); the look is fixed.

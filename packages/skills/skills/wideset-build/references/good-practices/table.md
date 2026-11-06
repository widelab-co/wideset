# Table

## When to use

- Each item has two or more attributes the user compares (customer, due date, amount, status).
- Users sort, select rows, or open a row to see its detail.
- Summary rows (totals) under the data.

## When not to use

- One line per item with an icon and a short description, inside a menu or a panel → `ListItem`.
- A handful of entry points to other pages or actions → `ActionTile`.
- Picking one or several options from cards → `Tile` (`TileRadioGroup`, `TileCheckbox`).
- Key/value detail of a single record → plain layout (`dl` with `typography-*` classes) inside
  `Card` or `Sidepanel`.

## Do / Don't

```tsx
// Do: column widths on headers + table-fixed, then truncate clips
<Table truncate className="table-fixed">
  <Table.Head>
    <Table.Row>
      <Table.Header className="w-[40%]">Project</Table.Header>
      …

// Don't: truncate on an auto-layout table — the column widens instead of clipping
<Table truncate>…</Table>

// Do: sticky header inside a height-limited ScrollArea
<ScrollArea className="max-h-[24rem]">
  <Table stickyHeader>…</Table>
</ScrollArea>
```

- Don't add `striped` and `separated` to a short table; row lines are enough.
- Don't build a status pill from a styled `span` in a cell; use `StatusBadge`.
- Don't put `typography-*` on the text in a cell: the table sets the type for its size, and a
  two-line cell is the label plus `Table.CellDescription`.

```tsx
// Do
<Table.Cell>
  Offline sync
  <Table.CellDescription>Edits made offline merge on reconnect.</Table.CellDescription>
</Table.Cell>

// Don't: a bigger label and a hand-made second line
<Table.Cell>
  <div className="typography-label-md">Offline sync</div>
  <div className="typography-caption-md">Edits made offline merge on reconnect.</div>
</Table.Cell>
```

## Gotchas

- `size` sets minimum row height; rows grow when content wraps. Use `truncate`, not a fixed height.
- `truncate` only clips with constrained widths: `table-fixed` on `Table` plus `w-*` on
  `Table.Header`, or `max-w-*` on the cell. The full text is in the `title` attribute.
- Sticky header / column need a scroll container: a `ScrollArea` with a max height, or
  `orientation="horizontal"` (`both` for both) with a width limit. They set `hasBackground` for you.
- Sorting, selection and pagination are your state; Table renders, it does not sort or slice data.
  Large data sets: paginate with `Pagination` or virtualize at the data layer.
- `sortable` without `onSort` renders a sort button that does nothing.
- `Table.Head`, `Table.Row`, `Table.Header` and `Table.Cell` throw outside `<Table>`.

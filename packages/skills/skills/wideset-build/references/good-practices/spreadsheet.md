# Spreadsheet

## When to use

- A heavy, spreadsheet-like screen: records with many attributes, compared across rows and down columns, more than fit the viewport.
- The user moves cell by cell (arrow keys, a selected cell), not row by row.
- The header and the leading columns must stay in view while the grid scrolls both ways.

## When not to use

- Records read and acted on a row at a time (open, select, sort a list) → `Table`.
- Fewer than about six columns, or rows that need two lines of text or full-size buttons →
  `Table` (`md` / `lg`).
- One line per item with an icon and a description → `ListItem`.
- Key/value detail of a single record → plain layout inside `Card` or `Sidepanel`.

## Do / Don't

```tsx
// Do: widths on the header cells; the column without one takes the rest of the row
<Spreadsheet.ColumnHeader className="w-[9.5rem]">Client name</Spreadsheet.ColumnHeader>

// Don't: a coloured span as a status; use StatusBadge
<Spreadsheet.Cell>
  <span className="text-ws-semantic-negative">2 issues</span>
</Spreadsheet.Cell>
```

- Don't nest a `Table` or a second `Spreadsheet` in a cell.
- Don't put more than one control in a cell; split it into two columns.

## Gotchas

- Editing is yours: on Enter, F2 or a double click render an input in the cell; Enter saves and
  puts focus back on the cell, Escape cancels (the grid refocuses the cell). Call
  `event.preventDefault()` in the cell's `onKeyDown` when you start editing on Enter.
- Arrow keys still move the grid from a checkbox, switch, link or button in a cell; a text field
  keeps them. Handle Tab inside your own editor if it should move to the next cell.
- The grid paints the container surface (`bg-ws-static-container`) so pinned cells stay opaque;
  on another surface pass its class to `Spreadsheet` (`bg-ws-static-foreground`).
- It fills the width it is given. In a parent that sizes to its content (a centred grid cell,
  `w-max`) give it a width (`w-[46rem]`), or it takes the table's full intrinsic width.
- It renders every row it is given; page or virtualize past a few thousand cells. Row spans are
  not followed by the arrow keys.

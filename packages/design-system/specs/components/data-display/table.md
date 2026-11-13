---
name: Table
import: import { Table } from '@wideset/react'
group: data-display
status: stable
parts:
  [Table, TableHead, TableBody, TableFoot, TableRow, TableHeader, TableCell, TableCellDescription]
related: [ListItem, Pagination, StatusBadge, Tag, Checkbox]
docs: https://wideset.co/components/table
storybook: components-table--default
---

# Table

> Records with several attributes each, laid out so the user can scan down a column and across a row.

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

## Anatomy

```tsx
<Table>
  <Table.Head>
    <Table.Row>
      <Table.Header>Customer</Table.Header>
      <Table.Header align="right">Amount</Table.Header>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Acme Corp</Table.Cell>
      <Table.Cell align="right">$1,200.00</Table.Cell>
    </Table.Row>
  </Table.Body>
  <Table.Foot>
    {/* optional summary rows */}
    <Table.Row>
      <Table.Cell>Total</Table.Cell>
      <Table.Cell align="right">$1,200.00</Table.Cell>
    </Table.Row>
  </Table.Foot>
</Table>
```

Native `table` / `thead` / `tbody` / `tfoot` / `tr` / `th` / `td`. Named exports (`TableRow`,
`TableCell`, …) are the same parts for Server Components.

## Choosing props

| Prop                | Value                          | Use for                                                                 |
| ------------------- | ------------------------------ | ----------------------------------------------------------------------- |
| `size` (on `Table`) | `sm` (default)                 | Most data.                                                              |
|                     | `md` / `lg`                    | Rows that hold avatars, buttons or two lines of text.                   |
| `separated`         | `true`                         | Wide tables of numbers read down a column.                              |
| `striped`           | `true`                         | Wide tables of similar values read across a row.                        |
| `interactive`       | `true`                         | Rows that open something on click (row hover).                          |
| `selectionMode`     | `single` / `multiple`          | Selectable rows; turns on `interactive`, adds `grid` + `aria-selected`. |
| `stickyHeader`      | `true`                         | Long tables in a height-limited scroll container.                       |
| `stickyColumn`      | `true`                         | Wide tables in a width-limited scroll container (first column pinned).  |
| `align`             | `left` / `center` / `right`    | Right-align numbers and amounts, header and cells alike.                |
| `truncate`          | `true`                         | One-line cells with ellipsis; needs fixed column widths (see Gotchas).  |
| `sortable` (header) | with `sortDirection`, `onSort` | A sort button in the header; `null` / `asc` / `desc`.                   |
| `selected` (row)    | `boolean`                      | The row's selected look; you own the state.                             |

`align`, `truncate`, `flushMargin` and `placement` set on `Table` are defaults; a
`Table.Header` or `Table.Cell` overrides them.

## States

- Hover / pressed rows: live with `interactive` or `selectionMode`.
- Selected: `selected` on `Table.Row`. Selection state is yours (an array of ids).
- Sort: `sortDirection` is yours; `onSort` tells you the user clicked. `disabled` on a sortable
  header locks the button.
- Empty and loading: no built-in state. Render one `Table.Row` with a single
  `Table.Cell colSpan={n}` holding the message (see `patterns/list-and-filters.md`).

## Content

- Column headers are nouns, sentence case, one or two words.
- Numbers and amounts right-aligned, with units in the header or the value, never mixed.
- Status in a cell → `StatusBadge`; category → `Tag`; person → `Avatar` plus the name in text.
- A second line under a label (a project's summary under its name) → `Table.CellDescription`, in
  `md` and `lg` tables. The label keeps the cell's type: never raise its size to make it stand out.
- Component sizes per table size: Tag / StatusBadge `md` in `sm`/`md` tables and `lg` in `lg`;
  Avatar `sm` in `sm`, `md` otherwise; TextInput `sm`, `md` in `lg`; Checkbox `lg`.

## Accessibility

- Keep `Table.Head`; header cells name the columns for screen readers.
- A sortable header gets `aria-sort` and a labelled sort button (`Sort by <column>`). Pass
  `sortAriaLabel` when the header content is not plain text.
- A selection checkbox needs `aria-label` naming the row (`Select Acme Corp`).
- Row click is mouse-only. Put a real control (a `Checkbox`, a `LinkButton`, a `Button`) in the
  row so keyboard users can reach the same action.
- With `stickyHeader` or `stickyColumn` the table becomes a tab stop so keyboard users can scroll it.

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

// Do: sticky header inside a height-limited scroll container
<div className="max-h-[24rem] overflow-y-auto">
  <Table stickyHeader>…</Table>
</div>
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
- Sticky header / column need the scroll container (`overflow-y-auto` with a max height,
  `overflow-x-auto` with a width limit); they set `hasBackground` for you.
- Sorting, selection and pagination are your state; Table renders, it does not sort or slice data.
  Large data sets: paginate with `Pagination` or virtualize at the data layer.
- `sortable` without `onSort` renders a sort button that does nothing.
- `Table.Head`, `Table.Row`, `Table.Header` and `Table.Cell` throw outside `<Table>`.

## API

Full props: `https://wideset.co/components/table.md` · Types:
`packages/design-system/src/components/table/Table.types.ts`

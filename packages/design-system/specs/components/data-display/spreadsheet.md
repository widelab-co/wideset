---
name: Spreadsheet
import: import { Spreadsheet } from '@wideset/react'
group: data-display
status: stable
parts:
  [
    Spreadsheet,
    SpreadsheetHead,
    SpreadsheetBody,
    SpreadsheetRow,
    SpreadsheetColumnHeader,
    SpreadsheetColumnHeaderIcon,
    SpreadsheetColumnHeaderTrigger,
    SpreadsheetRowHeader,
    SpreadsheetCell,
  ]
related: [Table, Tag, StatusBadge, Checkbox, DropdownMenu]
docs: https://wideset-docs.widelab.workers.dev/components/spreadsheet
storybook: components-spreadsheet--default
---

# Spreadsheet

> A dense grid people work through cell by cell: many columns, many rows, a pinned header and row numbers, the arrow keys moving a selected cell.

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

## Anatomy

```tsx
import { RiHashtag } from '@remixicon/react';
import { Spreadsheet, Tag } from '@wideset/react';

export const Clients = () => (
  <Spreadsheet aria-label="Clients" className="h-[30rem]">
    <Spreadsheet.Head>
      <Spreadsheet.Row>
        <Spreadsheet.ColumnHeader aria-label="Row" className="w-[2.8125rem]" />
        <Spreadsheet.ColumnHeader className="w-[9.5rem]">Client name</Spreadsheet.ColumnHeader>
        <Spreadsheet.ColumnHeader className="w-[9.5rem]" sortDirection="desc">
          <Spreadsheet.ColumnHeaderIcon icon={RiHashtag} />
          Customers
        </Spreadsheet.ColumnHeader>
        <Spreadsheet.ColumnHeader className="w-[9.5rem]">Country</Spreadsheet.ColumnHeader>
      </Spreadsheet.Row>
    </Spreadsheet.Head>
    <Spreadsheet.Body>
      <Spreadsheet.Row>
        <Spreadsheet.RowHeader>0</Spreadsheet.RowHeader>
        <Spreadsheet.Cell>Tech Nova</Spreadsheet.Cell>
        <Spreadsheet.Cell align="right">23</Spreadsheet.Cell>
        <Spreadsheet.Cell>
          <Tag size="sm" color="pink">
            Brazil
          </Tag>
        </Spreadsheet.Cell>
      </Spreadsheet.Row>
    </Spreadsheet.Body>
  </Spreadsheet>
);
```

A `<table role="grid">` inside a scroll container: `ColumnHeader` is a `th scope="col"`,
`RowHeader` a `th scope="row"` (the row number), `Cell` a `td`. The column menu chevron is
`Spreadsheet.ColumnHeaderTrigger` inside `DropdownMenu.Trigger asChild`.

## Choosing props

| Prop                             | Value                     | Use for                                                             |
| -------------------------------- | ------------------------- | ------------------------------------------------------------------- |
| `size`                           | `sm` (default)            | 32px rows: the densest data, Tag / StatusBadge `sm`, Avatar `xs`.   |
|                                  | `md`                      | 40px rows: 24px content, Tag / StatusBadge `md`, Avatar `sm`.       |
| `stickyColumns`                  | `1` (default)             | Pins the row numbers while the grid scrolls sideways.               |
|                                  | `2`                       | Also pins the name column; `0` pins none.                           |
| `align` (Cell, ColumnHeader)     | `right`                   | Numbers and amounts.                                                |
| `sortDirection` (ColumnHeader)   | `asc` / `desc` / `null`   | `aria-sort` on the sorted column; `null` for sortable but unsorted. |
| `className` (ColumnHeader, root) | `w-[9.5rem]`, `h-[30rem]` | Column widths on the header cells; the grid's height to scroll in.  |

## States

- Selected: the cell the user reached, by click or arrow key, has `aria-selected` and the brand
  tint; it is the grid's only tab stop. Keyboard focus adds an inset ring.
- Hover and pressed tint every cell; the header row sits on a 4% tint.
- The grid has no loading or empty state: render one `Spreadsheet.Row` with a single
  `Spreadsheet.Cell colSpan={n}` holding the message.

## Content

- Text, a right-aligned number, or one library component per cell: `Tag`, `StatusBadge`,
  `Checkbox`, `Switch`, `ProgressBar` in an 80px box (`w-ws-22`), `Avatar` beside a name, an icon.
- Everything stays on one line and ends in an ellipsis; the full text of a text cell is in its
  `title`.
- Digits are tabular, so a column of numbers lines up; format with `Intl.NumberFormat`.
- Column headers: a noun, sentence case, with a type icon (`RiHashtag` numbers, `RiCalendarLine`
  dates, `RiPriceTag3Line` categories).

## Accessibility

- Name the grid: `aria-label` or `aria-labelledby` on `Spreadsheet` (it reaches the table).
- Keyboard: arrows move the selected cell, Home / End to the row's ends, Ctrl/Cmd+Home / End to
  the grid's corners, Page Up / Down by a screen of rows. Enter or F2 moves focus into the cell's
  control, Escape or F2 back. Tab leaves the grid and returns to the same cell.
- Controls in cells have no visible label: give each an `aria-label` naming column and row
  (`Verified: Tech Nova`). `ColumnHeaderTrigger` requires its own (`Customers options`).
- An empty corner header still needs a name: `aria-label="Row"`.

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

## API

Full props: `https://wideset-docs.widelab.workers.dev/components/spreadsheet.md` · Types:
`packages/design-system/src/components/spreadsheet/Spreadsheet.types.ts`

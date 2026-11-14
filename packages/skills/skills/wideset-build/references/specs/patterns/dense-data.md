# Dense data

> A screen people work in like a spreadsheet: many columns and rows of values, read down a column
> and across a row, moved through cell by cell.

## Problem

Some screens are the data: a client list with twenty fields, a price sheet, a stock count, a
schedule. People scan a column, compare neighbours, jump to a cell and act on it, and the view
holds more than the screen. A list of cards or a roomy table wastes the space and hides the
columns; a hand-built grid of `div`s loses the keyboard and the screen reader. `Spreadsheet` is
the dense grid; `Table` stays the default for records read a row at a time.

A whole screen starts from the `spreadsheet` starting point (Wideset Core's Clients table: view
tools, column summaries, row selection, a status bar), its code at
`https://wideset.co/blocks/spreadsheet.md`.

## Is the screen spreadsheet-like?

Most of these hold:

- Eight or more columns, or more rows than fit the viewport, and the user needs them all at once.
- The user compares values across rows (who has the most customers, which dates are missing).
- The user moves cell by cell and acts on a cell (edit, copy, open its menu), not on a whole row.
- The header and the identifying columns must stay in view while the rest scrolls both ways.

If the user opens, selects or deletes whole records, and five to seven columns tell the story,
it is a list → `Table` (see [List and filters](list-and-filters.md)).

## Pick the component

| Need                                                    | Use                                                  |
| ------------------------------------------------------- | ---------------------------------------------------- |
| Cell-by-cell work, many columns, pinned header and rows | `Spreadsheet` (`sm`, 32px rows)                      |
| Records read and acted on per row, sort, select, totals | `Table` (`sm` 40px, `md` 48px rows)                  |
| One line per item with an icon and a description        | `ListItem` in a list                                 |
| A handful of key figures                                | Plain layout with `typography-*` classes, not a grid |

## Density

- `Spreadsheet` `sm`: 32px rows, 8px sides, 12px text (`typography-body-sm`). `md`: 40px rows and
  12px sides for rows that hold 24px avatars or badges. Do not mix sizes on one screen.
- Size what the cells hold with the grid: `Tag` and `StatusBadge` `sm` in `sm` and `md` in `md`;
  `Avatar` `xs` / `sm`; `Checkbox` and `Switch` at their default.
- Give each column the width its usual value needs (`w-[9.5rem]` on the column header), and leave
  the last column without one so the grid lines run to the edge of the screen.
- One line per cell. Long values end in an ellipsis; the full text is in the cell's title or a
  detail view, never a taller row.

## Numbers

- Right-align numbers, amounts and percentages (`align="right"`); dates and text stay left.
- Digits are tabular in `Spreadsheet` (`tabular-nums`), so the same digit sits in the same place
  down a column. In a `Table` add `tabular-nums` to the number cells.
- Format with `Intl.NumberFormat` and `Intl.DateTimeFormat`; the same decimals down a column; the
  currency in every cell or once in the header, never both.
- An empty value is an empty cell in a spreadsheet; the grid lines already show it.

## Structure

```
section                                  — flex column, the screen's main area
├ toolbar (div, flex, gap-ws-5)          — view switch, FilterButton, sort summary, actions
└ Spreadsheet  (h-full / h-[…])          — the only scroll container for the data
  ├ Spreadsheet.Head
  │ └ Row: ColumnHeader (corner) + ColumnHeader per field (icon, label, menu trigger)
  └ Spreadsheet.Body
    └ Row per record: RowHeader (number) + Cell per field
```

## Example

```tsx
import { RiCalendarLine, RiFileLine, RiHashtag, RiPriceTag3Line } from '@remixicon/react';
import { Spreadsheet, Tag } from '@wideset/react';

type Client = { id: string; name: string; customers?: number; country?: string; added?: Date };

const date = new Intl.DateTimeFormat('en-US', { dateStyle: 'short' });

export function ClientSheet({ clients }: { clients: Client[] }) {
  return (
    <Spreadsheet aria-label="Clients" stickyColumns={2} className="h-[36rem]">
      <Spreadsheet.Head>
        <Spreadsheet.Row>
          <Spreadsheet.ColumnHeader aria-label="Row" className="w-[2.8125rem]" />
          <Spreadsheet.ColumnHeader className="w-[9.5rem]">
            <Spreadsheet.ColumnHeaderIcon icon={RiFileLine} />
            Client name
          </Spreadsheet.ColumnHeader>
          <Spreadsheet.ColumnHeader className="w-[9.5rem]">
            <Spreadsheet.ColumnHeaderIcon icon={RiHashtag} />
            Customers
          </Spreadsheet.ColumnHeader>
          <Spreadsheet.ColumnHeader className="w-[9.5rem]">
            <Spreadsheet.ColumnHeaderIcon icon={RiPriceTag3Line} />
            Country
          </Spreadsheet.ColumnHeader>
          <Spreadsheet.ColumnHeader>
            <Spreadsheet.ColumnHeaderIcon icon={RiCalendarLine} />
            Date added
          </Spreadsheet.ColumnHeader>
        </Spreadsheet.Row>
      </Spreadsheet.Head>
      <Spreadsheet.Body>
        {clients.map((client, index) => (
          <Spreadsheet.Row key={client.id}>
            <Spreadsheet.RowHeader>{index}</Spreadsheet.RowHeader>
            <Spreadsheet.Cell>{client.name}</Spreadsheet.Cell>
            <Spreadsheet.Cell align="right">{client.customers}</Spreadsheet.Cell>
            <Spreadsheet.Cell>
              {client.country && (
                <Tag size="sm" color="blue">
                  {client.country}
                </Tag>
              )}
            </Spreadsheet.Cell>
            <Spreadsheet.Cell>{client.added && date.format(client.added)}</Spreadsheet.Cell>
          </Spreadsheet.Row>
        ))}
      </Spreadsheet.Body>
    </Spreadsheet>
  );
}
```

## Variants

- **Column menus.** Put `Spreadsheet.ColumnHeaderTrigger` after the label, inside
  `DropdownMenu.Trigger asChild`, for sort, hide or rename. Sorting is your state: reorder the rows
  and set `sortDirection` on the sorted column; say what is sorted in the toolbar too.
- **Selecting rows.** A `Checkbox` in the corner header selects all; once rows are selected, show
  a `Checkbox` in each row header instead of its number. Bulk actions go in an `ActionBar`.
- **Adding rows and columns.** A last row with an `IconButton` (`RiAddLine`, ghost, `xs`) in its
  row header and one `Spreadsheet.Cell` spanning the rest; an `IconButton` in a last column header
  without a width. Name both (`Add client`, `Add column`).
- **Editing.** On Enter, F2 or a double click render an input in the cell; Enter saves and puts
  focus back on the cell, Escape cancels. Keep one cell in edit at a time.
- **Column summaries** (a type, a small chart, a count under each header) are screen content: a
  second `Spreadsheet.Row` of `Spreadsheet.Cell`s in `Spreadsheet.Head`, with your own chart.

## Accessibility

- Name the grid (`aria-label`); name the corner header even when it is empty (`aria-label="Row"`).
- The grid is one tab stop with arrow-key navigation; do not add `tabIndex` to cells or wrap
  them in your own focusable elements.
- Every control in a cell has an `aria-label` that names its column and row.
- Give the screen one heading or label that says what the data is; the grid does not announce a
  caption of its own.

## Anti-patterns

- A grid of `div`s with `onClick` handlers: no keyboard, no screen reader → `Spreadsheet`.
- A `Spreadsheet` for five columns of records the user opens one by one → `Table`.
- Rows that grow with their content, or text that wraps: the grid stops reading as a grid.
- Coloured text for states, or a hand-built pill → `StatusBadge`; categories → `Tag`.
- Several sizes, or Table and Spreadsheet side by side for the same data on one screen.

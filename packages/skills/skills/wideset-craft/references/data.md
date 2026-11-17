# Data: tables, numbers and key figures

## The rule

Data reads in columns. Text is left-aligned, numbers are right-aligned with tabular figures and
the same number of decimals down a column, units are consistent, and status is a badge, not a
coloured word.

## Why

A table is read vertically: people compare one row's value with the next. Right-aligned tabular
numbers put the same digit in the same place, so a glance compares magnitudes. Mixed alignment,
decimals or units force reading every cell.

## Tables

- `Table` rows are `sm` (40px) by default, the smallest Table; `md` 48px for large screens (see
  [sizing.md](sizing.md)). Denser, cell-by-cell work is a `Spreadsheet`.
- A screen people work through cell by cell (many columns, more rows than fit, a pinned header and
  row numbers) is a `Spreadsheet`, not a wider `Table`: 32px rows and 12px text, every value on one
  line, numbers right-aligned in tabular figures. See the dense-data pattern in `wideset-build`.
- First column is the identity of the row (name, ID), `text-ws-static-strong`; other text columns
  `text-ws-static-base`; secondary information under the name in `typography-caption-md
text-ws-static-subtle`, not in its own narrow column.
- Number columns right-aligned (header too) in `typography-number-sm tabular-nums`. Currency with its symbol in
  every cell, or in the header when the whole column shares it; never both.
- Status column: `StatusBadge`, one word, the same set of statuses everywhere in the product.
- Actions: the last column, ghost `IconButton` or an overflow menu, revealed for every row (not
  only on hover; touch and keyboard users need them).
- Five to seven columns at 1280px. More means some belong in the detail view.
- Empty values are "—" in `text-ws-static-subtle`, never blank, "null" or "N/A".

## Numbers

- Format with `Intl.NumberFormat` and `Intl.DateTimeFormat` in the user's locale; never build
  strings by hand.
- Round to what the reader can use: £18,420 on a dashboard, £18,420.36 on an invoice.
- Dates: relative for the last few days ("12 min ago", "Yesterday"), absolute after that; the
  absolute value in a `title` or Tooltip when relative is shown.
- Percentages for change, absolute numbers for amounts. Say what the change is compared to
  ("vs last week").

## Key figures (KPIs)

- At most one row of three or four. More than four becomes a table.
- Label (`typography-label-sm text-ws-static-subtle`) above the value
  (`typography-title-md tabular-nums text-ws-static-strong`), the change and its comparison under
  it.
- The one figure a page is about (an account balance) goes one step up to `typography-title-lg`;
  the rest of the page stays at the flat scale.
- The colour of a change follows its meaning, not its direction: prep time down is good, revenue
  down is bad. Use the status tokens through `StatusBadge`; add the direction in words for screen
  readers.
- Equal heights across the row; a missing value shows "—" with the same height.

Out of scope: charts. Wideset has no chart components; keep charts out of generated screens
unless the person asks, then use their chart library with Wideset colour tokens and say so.

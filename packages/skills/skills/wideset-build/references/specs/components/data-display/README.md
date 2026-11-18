# Data display

Components that present records and their attributes: rows of data, people, categories and
states. They show; they don't collect input. Selection and filtering live in `selection` and
`inputs`; feedback messages live in `feedback`.

## Pick the right one

- [Table](../../../good-practices/table.md) — several attributes per record, compared across rows; sort, select, totals.
- [Spreadsheet](../../../good-practices/spreadsheet.md) — a dense grid worked through cell by cell: many columns and rows,
  pinned header and row numbers, arrow keys moving a selected cell.
- [ListItem](../../../good-practices/list-item.md) — one compact row (icon, label, description, trailing fact); the row
  inside menus and selects.
- [Avatar](../../../good-practices/avatar.md) — a person, team or agent next to a name; `Avatar.Group` for several.
- [Tag](../../../good-practices/tag.md) — which category something belongs to; colour is categorical.
- [StatusBadge](../../../good-practices/status-badge.md) — what state something is in; colour is semantic.

## Tag vs StatusBadge vs Chip

All three are small pills. Pick by what the label means and whether the user acts on it.

| Question                   | Tag                            | StatusBadge                                                  | Chip ([selection](../../../good-practices/chip.md)) |
| -------------------------- | ------------------------------ | ------------------------------------------------------------ | --------------------------------------------------- |
| What does it say?          | A category (Design, Sales)     | A state (Paid, Overdue, Draft)                               | A value the user picked or can pick                 |
| Does colour carry meaning? | Hue per category, no judgement | Yes: `negative` / `notice` / `positive` / `info` / `neutral` | No                                                  |
| Can the user click it?     | No                             | No                                                           | Yes: toggle, select, dismiss                        |
| Typical place              | Cells, cards, profiles         | Status column, next to a title                               | Filter bars, multi-value fields                     |

Rules of thumb:

- If the word would change when the record progresses (Draft → Sent → Paid), it is a status →
  `StatusBadge`.
- If the word stays the same for the life of the record (Engineering), it is a category → `Tag`.
- If removing or toggling it changes what the user sees, it is a control → `Chip`.
- Never give a Tag or StatusBadge an `onClick`; a clickable pill is a Chip.

## Table vs Spreadsheet vs ListItem vs Card

- Several attributes per record, compared across rows → `Table`; never a grid of `div`s.
- Many columns, many rows, worked through cell by cell with the keyboard → `Spreadsheet`
  ([dense data](../../patterns/dense-data.md)).
- One compact row per record (files, people, menu rows) → `ListItem`.
- A bounded surface for one subject → `Card`; not a `div` with a border and a shadow.
- A bordered group of facts or choices → `Tile` ([selection](../selection/README.md)).

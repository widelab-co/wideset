# Colour by job: which colour, when

A calm, readable product page uses very few colours, and each one means one thing. This file says
which colour every kind of text and mark takes. The example throughout is a weekly report page
(title, lede, figures, insight cards, a chart and a department table): every rule below is visible
on it.

## The three text colours

Every piece of text has exactly one job. The job picks the colour; size and weight never stand in
for it.

| Job          | Token                   | The reader…                      | On the report                                                                                           |
| ------------ | ----------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Look for** | `text-ws-static-strong` | scans for it and stops on it     | "Weekly AI usage report: adoption stabilized.", "What changed", "131", "1,910", "Finance", "92%"        |
| **Read**     | `text-ws-static-base`   | reads it in full, word by word   | the lede under the title, the insight card text, "118 returning users", the Seats/Active/Convos numbers |
| **Label**    | `text-ws-static-subtle` | glances at it to know what it is | "Weekly report · Mar 15 – 21, 2025", "Active users", "vs. last week", "Updated Mar 21", column headers  |

Ask one question per text: **would the reader stop on it, read it, or only use it to understand
something else?** Stop → `strong`. Read → `base`. Understand something else → `subtle`.

### Look for: `strong`

Little of the page, and only what a person scans for:

- The page title (`typography-title-md`) and card and section titles (`typography-subtitle-xs`,
  "What changed").
- The title of each item: a card's title, a list row's title, an item name in a table's first
  column ("Finance", "Customer Service").
- Key figures: the number a KPI is about ("131", "73%"; `typography-title-md` in a KPI row,
  `typography-title-lg` for the one figure a page is about), a total, a price.
- The one column that matters in a table ("Utilization": 92%, 82%, …), so the eye finds it without
  reading the others.
- The selected thing: the active tab, the current page in the sidebar, the highlighted week in a
  chart and its axis label ("Mar 08").

If more than about a quarter of the text on a screen is `strong`, nothing leads. Take it back.

### Read: `base`

Everything a person actually reads:

- The line under a page title: `typography-body-md` on a product page ("Enterprise plan, 240 seats,
  renews on 14 Jan 2027"); on a page made to be read (a report, an article) it is a lede at
  `typography-body-lg` ("Usage rose for the third straight week…").
- Descriptions and body text: card text, explanations under a chart, a section's paragraph.
- Supporting numbers: the figures under a key figure ("118 returning users", "13 new or
  reactivated"), the other numeric columns of a table (Seats, Active, Convos, Per active).
- Values in forms and detail lists: a field's value, the value beside a label ("Sundial
  Beverages"), message and comment text.

### Label: `subtle`

Text that only names or places something else:

- Labels: a field label in a detail list, a figure's label ("Active users"), a legend entry.
- Metadata: dates, times, authors' roles, "Updated Mar 21", "Weekly report · Mar 15 – 21, 2025".
- Comparisons and units beside a value: "vs. last week", "WoW", "of 500 characters".
- Column headers, axis labels and gridline values ("0", "1,000", "2,000").
- Placeholders and helper text.

### Rank inside a job by size, never by a fourth grey

The lede and a card's text are both "read"; the lede is bigger (`typography-body-lg` against
`typography-body-md`). Metadata and a column header are both "label"; they share `subtle`. There is
no fourth text grey: never `opacity-*`, a raw hex or a border colour on text to make one.

### Pairs that always go together

| Pair                          | Colours                                             |
| ----------------------------- | --------------------------------------------------- |
| Figure label → key figure     | `subtle` → `strong`                                 |
| Key figure → supporting lines | `strong` → `base`                                   |
| Item title → item metadata    | `strong` → `subtle`                                 |
| Detail label → value          | `subtle` → `base` (`strong` if it is the key value) |
| Section title → its text      | `strong` → `base`                                   |

## Accent and status colour

Grey carries the page; colour is reserved for meaning. On the whole report there are three colours
besides grey, and each appears for one reason:

| Colour             | Means                                   | On the report                                                      | How                                                                                                     |
| ------------------ | --------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| Brand (primary)    | the one action to take                  | the primary button only (here there is none: "Share" is secondary) | filled `Button`, one per view                                                                           |
| Positive (green)   | a change that is good                   | "↑ 7.8%", "↑ 4 pts", "+41% since Mar 01"                           | `StatusBadge color="positive" size="sm"`                                                                |
| Warning / negative | something that needs attention now      | the 43% row in the table, the "At risk" card                       | `StatusBadge`, `InlineAlert`, or the status text token on that one value                                |
| Highlight (chart)  | the one data point the text talks about | the week of Mar 08 in blue, every other bar grey                   | `--ws-non-semantic-fill-blue-strong` on that mark, `-subtle` for its lighter segments; the rest neutral |

Rules:

- **A colour needs a reason in the data.** Green only on a change that is good, warning only on the
  row that is off. A healthy 82% stays neutral even though it is "good".
- **Good and bad changes are one pair.** Green on a good change and red on a bad one count as
  one status pair in the budget (surfaces.md); a warning or alert is the second. Small changes that
  decide nothing stay neutral.
- **One highlight per chart.** Bars, lines and segments are neutral greys; the one the page is
  about takes the highlight colour, and its label turns `strong`.
- **Status colour sits on the value, not the row.** In the table only the 43% and its bar are
  coloured; the department name, the other numbers and the row background stay as they are.
- **No colour for decoration.** Icons, headings, borders and backgrounds stay neutral; a category
  is a neutral `Tag`, not a hue per category.

## Surfaces under the text

- The surface language comes from the screen's visual direction ([surfaces.md](surfaces.md)): on
  the report page the cards are white on a white page and separate by a 1px `border-ws-static-base`
  and space; on a grey canvas they are white cards. Either way, not a grey fill and a shadow at
  once.
- A one-line description directly under a title (`Card.Description`, a page header's summary)
  labels the title and stays `subtle`, as the component renders it. A paragraph that explains
  something is reading text and is `base`.
- A neutral fill appears only on small things that are not text: a table header row, a chip, a
  progress track.
- Chips and pills that only label (`175 licensed seats`, `8 departments`) are outlined or lightly
  filled, with `subtle` or `base` text; the one with a state ("● Stable") carries a status dot,
  not a coloured fill.

## Dark mode

The same three jobs, the same rules; the tokens switch. In dark, long reading text (chat messages,
long descriptions) may use `strong`: light text on a dark ground loses legibility faster than dark
on light, and the reference products do this. Labels stay `subtle`.

## Checks

- Point at any text and name its job (look for, read, label). It must have that job's colour.
- Count `strong` texts: titles, item names, key figures, the selected thing, one key column. Nothing
  else.
- A screen with no `base` text has merged reading into labels: the lede and the metadata look the
  same. Fix the lede and descriptions to `base`.
- Every non-grey colour on the screen can be explained in one sentence about the data.

# Components, containers, actions and states

The component references say what each component does. This file is the judgement between similar ones, which is
where generated UI most often goes wrong while still looking correct.

## The right component

| You need                                                | Use                                       | Not                                |
| ------------------------------------------------------- | ----------------------------------------- | ---------------------------------- |
| A setting that takes effect the moment it changes       | `Switch`                                  | Checkbox                           |
| A choice saved with the rest of a form                  | `Checkbox` / `CheckboxGroup`              | Switch                             |
| One of 2–5 options, in a form                           | `RadioButtonGroup`                        | Select (hides the options)         |
| One of 2–5 views or modes, switching in place           | `SegmentedControl`                        | Tabs, radio buttons                |
| One of many options                                     | `Select`; `ComboBox` when it needs search | A long radio list                  |
| Several of many                                         | `MultiSelect`                             | A wall of checkboxes               |
| Narrowing a list by a property                          | `FilterButton`                            | A Select above the table           |
| Views of the same object (Overview, Activity, Settings) | `Tabs`                                    | SegmentedControl, buttons          |
| Where you are in a hierarchy two or more levels deep    | `Breadcrumbs`                             | A back button only                 |
| A status or category label                              | `StatusBadge` (status), `Tag` (category)  | Coloured text, Chip                |
| A removable or toggleable filter value                  | `Chip`                                    | Tag                                |
| A short label that explains an icon or truncated text   | `Tooltip`                                 | Text that only exists in a tooltip |

Rule of thumb: if two components could work, pick the one whose reference names your
case, and say why in your report.

## The right container

| The task                                                    | Container                                                                                                          |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| One decision or confirmation, one short form (≤ 4 fields)   | `Modal`                                                                                                            |
| A destructive confirmation                                  | `Modal` with a `variant="danger"` primary; or no dialog at all and a Toast with Undo when the action is reversible |
| Details or editing of one item while the list stays in view | `Sidepanel`                                                                                                        |
| A long form, settings, or a flow of more than three steps   | Its own page (no Sidebar distractions needed)                                                                      |
| A result that needs acknowledgement (success, failure)      | `StatusModal`                                                                                                      |

A Modal that scrolls or a page with one checkbox both mean the container is wrong.

## Action hierarchy

- **One primary per view** (filled `Button`). If you cannot pick one, the screen has two jobs;
  split it.
- **Secondary** actions: `variant="secondary" preset="border"`. **Tertiary** and in-row actions:
  `preset="ghost"`, `IconButton`, or a `DropdownMenu` behind an overflow `IconButton`
  (`RiMoreLine`) when there are more than two.
- **A row of buttons holds only buttons.** Every action beside a `Button` (a form or card footer,
  a page header) is a `Button` or `IconButton` of the same size, even one that navigates
  (`Button asChild` around an `<a>`). `LinkButton` has no control height and no hover fill, so in
  that row it reads as dead text, even when a reference draws plain text there. It belongs in
  a sentence or alone under a form or card.
- **Placement**: page actions top right in the header, primary rightmost. Form and dialog actions
  at the end, right-aligned, primary rightmost, Cancel to its left. In a step flow, Back on the far
  left, Continue on the right.
- **Destructive** actions are never the primary of a normal view. They live in a danger zone, a
  menu item with `variant="danger"`, or the confirmation dialog.
- **Labels** are a verb and an object: "Create order", "Save changes", "Disconnect account". Not
  "OK", "Submit", "Yes".
- Icon-only buttons have an `aria-label` and usually a `Tooltip`. An icon on a labelled button is
  optional and leading; do not add one to every button.

```tsx
// Do: one primary, rightmost; secondary as border; overflow for the rest
<div className="gap-ws-5 flex items-center">
  <IconButton size="sm" icon={RiMoreLine} preset="ghost" variant="secondary" aria-label="More actions" />
  <Button size="sm" variant="secondary" preset="border">Export</Button>
  <Button size="sm">Create order</Button>
</div>

// Don't: three filled buttons competing, the primary not last
<div className="gap-ws-5 flex items-center">
  <Button>Create order</Button>
  <Button>Export</Button>
  <Button variant="danger">Delete all</Button>
</div>
```

## States are designed, not added

Every region that shows data has these states, and each gets the same care as the full one:

| State             | What it shows                                                                                                         |
| ----------------- | --------------------------------------------------------------------------------------------------------------------- |
| Loading           | The layout of the content, in placeholders you compose, so nothing jumps when data arrives; `aria-busy` on the region |
| Empty (first use) | What will appear here, why it is empty, and the one action that fills it                                              |
| No results        | That the filters caused it, and a way to clear them                                                                   |
| Error             | What failed, in plain words, and a retry; the rest of the page keeps working                                          |
| Partial / long    | 1 item, 1,000 items, a 60-character name, a missing value ("—")                                                       |

Wideset has no `EmptyState`, `Skeleton` or `Spinner`: compose the empty state from an icon, a `typography-subtitle-xs`
title, a `typography-body-md text-ws-static-subtle` line and one `Button`, centred in the region.

Feedback goes where the problem is: a field error under the field (`FormField errorText`), a form
or section problem at its top (`InlineAlert`), a product-wide problem at the top of the page
(`SystemAlert`), the result of an action in a Toast. Never the only copy of an error in a Toast.

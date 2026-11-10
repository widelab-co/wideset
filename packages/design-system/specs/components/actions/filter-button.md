---
name: FilterButton
import: import { FilterButton } from '@wideset/react'
group: actions
status: stable
parts: [FilterButton]
related: [MultiSelect, Search, ActionBar]
docs: https://wideset.co/components/filter-button
storybook: components-filterbutton--default
---

# FilterButton

> A compact toolbar trigger that narrows results by a short, predefined set of values.

## When to use

- Filter bars and table toolbars: Status, Owner, Region, each as its own `FilterButton`.
- The user may pick several values and wants to see the choice summarised on the trigger.

## When not to use

- A multi-value field inside a form → `MultiSelect`.
- Free-text filtering → `Search`.
- Acting on selected rows rather than filtering them → `ActionBar`.

## Anatomy

```tsx
<FilterButton
  label="Status"
  placeholder="Status"
  options={[
    { value: 'active', label: 'Active' },
    { value: 'paused', label: 'Paused' },
    { value: 'archived', label: 'Archived', disabled: true },
  ]}
  value={statuses}
  onChange={setStatuses}
/>
```

One component, no parts. It renders the trigger, a clear button once something is chosen, and a
popup checklist.

## Choosing props

| Prop                   | Value                            | Use for                                                             |
| ---------------------- | -------------------------------- | ------------------------------------------------------------------- |
| `options`              | `{ value, label, disabled? }[]`  | The fixed list of choices.                                          |
| `value` / `onChange`   | `string[]`                       | Controlled selection; `onChange` gets the full array.               |
| `defaultValue`         | `string[]`                       | Uncontrolled starting selection (`onChange` still required).        |
| `placeholder`          | string, `'Filter'` default       | Trigger text when nothing is chosen.                                |
| `label`                | string, `'Filter'` default       | Prefix before the summary once something is chosen; names the list. |
| `size`                 | `sm` (default)                   | Compact toolbars, table headers.                                    |
|                        | `md` / `lg`                      | A filter bar; match the inputs and buttons next to it.              |
| `disabled`             | `true`                           | Keeps the selection visible, blocks opening and clearing.           |
| `clearFilterAriaLabel` | string, `'Clear filter'` default | Name of the clear button.                                           |

## States

- Empty: shows `placeholder` and a chevron.
- With a selection: shows `label` plus a summary ("Active, +1") and a clear button that resets to
  `[]` in one click and returns focus to the trigger.
- Disabled: use only while filtering is briefly unavailable, such as during a reload.

## Content

- `label` and `placeholder` are the dimension being filtered, a noun: "Status", "Owner".
- Option labels are short; the first chosen label appears in the trigger.
- Keep the list short; it is a checklist, not a search.

## Accessibility

- The list is a `listbox` with `aria-multiselectable`; arrow keys move, Enter or Space toggles.
- Set `clearFilterAriaLabel` to name the dimension when several filters sit in one row ("Clear
  status filter"), or every clear button reads "Clear filter".

## Do / Don't

```tsx
// Do: one size for the whole filter row
<FilterButton size="md" label="Status" … />
<FilterButton size="md" label="Owner" … />

// Don't: a form field
<form><FilterButton label="Countries" … /></form>   // → MultiSelect
```

## Gotchas

- `onChange` is required, also in uncontrolled mode, and receives the whole array, not the
  toggled value.
- Pass `value` as an array; `undefined` switches to uncontrolled mode.
- Native button props (`className`, `aria-*`, `ref`) land on the trigger, not the wrapper.
- There is no single-select mode; every option is a checkbox.

## API

Full props: `https://wideset.co/components/filter-button.md` · Types:
`packages/design-system/src/components/filter-button/FilterButton.types.ts`

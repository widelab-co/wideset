---
name: MultiSelect
import: import { MultiSelect } from '@wideset/react'
group: inputs
status: stable
parts:
  [
    MultiSelect,
    MultiSelectTrigger,
    MultiSelectValue,
    MultiSelectContent,
    MultiSelectGroup,
    MultiSelectLabel,
    MultiSelectOption,
    MultiSelectSeparator,
  ]
related: [Select, ComboBox, CheckboxGroup, FormField]
docs: https://wideset.co/components/multi-select
storybook: form-select-multiselect--default
---

# MultiSelect

> Pick any number of values from a known list, shown in a dropdown with a checkbox per option.

## When to use

- Several answers from a list too long to show in full: markets, teams, tags on a filter.
- A filter in a toolbar or table header (`preset="ghost"`, `size="sm"`).

## When not to use

- Exactly one value → `Select`.
- A short list (up to about six) that should stay visible → `Checkbox.Group`.
- Values the user types that are not in a list → `ComboBox` (one value) or a `TextInput`.
- Commands, not values → `DropdownMenu`.

## Anatomy

Use the `options` prop; it covers search, select-all, tags and clearing:

```tsx
<MultiSelect
  options={[
    { value: 'design', label: 'Design' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'marketing', label: 'Marketing' },
  ]}
  value={teams}
  onValueChange={setTeams}
  placeholder="Choose teams"
  aria-label="Teams"
  hasSearch
  clearable
/>
```

Composed mode exists for grouped lists (`MultiSelect.Trigger`, `MultiSelect.Content`,
`MultiSelect.Group`, `MultiSelect.Label`, `MultiSelect.Option`, `MultiSelect.Separator`), but
then you own the selection, the trigger and its label. Prefer `options` unless you need groups.

## Choosing props

| Prop               | Value                          | Use for                                                                             |
| ------------------ | ------------------------------ | ----------------------------------------------------------------------------------- |
| `maxVisibleTags`   | omitted (default)              | Every choice is a tag; the field grows in height to fit.                            |
|                    | `1`, `2`, …                    | Tags up to that count, then one summary ("3 teams"). Keeps the field one line high. |
|                    | `0`                            | Always the summary, never tags (fixed-height rows, toolbars).                       |
| `multiValuesLabel` | string                         | The noun in the summary: `"teams"` → "3 teams".                                     |
| `hasSearch`        | boolean                        | Long lists; filters options by label.                                               |
| `hasSelectAll`     | boolean                        | Bulk choice. With search it applies to the visible options only.                    |
| `clearable`        | boolean                        | One click empties the whole selection.                                              |
| `preset`           | `border` (default) / `ghost`   | Form / inside a framed surface (toolbar, table header).                             |
| `variant`          | `primary` (default) / `danger` | Normal / failed validation.                                                         |
| `size`             | `md` (default) / `sm` / `lg`   | Forms / filter bars and dense tables / main-task form.                              |

State: `value` + `onValueChange` (controlled) or `defaultValue` (uncontrolled), both `string[]`.
Open state: `open` / `defaultOpen` / `onOpenChange`; `modal` blocks the page while open.

## States

- Each tag has its own remove control; Backspace on the focused trigger removes the last tag
  while tags are visible.
- Disabled blocks the trigger and every option and hides the clear button. To lock one choice,
  set `disabled` on that option instead.
- Search with no match shows `noResultsLabel` ("No results found").
- Danger: set it after submit or blur ("choose at least one"); the reason goes in `FormField`'s
  `errorText`.

## Content

- Option labels short, sentence case; `multiValuesLabel` is a plural noun in the user's language.
- Translate `selectAllLabel`, `deselectAllLabel`, `noResultsLabel` and `clearSelectionAriaLabel`.

## Accessibility

- Name it: `FormField` `htmlFor` + `id` on MultiSelect (it lands on the trigger), or `aria-label`.
- Options are menu checkbox items: Space or Enter toggles, arrows move, the menu stays open.

## Do / Don't

```tsx
// Do: a fixed-height filter that summarises past two choices
<MultiSelect options={teams} maxVisibleTags={2} multiValuesLabel="teams" preset="ghost" size="sm" aria-label="Teams" />

// Don't: four always-relevant options hidden in a dropdown
<MultiSelect options={[{ value: 'email', label: 'Email' }, { value: 'sms', label: 'SMS' }]} />
```

## Gotchas

- MultiSelect is built on `DropdownMenu`, not on a form element. `name` lands on the trigger
  button; the selected values are not submitted with a native form. Read them from state.
- `onValueChange` receives the whole new array, not the toggled value.
- In composed mode the root passes only `open`, `onOpenChange` and `modal`. `value`,
  `onValueChange`, `disabled`, `options`, `variant` and the rest do nothing; each
  `MultiSelect.Option` needs `option`, `isSelected`, `isDisabled` and `onSelect` from you, and
  `MultiSelect.Content` needs `shouldUsePrimitive={false}`.
- `MultiSelect.Value` is driven entirely by props (`selectedOptions`, `areTagsVisible`, …); it
  is for rebuilding the trigger, not for reading the value.
- The list portals to `document.body`; pass `portalContainer` only for a custom stacking root.

## API

Full props: `https://wideset.co/components/multi-select.md` · Types:
`packages/design-system/src/components/multi-select/MultiSelect.types.ts`

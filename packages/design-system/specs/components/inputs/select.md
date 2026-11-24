---
name: Select
import: import { Select } from '@wideset/react'
group: inputs
status: stable
parts:
  [
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectLabel,
    SelectOption,
    SelectSeparator,
    SelectSearch,
    SelectItemText,
    SelectItemIndicator,
  ]
related: [MultiSelect, ComboBox, RadioButton, DropdownMenu, FormField]
docs: https://wideset.co/components/select
storybook: form-select-select--default
---

# Select

> Pick exactly one value from a known list, shown in a dropdown.

## When to use

- One answer from a fixed list too long to show in full (roughly six or more): a country, a
  team, a role.
- A long list the user may want to narrow → add `hasSearch`.

## When not to use

- Several values → `MultiSelect`.
- The user may type a value that is not in the list, or the list is filtered as they type →
  `ComboBox`.
- Two to five options that should stay visible → `RadioButton.Group`.
- A list of actions or commands rather than a value → `DropdownMenu`.
- Free text → `TextInput`.

## Anatomy

Simple mode, for most cases:

```tsx
<Select
  options={[
    { value: 'design', label: 'Design' },
    { value: 'engineering', label: 'Engineering' },
  ]}
  value={team}
  onValueChange={setTeam}
  placeholder="Choose a team"
  aria-label="Team"
/>
```

Composed mode, for groups and custom rows:

```tsx
<Select value={country} onValueChange={setCountry}>
  <Select.Trigger aria-label="Country">
    <Select.Value placeholder="Select country" />
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      <Select.Label>Europe</Select.Label>
      <Select.Option value="poland">Poland</Select.Option>
      <Select.Option value="germany">Germany</Select.Option>
    </Select.Group>
    <Select.Separator />
    <Select.Option value="usa">USA</Select.Option>
  </Select.Content>
</Select>
```

`Select.Search` goes first inside `Select.Content` when composing; you own its query and the
filtering.

## Choosing props

| Prop             | Value                                              | Use for                                                                     |
| ---------------- | -------------------------------------------------- | --------------------------------------------------------------------------- |
| `options`        | `{ value, label, prefix?, disabled?, variant? }[]` | Simple mode. `prefix` is an icon or avatar before the label.                |
| `preset`         | `border` (default)                                 | A select in a form or on the page.                                          |
|                  | `ghost`                                            | Inside a surface that has its own frame (toolbar, card header, table cell). |
| `variant`        | `primary` (default)                                | Every select.                                                               |
|                  | `danger`                                           | The choice failed validation (required and empty on submit).                |
| `size`           | `md` (default)                                     | Forms.                                                                      |
|                  | `sm` / `lg`                                        | Filter bars and dense tables / a short form that is the page's main task.   |
| `clearable`      | boolean                                            | The field is optional and the user may want to empty it.                    |
| `hasSearch`      | boolean                                            | Long lists; filters options by label.                                       |
| option `variant` | `danger`                                           | A destructive choice in the list.                                           |

State: `value` + `onValueChange` (controlled) or `defaultValue` (uncontrolled), both `string`.
Open state: `open` / `defaultOpen` / `onOpenChange`.

## States

- Placeholder until a value is chosen.
- With `clearable`, a clear button appears once a value is set; it empties the value (to `''`)
  without opening the list and calls `onClear`.
- Disabled: skipped by Tab, no clear button.
- Danger: set it after submit or blur; the reason goes in `FormField`'s `errorText`.

## Content

- Option labels are short nouns in sentence case; sort them in an order the user expects
  (alphabetical, or by frequency).
- Placeholder says what to pick ("Choose a team"), not "Select…".
- Give every option a `prefix` or none.

## Accessibility

- Name it: `FormField` `htmlFor` + `id` on Select (it lands on the trigger), or `aria-label`.
- Radix gives the listbox roles, typeahead and arrow keys.
- The clear button is labelled "Clear selection"; translate with `clearSelectionAriaLabel`.

## Do / Don't

```tsx
// Do: a labelled select in a form, filling its column
<FormField label="Country" htmlFor="country" errorText={error}>
  <Select id="country" className="w-full" options={countries} variant={error ? 'danger' : 'primary'} />
</FormField>

// Don't: an option with an empty value
<Select options={[{ value: '', label: 'None' }]} />
```

- Don't use Select for three options a user should compare at a glance → `RadioButton.Group`.

## Gotchas

- In simple mode, `className`, `aria-*` and other HTML props go to the trigger.
- In composed mode, the root only holds state (`value`, `defaultValue`, `onValueChange`, `open`,
  `disabled`, `required`, `name`). `id`, `size`, `preset`, `variant`, `className` and `aria-*` go on
  `Select.Trigger`; `options`, `clearable` and `hasSearch` do nothing. `FormField`'s
  `aria-describedby` does not reach the trigger either: pass `helperTextId` to FormField and set
  `aria-describedby` on `Select.Trigger` yourself.
- An option `value` cannot be `''`: the empty string is how Select means "no value".
- The trigger has a fixed default width; `className="w-full"` fills a form column.
- `preset="ghost"` shows its arrow only while the field is hovered, keyboard-focused or open
  (always on touch screens), and a prefix sits beside the value with no divider. Don't add your
  own arrow or `hideArrow` to get a quiet field; the ghost preset already is one.
- `danger` does not set `aria-invalid` by itself; `FormField` sets it while `errorText` shows.
- The list portals to `document.body` and clears modals and side panels. Don't point
  `portalContainer` at a modal: the list gets clipped.
- `shouldUsePrimitive` on Trigger, Content and Option is internal (used by `DropdownMenu`); leave
  it alone.

## API

Full props: `https://wideset.co/components/select.md` · Types:
`packages/design-system/src/components/select/Select.types.ts`

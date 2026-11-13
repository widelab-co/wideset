---
name: ComboBox
import: import { ComboBox } from '@wideset/react'
group: inputs
status: stable
parts: [ComboBox, ComboBoxTrigger, ComboBoxContent, ComboBoxItem, ComboBoxPrefix, ComboBoxIcon]
related: [Select, MultiSelect, TextInput, FormField]
docs: https://wideset.co/components/combo-box
storybook: form-combobox--default
---

# ComboBox

> One value, typed: the user filters a list by typing and picks a match, or keeps their own text.

## When to use

- A long list the user knows by name (cities, customers, projects): typing is faster than
  scrolling.
- Suggestions where a value outside the list is allowed (a new tag, a free-text city).
- With `disallowCustomValue`: a long list where only existing options are valid, chosen by typing.

## When not to use

- A short or unfamiliar list the user needs to browse → `Select` (add `hasSearch` if long).
- Several values → `MultiSelect`.
- Free text with no suggestions → `TextInput`.
- A search box that filters a page, not a value → a composed `TextInput` with `type="search"`.

## Anatomy

Simple mode:

```tsx
<ComboBox
  options={[
    { value: 'lisbon', label: 'Lisbon' },
    { value: 'berlin', label: 'Berlin' },
  ]}
  value={city}
  onChange={setCity}
  placeholder="Select a city"
  aria-label="City"
  clearable
/>
```

Composed mode; the root still owns state and filtering:

```tsx
<ComboBox options={countries} value={country} onChange={setCountry}>
  <ComboBox.Trigger placeholder="Select country" aria-label="Country" hasPrefix>
    <ComboBox.Prefix>
      <ComboBox.Icon icon={RiMapPinLine} />
    </ComboBox.Prefix>
  </ComboBox.Trigger>
  <ComboBox.Content>{(option) => <ComboBox.Item value={option.value} />}</ComboBox.Content>
</ComboBox>
```

`ComboBox.Content` takes a render function called once per filtered option. `ComboBox.Item`
reads its label, prefix and disabled state from the option with the same `value`.
`ComboBox.Prefix` and `ComboBox.Icon` are `TextInput.Prefix` and `TextInput.Icon`.

## Choosing props

| Prop                  | Value                          | Use for                                                               |
| --------------------- | ------------------------------ | --------------------------------------------------------------------- |
| `disallowCustomValue` | omitted (default)              | Typed text becomes the value when no option is picked.                |
|                       | `true`                         | Only options count; typing just filters, clearing the text deselects. |
| `clearable`           | boolean                        | Optional fields; clears the selection or typed text.                  |
| option `prefix`       | icon, avatar, text             | Repeated in the closed field for the chosen option.                   |
| `preset`              | `border` (default) / `ghost`   | Form / inside a framed surface (toolbar, inline editor).              |
| `variant`             | `primary` (default) / `danger` | Normal / failed validation.                                           |
| `size`                | `md` (default) / `sm` / `lg`   | Forms / filter bars and dense tables / main-task form.                |

State: `value` + `onChange` (controlled) or `defaultValue` (uncontrolled, read on first render
only). `onChange` gets the next string in both modes.

## States

- Typing filters the list and highlights the matching part of each label.
- No match: the list closes; there is no "no results" row.
- Disabled: cannot be opened, typed into or cleared; skipped by Tab.
- Danger: set it after blur or submit (for example free text that matches no city when one is
  required); the reason goes in `FormField`'s `errorText`.

## Content

- Placeholder says what to type or pick ("Select a city").
- Give every option a `prefix` or none: a mixed list reads as two kinds of item.

## Accessibility

- A `<label htmlFor>` does not reach the combobox. Name it with `aria-label`, or give
  `FormField` an `id` (it lands on the label) and pass that id as `aria-labelledby`.
- Arrow keys move the highlight, Enter picks, Escape closes and drops the typed filter.
- The clear button is labelled "Clear selection"; translate with `clearSelectionAriaLabel`.

## Do / Don't

```tsx
// Do: inside FormField, labelled by the label's id
<FormField id="city-label" label="City" errorText={error}>
  <ComboBox aria-labelledby="city-label" options={cities} variant={error ? 'danger' : 'primary'} />
</FormField>

// Don't: rely on htmlFor, the combobox stays unnamed
<FormField label="City" htmlFor="city">
  <ComboBox id="city" options={cities} />
</FormField>
```

## Gotchas

- `onChange` receives a string, not an event, and not `onValueChange` as on Select.
- With custom values allowed, `onChange` fires on every keystroke with the partial text. Validate
  on blur or submit, not in `onChange`.
- Every `ComboBox.Item` `value` needs a matching `options` entry; without one the item has no
  label and a click only closes the list, it selects nothing.
- In simple mode, children that are not `ComboBox.Trigger` / `ComboBox.Content` render inside the
  trigger (a `ComboBox.Prefix`). Once you render `ComboBox.Trigger`, put `size`, `preset`,
  `variant`, `placeholder`, `className` and `aria-*` on it, not on the root, and set `hasPrefix`
  when it holds a `ComboBox.Prefix` (simple mode detects it).
- No `name`: nothing is submitted with a native form. Read the value from state.
- The trigger has a fixed default width; `className="w-full"` fills a form column.

## API

Full props: `https://wideset.co/components/combo-box.md` · Types:
`packages/design-system/src/components/combo-box/ComboBox.types.ts`

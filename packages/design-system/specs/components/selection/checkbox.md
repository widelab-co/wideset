---
name: Checkbox
import: import { Checkbox } from '@wideset/react'
group: selection
status: stable
parts: [Checkbox, CheckboxLabel, CheckboxDescription]
related: [CheckboxGroup, Switch, RadioButton, TileCheckbox, MultiSelect]
docs: https://wideset.co/components/checkbox
storybook: components-checkbox-checkbox--default
---

# Checkbox

> An independent on/off choice that is saved with the form, or one of several options the user may pick together.

## When to use

- Opting in or out of something that is applied when the user submits ("Email me about product updates").
- Picking any number of options from a short, visible list (inside `CheckboxGroup`).
- Selecting rows in a table, with a "Select all" parent that turns indeterminate.

## When not to use

- A setting that takes effect the moment it flips → `Switch`.
- Exactly one option from a set → `RadioButton` in `RadioButtonGroup`.
- Options that need an icon, a title and a description as one big target → `Tile.Checkbox`.
- A long list of options → `MultiSelect`.
- Toggling a filter in a row of short values → `Chip`.

## Anatomy

```tsx
// Shorthand: the common case
<Checkbox
  label="Email me about product updates"
  description="About once a month. Unsubscribe any time."
/>

// Composed: custom markup in the label
<Checkbox defaultChecked>
  <Checkbox.Label>Email me about product updates</Checkbox.Label>
  <Checkbox.Description>About once a month. Unsubscribe any time.</Checkbox.Description>
</Checkbox>

// Bare: a table row, where the column already says what it selects
<Checkbox aria-label="Select row" />
```

`Checkbox.Label` / `CheckboxLabel` and `Checkbox.Description` / `CheckboxDescription` are the same
components; Server Components use the named form.

## Choosing props

| Prop                         | Value                              | Use for                                                                |
| ---------------------------- | ---------------------------------- | ---------------------------------------------------------------------- |
| `variant`                    | `primary` (default)                | every ordinary choice                                                  |
|                              | `danger`                           | a choice with destructive consequences ("Also delete all my projects") |
| `size`                       | `lg` (default)                     | forms and settings                                                     |
|                              | `sm`                               | dense places: table rows, filter panels                                |
| `checked` / `defaultChecked` | `true`, `false`, `'indeterminate'` | controlled / uncontrolled state                                        |
| `onCheckedChange`            | `(checked) => void`                | receives `boolean \| 'indeterminate'` in both modes                    |

Keep one size within a group.

## States

- Unchecked, checked, indeterminate, disabled, disabled + checked. Hover, press and keyboard focus
  are built in.
- Indeterminate is only for a parent whose children are partly selected. It is your state: compute
  it from the children and pass `checked="indeterminate"`. Clicking it reports `true`.
- Disabled leaves the tab order and keeps its value. Use it only when the reason is visible.

## Content

- The label states what turning it on does, in sentence case, no trailing period: "Email me about
  product updates", not "Don't email me".
- The description is one short line. It is read after the label, not as part of the name.
- With `danger`, the label must name the consequence; the colour is only a hint.

## Accessibility

- Always a visible label, except where a column header or row already names it: then `aria-label`.
- The description, shorthand or `Checkbox.Description`, sits outside the label and is linked to the
  checkbox with `aria-describedby` for you. Your own `aria-describedby` is kept alongside it.
- Indeterminate is announced as "mixed".
- Inside `FormField`, the field links its helper or error text to the checkbox and sets
  `aria-invalid` on error; pass `id` and the field's `htmlFor`.

## Do / Don't

```tsx
// Do: "Select all" derived from its children
const all = ['inv-1', 'inv-2', 'inv-3'];
const state =
  selected.length === 0 ? false : selected.length === all.length ? true : 'indeterminate';

<Checkbox
  label="Select all invoices"
  checked={state}
  onCheckedChange={(checked) => setSelected(checked === true ? all : [])}
/>;
```

```tsx
// Don't: an immediate setting as a checkbox
<Checkbox label="Dark mode" onCheckedChange={applyTheme} />
// Do
<Switch label="Dark mode" onCheckedChange={applyTheme} />
```

- Don't pass `label` and children together, or `description` without `label`: the types reject it.
- Don't pass `checked` without `onCheckedChange`; the box will not move.

## Gotchas

- The change handler is `onCheckedChange`, not `onChange`, and the value is
  `boolean | 'indeterminate'`, not a string.
- `className` lands on the box itself, not on the row with the label. Lay out the row with a
  wrapper.
- `ref` points at the checkbox control (a `button` with `role="checkbox"`), not at the row.
- `Checkbox.Label` throws outside a `Checkbox`; it takes its `htmlFor` and disabled state from it.
- A `Checkbox` in `CheckboxGroup` still owns its own state; the group holds none.
- DOM hooks: `data-slot="checkbox"`, `"checkbox-label"`, `"checkbox-description"`.

## API

Full props: `https://wideset.co/components/checkbox.md` · Types:
`packages/design-system/src/components/checkbox/Checkbox.types.ts`

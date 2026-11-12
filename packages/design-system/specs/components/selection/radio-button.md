---
name: RadioButton
import: import { RadioButton, RadioButtonGroup } from '@wideset/react'
group: selection
status: stable
parts: [RadioButton, RadioButtonLabel, RadioButtonDescription]
related: [RadioButtonGroup, Checkbox, SegmentedControl, TileRadio, Select]
docs: https://wideset.co/components/radio-button
storybook: form-radiobutton-radiobutton--default
---

# RadioButton

> One option in a short, visible set where the user must pick exactly one.

## When to use

- A choice of exactly one from two to a handful of options that should stay visible: shipping
  method, billing period, what happens when a project ends.
- The choice is saved with the form, not applied the moment it changes.

## When not to use

- The user may pick several, or none → `Checkbox`.
- Switching a view or mode that applies immediately → `SegmentedControl`.
- A long list, or options that need not be visible at once → `Select`.
- Options that need an icon, a title and a description as one big target → `Tile.Radio`.
- A single on/off setting → `Switch` (or `Checkbox` in a form).

## Anatomy

A radio never stands alone: it lives in `RadioButtonGroup`, which owns the selection.

```tsx
<RadioButtonGroup defaultValue="standard" aria-label="Shipping">
  {/* Shorthand */}
  <RadioButton value="standard" label="Standard" description="3–5 business days" />
  {/* Composed */}
  <RadioButton value="express">
    <RadioButton.Label>Express</RadioButton.Label>
    <RadioButton.Description>Next business day</RadioButton.Description>
  </RadioButton>
</RadioButtonGroup>
```

`RadioButton.Group`, `RadioButton.Label`, `RadioButton.Description` equal the named exports
`RadioButtonGroup`, `RadioButtonLabel`, `RadioButtonDescription`.

## Choosing props

| Prop       | Value               | Use for                                                               |
| ---------- | ------------------- | --------------------------------------------------------------------- |
| `value`    | string (required)   | the option's unique value within its group                            |
| `variant`  | `primary` (default) | every ordinary option                                                 |
|            | `danger`            | the one option with consequences ("Delete the project and its files") |
| `size`     | `lg` (default)      | forms and settings                                                    |
|            | `sm`                | dense places: filter panels, table toolbars                           |
| `disabled` | `true`              | rule out one option; say why in its description                       |

Keep one size within a group. Selection props (`value`, `defaultValue`, `onValueChange`) live on
the group, see [RadioButtonGroup](./radio-button-group.md).

## States

- Unselected, selected, disabled, disabled + selected. Hover, press and focus are built in.
- Once an option is picked the user cannot clear it, only pick another. If "none" is a valid
  answer, add it as an option.
- A disabled radio is skipped by the arrow keys and keeps its selection visible.

## Content

- Labels are short noun phrases in sentence case, parallel in form ("Standard", "Express").
- The description adds the deciding fact (time, price), one line.
- With `danger`, the label must say what happens.

## Accessibility

- The shorthand `description` sits inside the label and is read with it. The composed
  `RadioButton.Description` sits outside; clicking it still selects the radio, but give it an `id`
  and point the radio's `aria-describedby` at it so it is announced.
- Name the group, not each radio: see [RadioButtonGroup](./radio-button-group.md).

## Do / Don't

```tsx
// Don't: a radio outside its group
<RadioButton value="annual" label="Annual billing" />
// Do
<RadioButtonGroup defaultValue="annual" aria-label="Billing period">
  <RadioButton value="annual" label="Annual billing" />
  <RadioButton value="monthly" label="Monthly billing" />
</RadioButtonGroup>
```

- Don't pass `checked` or `onCheckedChange` to a radio; selection is the group's `value`.
- Don't pass `label` and children together, or `description` without `label`.

## Gotchas

- `RadioButton` outside `RadioButtonGroup` (or `RadioButton.Group`) fails: the primitive needs the
  group's context.
- `RadioButton.Label` throws outside a `RadioButton`; it takes `htmlFor` from it.
- `className` lands on the radio circle, not on the row with the label.
- `ref` points at the radio control (`button` with `role="radio"`).
- DOM hooks: `data-slot="radio-button"`, `"radio-button-label"`, `"radio-button-description"`.

## API

Full props: `https://wideset.co/components/radio-button.md` · Types:
`packages/design-system/src/components/radio-button/RadioButton.types.ts`

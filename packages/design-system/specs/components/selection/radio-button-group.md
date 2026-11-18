---
name: RadioButtonGroup
import: import { RadioButton, RadioButtonGroup } from '@wideset/react'
group: selection
status: stable
parts: [RadioButtonGroup]
related: [RadioButton, CheckboxGroup, SegmentedControl, TileRadioGroup, Select]
docs: https://wideset.co/components/radio-button-group
storybook: form-radiobutton-radiobuttongroup--default
---

# RadioButtonGroup

> Owns a single selected value across a set of `RadioButton` options.

## When to use

- Every `RadioButton`. The group is mandatory: it holds the value, the keyboard model and the form
  `name`.

## When not to use

- Several options may be on at once → `CheckboxGroup`.
- A compact mode switch that applies immediately → `SegmentedControl`.
- Rich, card-like options → `Tile.RadioGroup` (same `value` / `onValueChange` contract).
- A long list → `Select`.

## Anatomy

```tsx
<FormField label="Payment method" WrapperComponent="fieldset" helperText="Select one option">
  <RadioButtonGroup aria-label="Payment method" defaultValue="card">
    <RadioButton value="card" label="Card" />
    <RadioButton value="bank-transfer" label="Bank transfer" />
  </RadioButtonGroup>
</FormField>
```

## Choosing props

| Prop                     | Value                     | Use for                                         |
| ------------------------ | ------------------------- | ----------------------------------------------- |
| `value` / `defaultValue` | an option's `value`       | controlled / uncontrolled selection             |
| `onValueChange`          | `(value: string) => void` | fires in both modes                             |
| `orientation`            | `vertical` (default)      | any label length, labels with descriptions      |
|                          | `horizontal`              | two or three short options with no descriptions |
| `disabled`               | `true`                    | the whole set is unavailable                    |
| `name` / `required`      |                           | native form submission and validation           |

## States

- No `defaultValue` means nothing is selected until the user picks; set one when there is a
  sensible default.
- `disabled` on the group disables every option and takes the set out of the tab order. To rule
  out one option, disable that `RadioButton` instead.

## Content

- The group label is the question ("Shipping", "When the project ends"); options are the answers.

## Accessibility

- The group renders `role="radiogroup"`. Name it with `aria-label` or `aria-labelledby`; inside
  `FormField` use `WrapperComponent="fieldset"` for a group of controls.
- The group is a single tab stop; the arrow keys move the selection.

## Do / Don't

```tsx
// Do: controlled, value typed as string
const [period, setPeriod] = useState('annual');
<RadioButtonGroup value={period} onValueChange={setPeriod} aria-label="Billing period">
  <RadioButton value="annual" label="Annual" />
  <RadioButton value="monthly" label="Monthly" />
</RadioButtonGroup>;
```

- Don't use numbers or booleans as `value`; values are strings. Map them yourself.
- Don't nest other interactive controls between the radios; keep the group a flat list.

## Gotchas

- `RadioButton.Group` is the same component; the named `RadioButtonGroup` works in Server
  Components.
- `onValueChange` receives a string, not an event.
- `className` goes on the group element; spacing between options is built in.
- DOM hook: `data-slot="radio-button-group"`.

## API

Full props: `https://wideset.co/components/radio-button-group.md` · Types:
`packages/design-system/src/components/radio-button/RadioButton.types.ts`

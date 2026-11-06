---
name: FormField
import: import { FormField } from '@wideset/react'
group: inputs
status: stable
parts: [FormField]
related: [TextInput, Textarea, Select, MultiSelect, ComboBox, FileUpload]
docs: https://wideset-docs.widelab.workers.dev/components/form-field
storybook: form-formfield--default
---

# FormField

> One labelled form field: a label, the control, and the helper or error text under it, wired
> together for screen readers.

## When to use

- Any form control that needs a visible label, a hint or a validation message: `TextInput`,
  `Textarea`, `Select`, `MultiSelect`, `ComboBox`, `DatePicker`, `FileUpload`.
- A labelled group of radios or checkboxes (`WrapperComponent="fieldset"`).

## When not to use

- A control whose own label is enough (a `Checkbox` or `Switch` with `label`) → the control's
  label prop.
- A search or filter field in a toolbar → `TextInput` with `aria-label`, no FormField.
- Feedback about the whole form (a failed save) → `InlineAlert` above the form.

## Anatomy

```tsx
<FormField
  label="Billing email"
  htmlFor="billing-email"
  required
  helperText="We send receipts here."
  errorText={error}
>
  <TextInput id="billing-email" name="email" required variant={error ? 'danger' : 'primary'} />
</FormField>
```

FormField renders the label, then the control you pass, then the helper or error text. The label
and the text are internal parts (`FieldLabel`, `HelperText`); they are not exported, so reach them
only through FormField's props.

## Choosing props

| Prop               | Value                        | Use for                                                                                         |
| ------------------ | ---------------------------- | ----------------------------------------------------------------------------------------------- |
| `label`            | ReactNode                    | Always. Short noun phrase.                                                                      |
| `htmlFor`          | the control's `id`           | Links the label to the control. Not generated: match it yourself.                               |
| `helperText`       | string                       | A hint the user needs before typing (format, limits, why).                                      |
| `errorText`        | string                       | The validation message. Replaces `helperText` while set.                                        |
| `required`         | boolean                      | Red asterisk after the label.                                                                   |
| `suffix`           | string                       | Quiet text after the label, such as "(optional)".                                               |
| `tooltip`          | ReactNode                    | Extra explanation behind an info icon next to the label.                                        |
| `aside`            | ReactNode                    | Quiet content at the far end of the label row.                                                  |
| `variant`          | `vertical` (default)         | Label above the control. Most forms, narrow columns, mobile.                                    |
|                    | `horizontal`                 | Label in a column beside the control, helper under the label. Settings pages with short values. |
| `WrapperComponent` | `div` (default) / `fieldset` | `fieldset` for a group of controls.                                                             |
| `helperTextId`     | string                       | Fix the helper/error id when you wire `aria-describedby` yourself.                              |

## States

- Helper: `helperText` under the control (under the label in `horizontal`).
- Error: `errorText` shows with an icon in its place; the helper comes back once you clear it.
- Warning: there is no warning state. Put an advisory in `helperText`.

Validation is yours; FormField shows the message. For a single child element it adds the helper
or error id to the control's `aria-describedby` (keeping ids already there) and sets
`aria-invalid` while `errorText` is set. The error text is a `role="alert"`, so a screen reader
announces it when it appears. The red look is not automatic: set `variant="danger"` on
the TextInput, Textarea, Select, MultiSelect or ComboBox. Show errors after blur or submit, not on
the first keystroke; `useShake` on the control flags a rejected submit with motion.

## Content

- Labels: sentence case, no colon, no "Enter…". Helper text: one sentence, a period at the end.
- Error text says how to fix it: "Enter an email address like name@company.com.", not "Invalid".
- One `variant` per form.

## Accessibility

- `required` only draws the asterisk. Set `required` (or `aria-required`) on the control too.
- `htmlFor` works for native controls, TextInput, Textarea, Select and MultiSelect (their `id`
  lands on the input or trigger). It does not reach `ComboBox`: give FormField an `id` (it lands on
  the label) and pass it to the ComboBox as `aria-labelledby`.
- With `fieldset`, the label is not a `<legend>`: also name the group (`aria-label` on
  `RadioButton.Group`).
- The `tooltip` icon is labelled "More information"; translate with `tooltipAriaLabel`.

## Do / Don't

```tsx
// Do: a group in a fieldset, named on the group itself
<FormField label="Payment method" WrapperComponent="fieldset" helperText="Pick one.">
  <RadioButton.Group aria-label="Payment method" defaultValue="card">
    <RadioButton value="card" label="Card" />
    <RadioButton value="bank-transfer" label="Bank transfer" />
  </RadioButton.Group>
</FormField>

// Don't: label not linked, red border with no reason
<FormField label="Email">
  <TextInput variant="danger" />
</FormField>

// Don't: several children; only a single element gets aria-describedby
<FormField label="Name" helperText="As on your ID.">
  <TextInput id="first" />
  <TextInput id="last" />
</FormField>
```

## Gotchas

- Props other than `className`, `variant`, `WrapperComponent`, the texts and `helperTextId` go to
  the label part, and HTML attributes among them (`htmlFor`, `id`, `data-*`) land on the
  `<label>`. Only `className` and the `ref` reach the root.
- The control is wired only when `children` is one element (not a Fragment). Wrap several
  controls and wire `aria-describedby` yourself with `helperTextId`.
- Composed `Select` (with `Select.Trigger`) drops the cloned `aria-describedby`; set it on
  `Select.Trigger`.
- `errorText` is a string; pass `''` or `undefined` to clear it.

## API

Full props: `https://wideset-docs.widelab.workers.dev/components/form-field.md` · Types:
`packages/design-system/src/components/form-field/FormField.types.ts`

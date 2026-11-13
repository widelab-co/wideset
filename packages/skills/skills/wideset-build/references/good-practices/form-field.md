# FormField

## When to use

- Any form control that needs a visible label, a hint or a validation message: `TextInput`,
  `Textarea`, `Select`, `MultiSelect`, `ComboBox`, `DatePicker`, `FileUpload`.
- A labelled group of radios or checkboxes (`WrapperComponent="fieldset"`).

## When not to use

- A control whose own label is enough (a `Checkbox` or `Switch` with `label`) → the control's
  label prop.
- A search or filter field in a toolbar → `TextInput` with `aria-label`, no FormField.
- Feedback about the whole form (a failed save) → `InlineAlert` above the form.

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

- Props other than `className`, `variant`, `WrapperComponent`, the texts, `helperTextId`,
  `suffix`, `tooltip`, `tooltipAriaLabel` and `aside` go to the label part, and HTML attributes
  among them (`htmlFor`, `id`, `data-*`) land on the `<label>`. Only `className` and the `ref`
  reach the root.
- The control is wired only when `children` is one element (not a Fragment). Wrap several
  controls and wire `aria-describedby` yourself with `helperTextId`.
- Composed `Select` (with `Select.Trigger`) drops the cloned `aria-describedby`; set it on
  `Select.Trigger`.
- `errorText` is a string; pass `''` or `undefined` to clear it.

---
name: TextInput
import: import { TextInput } from '@wideset/react'
group: inputs
status: stable
parts:
  [
    TextInput,
    TextInputPrefix,
    TextInputSuffix,
    TextInputInput,
    TextInputIcon,
    TextInputIconButton,
    TextInputButton,
    TextInputClearButton,
  ]
related: [Textarea, FormField, ComboBox, Select]
docs: https://wideset.co/components/text-input
storybook: form-textinput--default
---

# TextInput

> One line of free-form text: a name, an email, an amount, a URL, a search query.

## When to use

- The user types a short value that has no fixed list of answers.
- A search or filter field: compose `TextInput.Prefix inner` with `TextInput.Icon`,
  `TextInput.Input type="search"` and `TextInput.Suffix inner` with `TextInput.ClearButton`; this
  replaces `Search`.
- A value with fixed text around it (`https://`, `.com`, a currency or unit) → affixes.

## When not to use

- Several lines of text (comments, descriptions) → `Textarea`.
- One value from a known list → `Select`; from a long list the user filters by typing →
  `ComboBox`.
- Several values from a list → `MultiSelect`.
- A date → `DatePicker`.
- A field with a visible label and helper or error text → wrap it in `FormField`; TextInput
  draws only the control.

## Anatomy

Standalone, `<TextInput />` renders its own input. Composed:

```tsx
<TextInput value={query} onChange={(event) => setQuery(event.target.value)}>
  <TextInput.Prefix inner>
    <TextInput.Icon icon={RiSearchLine} />
  </TextInput.Prefix>
  <TextInput.Input type="search" placeholder="Search invoices" aria-label="Search invoices" />
  <TextInput.Suffix inner>
    <TextInput.ClearButton />
  </TextInput.Suffix>
</TextInput>
```

- `TextInput.Prefix` / `TextInput.Suffix`: leading / trailing affix. Without `inner` it is a
  boxed segment with a divider, for fixed text (`https://`, `$`, `.com`). With `inner` it sits
  inside the frame, for an icon or an icon button.
- `TextInput.Icon`: decorative icon in an affix. `TextInput.IconButton`: icon-only action.
  `TextInput.Button`: text action. `TextInput.ClearButton`: empties the field.
- `TextInput.Input`: the `<input>`. Required when composing; one per field.

## Choosing props

| Prop      | Value               | Use for                                                                    |
| --------- | ------------------- | -------------------------------------------------------------------------- |
| `preset`  | `border` (default)  | A field on the page or in a form.                                          |
|           | `ghost`             | A field inside a surface that already has a frame (toolbar, table header). |
| `variant` | `primary` (default) | Every field.                                                               |
|           | `danger`            | The value failed validation. Also sets `aria-invalid` on the input.        |
| `size`    | `md` (default)      | Forms.                                                                     |
|           | `sm`                | Dense tables and filter bars.                                              |
|           | `lg`                | A short form that is the main task of the page.                            |
| `inner`   | on Prefix / Suffix  | Puts the affix inside the frame (icons, icon buttons).                     |

State: `value` + `onChange` (controlled), or nothing (uncontrolled, starts empty). There is no
`defaultValue`: to start with a value, control it.

## States

- Disabled: not focusable, skipped by Tab. Keep it only when the user can tell why.
- Danger: switch to it after the user leaves the field or submits, never while typing the first
  characters. Put the reason in `FormField`'s `errorText`.
- `TextInput.ClearButton` shows only while the field holds a value; it hides when the field is
  empty, disabled or `readOnly`. After clearing, focus returns to the input.
- To flag a rejected submit, `useShake` gives a `ref` for the field and a `shake()` to call.

## Content

- Placeholder is an example or a hint ("name@company.com"), never the label.
- Affix text is short and fixed: a protocol, a domain, a unit, a currency.
- One `size` per form; match the buttons and selects beside the field.

## Accessibility

- Every field needs a name: `FormField` with `htmlFor` matching the input `id`, or `aria-label`.
- `TextInput.IconButton` needs `aria-label`. `TextInput.ClearButton` defaults to "Clear";
  translate it with `aria-label`.
- `TextInput.Icon` is hidden from screen readers.
- Use `type="search"` on a search field: it is announced as search and gets a search key on
  mobile keyboards.

## Do / Don't

```tsx
// Do: a labelled field with an error
<FormField label="Email" htmlFor="email" errorText={error}>
  <TextInput id="email" variant={error ? 'danger' : 'primary'} />
</FormField>

// Don't: danger without a reason, or a placeholder used as the label
<TextInput variant="danger" placeholder="Email" />
```

- Don't use the deprecated `Search`; compose the search field from `TextInput`.
- Don't put an icon in an affix without `inner`; boxed affixes are for text.

## Gotchas

- Props split by target: `className` styles the outer frame; every other prop (`id`, `name`,
  `placeholder`, `aria-*`, `data-*`, the `ref`) goes to the `<input>`. A prop set on
  `TextInput.Input` wins over the same prop on the root.
- `onChange` receives the change event, not a string (unlike `ComboBox`).
- `TextInput.ClearButton`: `onClick` runs before clearing (call `event.preventDefault()` to keep
  the value); `onClear` runs after `onChange` has seen the empty value. Validate in `onChange`.
- Composing without `TextInput.Input` renders no input.
- `defaultMotion={false}` turns off focus and shake animations for this field.

## API

Full props: `https://wideset.co/components/text-input.md` · Types:
`packages/design-system/src/components/text-input/TextInput.types.ts`

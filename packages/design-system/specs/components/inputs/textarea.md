---
name: Textarea
import: import { Textarea } from '@wideset/react'
group: inputs
status: stable
parts: [Textarea]
related: [TextInput, FormField]
docs: https://wideset.co/components/textarea
storybook: form-textarea--default
---

# Textarea

> Free-form text that may run over several lines: a comment, a description, a message.

## When to use

- The answer is a sentence or more and the user may press Enter for a new line.

## When not to use

- One line of text (a name, an email, a search) → `TextInput`.
- Rich text with formatting: Textarea has no formatting bar; there is no Wideset rich-text
  editor.
- A label, hint or error around the field → wrap it in `FormField`; Textarea draws only the
  control.

## Anatomy

```tsx
<FormField label="Comment" htmlFor="comment" helperText="Up to 500 characters.">
  <Textarea id="comment" rows={4} maxLength={500} />
</FormField>
```

One element. Native `<textarea>` props (`rows`, `maxLength`, `name`, `value`, `defaultValue`,
`onChange`, `placeholder`) reach the textarea itself.

## Choosing props

| Prop      | Value                | Use for                                               |
| --------- | -------------------- | ----------------------------------------------------- |
| `variant` | `primary` (default)  | Every field.                                          |
|           | `danger`             | The text failed validation. Also sets `aria-invalid`. |
| `size`    | `md` (default)       | Forms.                                                |
|           | `sm`                 | Dense panels and inline comments.                     |
|           | `lg`                 | A form where writing is the main task.                |
| `resize`  | `vertical` (default) | The user can drag the corner to make it taller.       |
|           | `none`               | Fixed layouts (a chat composer, a table cell).        |
|           | `horizontal`, `both` | Rarely; widening breaks most form columns.            |
| `rows`    | number               | Starting height. Independent of `size`.               |

State: native, so both modes work: `value` + `onChange`, or `defaultValue`.

## States

- Disabled: not focusable, skipped by Tab. Keep it only when the user can tell why.
- Danger: only from `variant="danger"`. An empty `required` field is not styled as an error on
  its own; switch to danger after blur or submit and put the reason in `errorText`.
- Text longer than `rows` scrolls inside the field.
- To flag a rejected submit, `useShake` gives a `ref` for the textarea and a `shake()` to call.

## Content

- Say the limit in `helperText` ("Up to 500 characters."); there is no built-in counter.
- Placeholder is a hint, never the label.

## Accessibility

- Name the field: `FormField` with `htmlFor` matching the textarea `id`, or `aria-label`.
- `danger` sets `aria-invalid`; screen reader users still need the reason, which `FormField`
  links with `aria-describedby`.

## Do / Don't

```tsx
// Do
<FormField label="Reason" htmlFor="reason" errorText="Tell us why you are leaving.">
  <Textarea id="reason" variant="danger" required />
</FormField>

// Don't: a one-line value in a textarea
<Textarea rows={1} placeholder="Email" />
```

- Don't mix sizes between Textarea and the TextInputs in the same form.

## Gotchas

- `className` styles the outer frame; `contentClassName` styles the `<textarea>`. All other props
  and the `ref` go to the `<textarea>`.
- There is no `preset` (no `ghost`), unlike TextInput.
- Passing `cols` makes the field size to its columns instead of filling the width.
- An explicit `aria-invalid` prop wins over the one `danger` sets.

## API

Full props: `https://wideset.co/components/textarea.md` · Types:
`packages/design-system/src/components/textarea/Textarea.types.ts`

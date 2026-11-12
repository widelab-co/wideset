# Select

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

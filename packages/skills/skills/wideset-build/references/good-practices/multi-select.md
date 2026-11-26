# MultiSelect

## When to use

- Several answers from a list too long to show in full: markets, teams, tags on a filter.
- A filter in a toolbar or table header (`preset="ghost"`, `size="sm"`).

## When not to use

- Exactly one value → `Select`.
- A short list (up to about six) that should stay visible → `Checkbox.Group`.
- Values the user types that are not in a list → `ComboBox` (one value) or a `TextInput`.
- Commands, not values → `DropdownMenu`.

## Do / Don't

```tsx
// Do: a fixed-height filter that summarises past two choices
<MultiSelect options={teams} maxVisibleTags={2} multiValuesLabel="teams" preset="ghost" size="sm" aria-label="Teams" />

// Don't: four always-relevant options hidden in a dropdown
<MultiSelect options={[{ value: 'email', label: 'Email' }, { value: 'sms', label: 'SMS' }]} />
```

## Gotchas

- MultiSelect is built on `DropdownMenu`, not on a form element. `name` lands on the trigger
  button; the selected values are not submitted with a native form. Read them from state.
- `onValueChange` receives the whole new array, not the toggled value.
- `preset="ghost"` shows its arrow only while the field is hovered, keyboard-focused or open
  (always on touch screens), like a ghost `Select`.
- In composed mode the root passes only `open`, `onOpenChange` and `modal`. `value`,
  `onValueChange`, `disabled`, `options`, `variant` and the rest do nothing; each
  `MultiSelect.Option` needs `option`, `isSelected`, `isDisabled` and `onSelect` from you, and
  `MultiSelect.Content` needs `shouldUsePrimitive={false}`.
- `MultiSelect.Value` is driven entirely by props (`selectedOptions`, `areTagsVisible`, …); it
  is for rebuilding the trigger, not for reading the value.
- The list portals to `document.body`; pass `portalContainer` only for a custom stacking root.

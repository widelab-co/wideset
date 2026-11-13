---
name: Search
import: import { Search } from '@wideset/react'
group: inputs
status: deprecated
parts: [Search]
related: [TextInput]
docs: https://wideset.co/components/search
storybook: components-search--default
---

# Search

> Deprecated: compose the search field from `TextInput` instead. Search stays exported until a
> future minor release removes it.

## When to use

- Never in new code. Search is a thin wrapper over `TextInput` with no behaviour of its own.

## When not to use

- Any search or filter field → compose `TextInput` with `TextInput.Input type="search"`.
- Search inside a `Select` list → `hasSearch` on `Select` / `MultiSelect`, or `Select.Search`.
- Search that suggests or picks from a list as the user types → `ComboBox`.

## Anatomy

The replacement, a composed `TextInput`:

```tsx
<TextInput value={query} onChange={(event) => setQuery(event.target.value)}>
  <TextInput.Prefix inner>
    <TextInput.Icon icon={RiSearchLine} />
  </TextInput.Prefix>
  <TextInput.Input type="search" placeholder="Search invoices" aria-label="Search invoices" />
  <TextInput.Suffix inner>
    <TextInput.ClearButton onClear={handleClear} />
  </TextInput.Suffix>
</TextInput>
```

## Choosing props

Each Search prop and where it goes in the composition:

| Search                                                       | TextInput composition                                                                     |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `preset`, `size`, `variant`, `value`, `onChange`, `disabled` | Same props on `TextInput`.                                                                |
| `showClearButton={false}`                                    | Leave out the `TextInput.Suffix` with the clear button.                                   |
| `onClear`                                                    | `onClear` on `TextInput.ClearButton`.                                                     |
| `clearAriaLabel`                                             | `aria-label` on `TextInput.ClearButton` (default "Clear").                                |
| `[data-slot=search]`                                         | Root is now `text-input`; pass `data-slot="search"` to `TextInput` to keep old selectors. |

## Gotchas

- Search defaults to `preset="border"`, the same as TextInput, so the look does not change.
- Keep `type="search"` on `TextInput.Input`: it is what Search set, and it gives the search
  semantics and the mobile search key.

## API

Full props: `https://wideset.co/components/search.md` · Types:
`packages/design-system/src/components/search/Search.types.ts`

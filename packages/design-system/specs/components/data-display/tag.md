---
name: Tag
import: import { Tag } from '@wideset/react'
group: data-display
status: stable
parts: [Tag, TagIcon]
related: [StatusBadge, Chip, Avatar]
docs: https://wideset-docs.widelab.workers.dev/components/tag
storybook: components-tag--default
---

# Tag

> A static, colour-coded label that says which category something belongs to.

## When to use

- Categories, teams, topics, projects on a record, in a table cell or on a card.
- A fixed set of labels where each label keeps one colour everywhere.

## When not to use

- A state with a judgement (Paid, Overdue, Failed) → `StatusBadge`.
- A label the user clicks, toggles or removes (filters, selected values) → `Chip`.
- A person → `Avatar`.
- A count → `Count` (`Tabs.Count` on a tab).

See `README.md` in this folder for Tag vs StatusBadge vs Chip.

## Anatomy

```tsx
<Tag color="blue">
  <Tag.Icon icon={RiCodeLine} />
  {/* optional, leading */}
  Engineering
</Tag>
```

`TagIcon` is the named export of `Tag.Icon`.

## Choosing props

| Prop       | Value                                                                                                                       | Use for                                                   |
| ---------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `color`    | `brand` (default), `red`, `pink`, `violet`, `purple`, `indigo`, `blue`, `cyan`, `teal`, `green`, `lime`, `yellow`, `orange` | One hue per category. Categorical, not semantic.          |
|            | `secondary`                                                                                                                 | Neutral fallback ("Other").                               |
| `preset`   | `filled` (default)                                                                                                          | Tags that should stand out in lists and cards.            |
|            | `border`                                                                                                                    | Long rows of tags or busy layouts.                        |
| `size`     | `md` (default) / `sm` / `lg`                                                                                                | `sm` in dense lists, `lg` beside large text; one per row. |
| `shape`    | `square` (default) / `rounded`                                                                                              | Square lines up with inputs and cells; one per product.   |
| `truncate` | `true`                                                                                                                      | Long labels in a constrained width; ellipsis.             |
| `iconOnly` | `true`                                                                                                                      | Square tag with just the icon; needs hidden text.         |

## Content

- One or two words, sentence case, a noun: "Design", "Q3 launch".
- Fix a colour map for your categories and reuse it; never pick colours at random per render.
- `red`, `green`, `yellow` here mean only "this category's hue"; if the user should read
  good/bad/warning, use `StatusBadge`.

## Accessibility

- Tag is a `div` with plain text; it is not focusable and has no role.
- `Tag.Icon` is hidden from screen readers. An `iconOnly` tag needs its name in a `sr-only` span.
- Colour alone never carries meaning; the label does.

## Do / Don't

```tsx
// Do: icon-only with a hidden name
<Tag iconOnly>
  <Tag.Icon icon={RiFlashlightFill} />
  <span className="sr-only">Quick win</span>
</Tag>

// Don't: a status as a Tag
<Tag color="green">Paid</Tag>                 // → <StatusBadge color="positive">Paid</StatusBadge>

// Don't: an onClick on a Tag
<Tag onClick={removeFilter}>Design</Tag>      // → Chip
```

- Don't mix `filled` and `border`, or `square` and `rounded`, in one list.

## Gotchas

- `Tag.Icon` takes the component (`icon={RiCodeLine}`), not an element.
- `Tag.Icon` throws outside `<Tag>`; it reads `size` and `color` from it.
- Without `truncate` the label never wraps (`nowrap`) and can overflow a narrow cell.
- `color` is omitted from the HTML attributes; it is the variant, not a CSS colour.

## API

Full props: `https://wideset-docs.widelab.workers.dev/components/tag.md` · Types:
`packages/design-system/src/components/tag/Tag.types.ts`

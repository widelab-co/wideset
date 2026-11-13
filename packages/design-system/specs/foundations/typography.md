# Typography

Text is set with one `typography-*` class that applies size, line height, letter spacing and
weight together; it never sets the font family. The product scale is flat: most UI text sits
between 0.75rem and 1.125rem, and hierarchy comes from weight (`-strong-`) and colour
(`text-ws-static-*`), not from bigger sizes.

Docs: `https://wideset.co/docs/typography` · Source:
`packages/design-system/src/styles/utilities/typography.css`

## Classes

Size and line height are `text-ws-*` / `leading-ws-*` tokens (rem in brackets).

| Class                         | Size / leading           | Weight          | Use for                                                    |
| ----------------------------- | ------------------------ | --------------- | ---------------------------------------------------------- |
| `typography-title-lg`         | ws-1800 / ws-1800 (4.5)  | medium          | Marketing-scale hero; rare in product UI                   |
| `typography-title-md`         | ws-1400 / ws-1200 (3.5)  | medium          | Large display heading                                      |
| `typography-title-sm`         | ws-1200 / ws-1200 (3)    | medium          | Display heading, empty-state hero                          |
| `typography-subtitle-lg`      | ws-800 / ws-1000 (2)     | medium          | Page title on a dashboard-style page                       |
| `typography-subtitle-md`      | ws-600 / ws-800 (1.5)    | medium          | Page title, modal title                                    |
| `typography-subtitle-sm`      | ws-500 / ws-700 (1.25)   | medium          | Section heading, card title                                |
| `typography-subtitle-xs`      | ws-450 / ws-600 (1.125)  | medium          | Sub-section heading                                        |
| `typography-label-{lg,md,sm}` | 1.125 / 1 / 0.875        | normal          | Control text: field values, menu items, tabs               |
| `typography-label-strong-*`   | same as label            | medium          | Emphasised control text: buttons, active item, field label |
| `typography-body-lg`          | ws-400 / ws-600 (1)      | normal          | Long-form reading                                          |
| `typography-body-md`          | ws-350 / ws-500 (0.875)  | normal          | Default paragraph and description text                     |
| `typography-body-sm`          | ws-300 / ws-400 (0.75)   | normal          | Dense secondary text                                       |
| `typography-body-strong-*`    | same as body             | semibold        | Inline emphasis inside body text                           |
| `typography-number-{lg..xs}`  | 1.125 / 1 / 0.875 / 0.75 | normal          | Figures in tables, stats, counters                         |
| `typography-number-strong-*`  | same as number           | medium          | Key figures, totals                                        |
| `typography-caption-md`       | ws-300 / ws-400 (0.75)   | normal          | Helper text, timestamps, metadata                          |
| `typography-caption-sm`       | ws-250 / ws-400 (0.625)  | normal, wide-25 | Smallest annotation; use sparingly                         |
| `typography-caption-strong-*` | same as caption          | medium          | Badges, counters, short tags                               |

Most used by the components themselves: `label-strong-sm`, `label-sm`, `body-md`,
`caption-md`. Match those when you place text next to a component.

## Selection rules

- Pick by role, not by size: a button-like label is `label-*`, running text is `body-*`, a
  heading is `subtitle-*` or `title-*`, a figure is `number-*`.
- Raise importance with `-strong-` or a stronger colour before reaching for a larger size.
  Text colours: `text-ws-static-strong` (headings, primary), `text-ws-static-base` (body),
  `text-ws-static-subtle` (secondary, metadata).
- In product screens a page title is usually `typography-subtitle-md` or `-lg`; `title-*` is a
  display size.
- Semantic HTML still decides the outline: `<h2 className="typography-subtitle-sm">`. The class
  is visual only.
- Components set their own text. Do not pass `typography-*` into a component's `className` to
  resize it; use its `size` prop.

```tsx
<section className="gap-ws-3 flex flex-col">
  <h2 className="typography-subtitle-sm text-ws-static-strong">Billing</h2>
  <p className="typography-body-md text-ws-static-subtle">Changes save automatically.</p>
</section>
```

## Font family

Wideset loads no font. Components inherit the font on `body`; the package defines
`--font-ws-sans` (Inter, then the system stack). Apply it once:

```css
body {
  font-family: var(--font-ws-sans);
}
```

`font-ws-heading` and `font-ws-body` (both resolve to `--font-ws-sans`) pin Wideset's stack on
an element when the page uses another font. Weights are Figma's exact values
(`font-ws-normal` 480, `font-ws-medium` 520, `font-ws-semibold` 545): load a variable font
(Inter Variable), or a static family rounds 520 to a visibly heavier cut.

`font-ws-mono` (`--font-ws-mono`: Geist Mono, then the system monospace stack) is for code,
terminals and diffs. The page loads Geist Mono; without it the system monospace font shows.

## Tracking

Letter spacing is built into each class: large sizes are tighter (`tracking-ws-tight-300` on
`title-lg`), small sizes are neutral or slightly wider (`tracking-ws-wide-25` on `caption-sm`).
Do not add tracking on top of a `typography-*` class.

## Banned

- Tailwind's scale: `text-sm`, `text-lg`, `font-medium`, `leading-6`, `tracking-tight`. They
  do not match Wideset's values.
- Assembling a style from parts (`text-ws-350 leading-ws-500 font-ws-medium`) when a
  `typography-*` class exists for that role.
- Setting `font-family` on a component to emphasise text; emphasis is weight and colour.

## Light and dark

Type tokens do not change with the theme. Only the text colour classes flip under `.dark`.

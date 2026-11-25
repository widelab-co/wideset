# Typography

Text is set with one `typography-*` class that applies size, line height, letter spacing and
weight together; it never sets the font family. The product scale is flat: most UI text sits
between 0.75rem and 1.125rem, and hierarchy comes from weight (`-strong-`) and colour
(`text-ws-static-*`), not from bigger sizes.

Docs: `https://wideset.co/docs/typography` · Source:
`packages/design-system/src/styles/utilities/typography.css`

## Classes

Size and line height are `text-ws-*` / `leading-ws-*` tokens (rem in brackets).

| Class                         | Size / leading           | Weight          | Use for                                                            |
| ----------------------------- | ------------------------ | --------------- | ------------------------------------------------------------------ |
| `typography-title-lg`         | ws-1000 / ws-1200 (2.5)  | medium          | The one figure a page is about (a balance)                         |
| `typography-title-md`         | ws-800 / ws-1000 (2)     | medium          | **Main heading of the whole page**; sign-in titles; KPI figures    |
| `typography-title-sm`         | ws-600 / ws-800 (1.5)    | medium          | Heading of a large part of a page; a page heading in a tight place |
| `typography-subtitle-md`      | ws-500 / ws-700 (1.25)   | medium          | Side panel title                                                   |
| `typography-subtitle-sm`      | ws-450 / ws-600 (1.125)  | medium          | Modal, pop-up and status modal titles                              |
| `typography-subtitle-xs`      | ws-400 / ws-600 (1)      | medium          | **Card and page section title** (16px), as `Card.Title`            |
| `typography-label-{lg,md,sm}` | 1.125 / 1 / 0.875        | normal          | Control text: field values, menu items, tabs                       |
| `typography-label-strong-*`   | same as label            | medium          | Emphasised control text: buttons, active item, field label         |
| `typography-body-lg`          | ws-400 / ws-600 (1)      | normal          | Long-form reading                                                  |
| `typography-body-md`          | ws-350 / ws-500 (0.875)  | normal          | Default paragraph and description text                             |
| `typography-body-sm`          | ws-300 / ws-400 (0.75)   | normal          | Dense secondary text                                               |
| `typography-body-strong-*`    | same as body             | semibold        | Inline emphasis inside body text                                   |
| `typography-number-{lg..xs}`  | 1.125 / 1 / 0.875 / 0.75 | normal          | Figures in tables, stats, counters                                 |
| `typography-number-strong-*`  | same as number           | medium          | Key figures, totals                                                |
| `typography-caption-md`       | ws-300 / ws-400 (0.75)   | normal          | Helper text, timestamps, metadata                                  |
| `typography-caption-sm`       | ws-250 / ws-400 (0.625)  | normal, wide-25 | Smallest annotation; use sparingly                                 |
| `typography-caption-strong-*` | same as caption          | medium          | Badges, counters, short tags                                       |

Most used by the components themselves: `label-strong-sm`, `label-sm`, `body-md`,
`caption-md`. Match those when you place text next to a component.

## Selection rules

- Pick by role, not by size: a button-like label is `label-*`, running text is `body-*`, the
  headings and figures a page is organised around are `title-*`, the title of a card, section or
  dialog is `subtitle-*`, a figure in running UI is `number-*`.
- Raise importance with `-strong-` or a stronger colour before reaching for a larger size.
  Text colours: `text-ws-static-strong` (headings, primary), `text-ws-static-base` (body),
  `text-ws-static-subtle` (secondary, metadata).
- A title's size follows its container and the free space around it: the tighter the
  container, the smaller the title; the more empty space, the larger it works. Subtitles stay
  one step above the content they open and never compete with the page heading.

| Container                                                     | Free space | Title                                                           |
| ------------------------------------------------------------- | ---------- | --------------------------------------------------------------- |
| The whole page                                                | most       | `title-md` 32 (the one figure the page is about: `title-lg` 40) |
| A roomy, mostly empty container: empty state, sign-in/sign-up | a lot      | `title-md` 32 or `title-sm` 24                                  |
| A large part of a page, a wide panel                          | plenty     | `title-sm` 24                                                   |
| A side panel (narrow, at the edge)                            | less       | `subtitle-md` 20                                                |
| A modal, a pop-up, a status modal                             | little     | `subtitle-sm` 18                                                |
| A card, a page section, a toolbar group                       | tight      | `subtitle-xs` 16                                                |
| A list row, a table header, a menu item                       | tightest   | the text size, weight up: `label-strong-sm` 14                  |

- A page title in a tight bar (a toolbar, a step header) takes the size of that bar's space
  (`title-sm`), not the page default. The figures of a KPI row are `title-md tabular-nums`.
- The components set their own titles (`Card.Title`, `Modal.Title`, `Sidepanel.Title`); use the
  same class for a heading in the same kind of container outside them.

### Naming traps

The names do not say the size, so never guess it from the name:

- `title-*` means titles: the page's headings and key figures, 24–40px. `subtitle-*` is the
  title of a card, section or dialog, 16–20px. There is no display size above 40px.
- The size suffix means a different size in each family: `title-sm` is 24px, `subtitle-md` 20px,
  `label-md` 16px, `body-md` 14px, `caption-md` 12px. Read the table above.
- `-strong-` is weight 520 everywhere except `body-strong-*`, which is 545 (semibold).
- Same size, different job: `label-sm` (one line in a control or row) and `body-md` (text that
  wraps) are both 14px; pick by whether the text wraps.
- Semantic HTML still decides the outline: `<h2 className="typography-subtitle-xs">`. The class
  is visual only.
- Components set their own text. Do not pass `typography-*` into a component's `className` to
  resize it; use its `size` prop.

```tsx
<section className="gap-ws-3 flex flex-col">
  <h2 className="typography-subtitle-xs text-ws-static-strong">Billing</h2>
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

`font-ws-mono` (`--font-ws-mono`: IBM Plex Mono, then the system monospace stack) is for code,
terminals and diffs. Load IBM Plex Mono on the page yourself, as with Inter; without it the
system monospace font shows.

## Tracking

Letter spacing is built into each class: large sizes are tighter (`tracking-ws-tight-200` on
`title-lg` and `title-md`), small sizes are neutral or slightly wider (`tracking-ws-wide-25` on
`caption-sm`). Do not add tracking on top of a `typography-*` class.

## Banned

- Tailwind's scale: `text-sm`, `text-lg`, `font-medium`, `leading-6`, `tracking-tight`. They
  do not match Wideset's values.
- Assembling a style from parts (`text-ws-350 leading-ws-500 font-ws-medium`) when a
  `typography-*` class exists for that role.
- Setting `font-family` on a component to emphasise text; emphasis is weight and colour.

## Light and dark

Type tokens do not change with the theme. Only the text colour classes flip under `.dark`.

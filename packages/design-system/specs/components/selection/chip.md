---
name: Chip
import: import { Chip } from '@wideset/react'
group: selection
status: stable
parts: [Chip, ChipIcon]
related: [Tag, StatusBadge, FilterButton, Button, SegmentedControl]
docs: https://wideset.co/components/chip
storybook: components-chip--default
---

# Chip

> A small clickable label for toggling a filter, showing an applied value, or removing it.

## When to use

- A row of quick filters the user toggles on and off ("Remote only", "Full time").
- Applied values the user can remove with one click ("Warsaw ×").
- Suggestions the user can apply with one click.

## When not to use

- A descriptive label with no action → `Tag`.
- A status of a record → `StatusBadge`.
- A filter that opens a list of options → `FilterButton`.
- A primary or form action → `Button`.
- Exactly one of a few views → `SegmentedControl`.

## Anatomy

```tsx
import { RiCloseLine, RiMapPinLine } from '@remixicon/react';

<Chip variant="secondary">
  <Chip.Icon icon={RiMapPinLine} />
  Warsaw
</Chip>

// Removable: the whole chip is the button
<Chip aria-label="Remove Warsaw" onClick={() => remove('warsaw')}>
  Warsaw
  <Chip.Icon icon={RiCloseLine} />
</Chip>
```

`Chip.Icon` and `ChipIcon` are the same component; place it before or after the label.

## Choosing props

| Prop       | Value               | Use for                                                      |
| ---------- | ------------------- | ------------------------------------------------------------ |
| `variant`  | `primary` (default) | brand emphasis: selected filters, values just applied        |
|            | `secondary`         | quieter: suggestions, supporting metadata                    |
| `style`    | `filled` (default)  | reads as selected, more weight                               |
|            | `border`            | light, for rows of unselected options                        |
| `size`     | `md` (default)      | most rows                                                    |
|            | `sm`                | dense filter bars, table cells                               |
|            | `lg`                | more presence, bigger touch target                           |
| `disabled` | `true`              | an option temporarily unavailable (a filter with no results) |

Chips in one row share a size. Switching `style` (or `variant`) is how a row shows which chips are
on.

## States

- Default, hover, pressed, keyboard focus, disabled. There is no built-in selected state: selected
  is whatever `style` / `variant` you pass.

## Content

- One to three words, sentence case, no trailing punctuation.
- A removable chip shows the value, not "Remove …"; the action goes in `aria-label`.

## Accessibility

- A chip is announced as a button and activates with Enter or Space; always give it an `onClick`.
- For a toggling filter, set `aria-pressed` to the on/off state.
- Icons are decorative. A removable chip needs an accessible name that says so:
  `aria-label="Remove Warsaw"`.
- `disabled` sets `aria-disabled` and takes the chip out of the tab order.

## Do / Don't

```tsx
// Do: a toggle filter that shows and announces its state
<Chip style={remote ? 'filled' : 'border'} aria-pressed={remote} onClick={() => setRemote(!remote)}>
  Remote only
</Chip>
```

- Don't put an `IconButton` or any other control inside a chip (nested interactive controls); the
  whole chip removes, with a trailing `Chip.Icon`.
- Don't use a chip as a read-only label → `Tag`.

## Gotchas

- `style` is a variant (`'filled' | 'border'`), not the HTML style attribute; inline styles are not
  accepted.
- The root is a `div` with `role="button"`, not a `<button>`: it never submits a form.
- `disabled` blocks clicks and keys; your `onClick` will not fire.
- DOM hooks: `data-slot="chip"`, `"chip-icon"`.

## API

Full props: `https://wideset.co/components/chip.md` · Types:
`packages/design-system/src/components/chip/Chip.types.ts`

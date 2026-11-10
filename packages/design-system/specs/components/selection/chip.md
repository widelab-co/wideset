---
name: Chip
import: import { Chip } from '@wideset/react'
group: selection
status: stable
parts: [Chip, ChipAction, ChipLabel, ChipIcon, ChipIconButton]
related: [Tag, StatusBadge, FilterButton, Button, SegmentedControl]
docs: https://wideset-docs.widelab.workers.dev/components/chip
storybook: components-chip--default
---

# Chip

> A compact label with an optional main action and independent removal button.

Chip supplies appearance and native button interactions. Consumers supply `onClick` handlers and
manage selection, filter updates, and removal in application state; neither button has a built-in
application action.

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
import { RiMapPinLine } from '@remixicon/react';

<Chip variant="secondary">
  <Chip.Action onClick={editFilter}>
    <Chip.Icon icon={RiMapPinLine} />
    <Chip.Label>Warsaw</Chip.Label>
  </Chip.Action>
  <Chip.IconButton aria-label="Remove Warsaw" onClick={() => remove('warsaw')} />
</Chip>

// Removal only: the label is passive
<Chip>
  <Chip.Label>Warsaw</Chip.Label>
  <Chip.IconButton aria-label="Remove Warsaw" onClick={() => remove('warsaw')} />
</Chip>
```

Place the decorative `Chip.Icon` before `Chip.Label`. When the label has an action, wrap both in
`Chip.Action`. The optional `Chip.IconButton` follows as a sibling, never inside the main button.
When Action is present, it fills the chip and the removal button is overlaid at the trailing edge.
The removal button's own box activates removal; the space beyond it belongs to the main action.
Without Action, the label stays passive and the removal button uses the normal inline layout.
Every part is also exported by name (`ChipAction`, `ChipLabel`, `ChipIcon`, `ChipIconButton`).

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

- The root is passive. `Chip.Action` and `Chip.IconButton` are separate native buttons, each
  activated with Enter or Space and reached independently with Tab.
- For a toggling filter, set `aria-pressed` on `Chip.Action` to the on/off state.
- Leading icons are decorative. The removal button needs an accessible name that says so:
  `aria-label="Remove Warsaw"`.
- `disabled` on Chip disables both buttons through their native attributes. Each button can also
  be disabled independently.
- After removing a chip, the consumer should move keyboard focus to a suitable remaining control,
  such as the next removal button or a reset control. Removing a focused item otherwise loses focus.

## Do / Don't

```tsx
// Do: a toggle filter that shows and announces its state
<Chip style={remote ? 'filled' : 'border'}>
  <Chip.Action aria-pressed={remote} onClick={() => setRemote(!remote)}>
    <Chip.Label>Remote only</Chip.Label>
  </Chip.Action>
</Chip>
```

- Don't nest `Chip.IconButton` or another interactive control inside `Chip.Action`; the main
  action and removal button are siblings.
- Don't use a chip as a read-only label → `Tag`.

## Gotchas

- `style` is a variant (`'filled' | 'border'`), not the HTML style attribute; inline styles are not
  accepted.
- The root ref points to an `HTMLDivElement`. Action and IconButton refs point to native buttons;
  Label's ref points to a span.
- Both buttons default to `type="button"`; set `type="submit"` on a button explicitly if needed.
- Appearance and motion are configured on Chip. Both buttons inherit the root's motion setting;
  IconButton also inherits its size and colors instead of exposing separate appearance props.
- Click handlers belong on the individual buttons. Removal calls the consumer's handler; Chip
  does not remove itself or choose where focus moves afterward.
- DOM hooks: `data-slot="chip"`, `"chip-action"`, `"chip-label"`, `"chip-icon"`,
  `"chip-icon-button"`.

## API

Full props: `https://wideset-docs.widelab.workers.dev/components/chip.md` · Types:
`packages/design-system/src/components/chip/Chip.types.ts`

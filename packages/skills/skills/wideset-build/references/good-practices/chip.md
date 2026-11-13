# Chip

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

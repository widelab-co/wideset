# Card

## When to use

- A preview or summary of one thing: a report, a project, a metric.
- A section of a dashboard or settings page that needs its own frame.
- Cards in a grid, each with the same structure.

## When not to use

- The whole surface is one link or action → `ActionTile`.
- The user picks one or several cards as a choice → `Tile` (`TileRadioGroup`, `TileCheckbox`).
- Page layout wrapper around everything → plain layout classes on a `div` (see
  `patterns/app-shell.md`).
- Detail that opens over the page → `Sidepanel`; a decision that blocks the flow → `Modal`.
- Collapsible sections → `Accordion`.

## Do / Don't

```tsx
// Do: heading level that fits the page
<Card.Title asChild><h2>Monthly revenue</h2></Card.Title>

// Don't: a card made clickable with onClick — no keyboard, no role
<Card onClick={open}>…</Card>          // → ActionTile with href or onClick

// Don't: Card as the page frame
<Card><Sidebar />…</Card>
```

- Don't nest bordered cards; inner groups use `variant="flat"` or plain layout.
- Don't put a `Divider` between header and content; the bordered card draws it.

## Gotchas

- `Card.Header` stacks its children vertically. To put `Card.Action` beside the title, wrap
  title + description and the action in your own `flex` row.
- `Card.Content` is a scroll area: `className` goes to the scroll container, other props and
  `contentClassName` to the inner content. It scrolls vertically when the card's height is
  limited.
- A table in a card scrolls inside it: `Card.Content` never widens the card, so content wider
  than the card (a table with many columns) scrolls horizontally. Put the `Table` straight in
  `Card.Content`, no padded `div` or `overflow-x-auto` wrapper. To line the first column up with
  `Card.Title`, trim the content padding by the cells' own 16px:
  `<Card.Content contentClassName="px-ws-3">` (4px + 16px = the card's 20px).
- `Card.Media` runs edge to edge in a bordered card and gets rounded corners in a flat one; put
  it first (or last) so the edges line up.
- `Card.Header`, `Card.Content`, `Card.Footer` and `Card.Media` throw outside `<Card>`.
- Card spans its container (`w-full`); size it with the parent grid or a width class. Its
  content does not size it, so a card in a shrink-to-fit parent (an unsized flex item) is only as
  wide as its header and footer.

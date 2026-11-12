---
name: Card
import: import { Card } from '@wideset/react'
group: layout
status: stable
parts:
  [Card, CardMedia, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter]
related: [ActionTile, Tile, Accordion, Sidepanel, Modal]
docs: https://wideset.co/components/card
storybook: components-card--default
---

# Card

> A bounded surface that groups one subject's title, content, media and actions.

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

## Anatomy

```tsx
<Card>
  <Card.Media ratio="16/9">
    {/* optional, first */}
    <img src={src} alt="" className="size-full object-cover" />
  </Card.Media>
  <Card.Header>
    <div className="gap-ws-9 flex items-start justify-between">
      <div className="flex min-w-0 flex-1 flex-col">
        <Card.Title>Weekly report</Card.Title>
        <Card.Description>Sent to the team every Monday.</Card.Description>
      </div>
      <Card.Action>
        <StatusBadge color="positive">Active</StatusBadge>
      </Card.Action>
    </div>
  </Card.Header>
  <Card.Content>…</Card.Content>
  <Card.Footer>
    <Button variant="secondary" preset="border">
      Open report
    </Button>
  </Card.Footer>
</Card>
```

Every part is optional. Named exports (`CardHeader`, `CardTitle`, …) are the same parts for
Server Components.

## Choosing props

| Prop                         | Value                                     | Use for                                                               |
| ---------------------------- | ----------------------------------------- | --------------------------------------------------------------------- |
| `variant`                    | `bordered` (default)                      | Cards on the page background, or that must read as separate items.    |
|                              | `flat`                                    | Cards inside a panel or section that already frames them.             |
| `ratio` (Media)              | `16/9` (default), any CSS ratio or number | Keeps the media box stable before the image loads.                    |
| `asChild` (Title)            | `true`                                    | Set the heading level: `<Card.Title asChild><h2>…</h2></Card.Title>`. |
| `contentClassName` (Content) | classes                                   | Override the inner padding of `Card.Content`.                         |

## States

Card has no interactive states. A card that is clicked as a whole is an `ActionTile`; a card
that is selected is a `Tile`.

## Content

- Title: a noun phrase, sentence case, one line.
- Description: one sentence of context under the title.
- Footer: one primary action at most; secondary actions as `secondary` buttons.
- Keep one `variant` per group of cards, and the same parts in every card of a grid.

## Accessibility

- `Card.Title` is an `h3` by default. Match the page outline with `asChild`.
- Card is a `div`, not a landmark or a link. Put real links and buttons inside it.
- Give `Card.Media` images `alt`, unless the title already says what the image shows (`alt=""`).

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
  `contentClassName` to the inner content. It scrolls only when the card's height is limited.
- `Card.Media` runs edge to edge in a bordered card and gets rounded corners in a flat one; put
  it first (or last) so the edges line up.
- `Card.Header`, `Card.Content`, `Card.Footer` and `Card.Media` throw outside `<Card>`.
- Card spans its container (`w-full`); size it with the parent grid or a width class.

## API

Full props: `https://wideset.co/components/card.md` · Types:
`packages/design-system/src/components/card/Card.types.ts`

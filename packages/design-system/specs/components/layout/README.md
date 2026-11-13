# Layout

Components that group and separate content inside a page: a framed surface, collapsible
sections, a separating line. Wideset has no page, grid, stack or container components: page
structure is plain elements with Tailwind layout classes and `ws` tokens (`flex`, `grid`,
`gap-ws-*`, `p-ws-*`, `bg-ws-static-foreground` for the page). The app frame is `Sidebar` (navigation) and
overlays are `Sidepanel` / `Modal`; see [patterns](../../patterns/README.md) for how they fit
together.

## Pick the right one

- [Card](card.md) — one subject's title, content, media and actions on a bounded surface.
- [Accordion](accordion.md) — named sections the user opens in place, one or several at a time.
- [Divider](divider.md) — a horizontal line between blocks, optionally labelled ("or",
  "Optional").

Nearby, in other groups:

- The whole surface is a link or action → `ActionTile`; a card the user selects → `Tile`.
- Sections that replace each other → `Tabs` (navigation).
- Record detail over the page → `Sidepanel` (overlays).

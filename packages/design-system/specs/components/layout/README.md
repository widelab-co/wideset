# Layout

Components that group, separate and scroll content inside a page: a framed surface, collapsible
sections, a separating line, a scrolling region. Wideset has no page, grid, stack or container components: page
structure is plain elements with Tailwind layout classes and `ws` tokens (`flex`, `grid`,
`gap-ws-*`, `p-ws-*`, `bg-ws-static-foreground` for the page). The app frame is `Sidebar` (navigation) and
overlays are `Sidepanel` / `Modal`; see [patterns](../../patterns/README.md) for how they fit
together.

## Pick the right one

- [Card](card.md) — one subject's title, content, media and actions on a bounded surface.
- [Accordion](accordion.md) — named sections the user opens in place, one or several at a time.
- [Divider](divider.md) — a horizontal line between blocks, optionally labelled ("or",
  "Optional").
- [ScrollArea](scroll-area.md) — a region that keeps its size and scrolls, with Wideset's thin
  bar; never a bare `overflow-auto`. What cannot be wrapped (the page, a `textarea`) takes the
  `wds-scrollbar` class.

Nearby, in other groups:

- The whole surface is a link or action → `ActionTile`; a card the user selects → `Tile`.
- Sections that replace each other → `Tabs` (navigation).
- Record detail over the page → `Sidepanel` (overlays).

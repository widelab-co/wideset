# Layout

The app frame and the components that group and separate content inside a page: a framed
surface, collapsible sections, a separating line. Wideset has no page, grid, stack or container
components: page structure is plain elements with Tailwind layout classes and `ws` tokens
(`flex`, `grid`, `gap-ws-*`, `p-ws-*`). The app frame is `AppShell` around `Sidebar`
(navigation) and the page; overlays are `Sidepanel` / `Modal`; see
[patterns](../../patterns/README.md) for how they fit together.

## Pick the right one

- [AppShell](../../../good-practices/app-shell.md) — the full-height frame of every screen: `Sidebar` and the page in
  the app's direction (`flat`, `frame`, `inset`).
- [Card](../../../good-practices/card.md) — one subject's title, content, media and actions on a bounded surface.
- [Accordion](../../../good-practices/accordion.md) — named sections the user opens in place, one or several at a time.
- [Divider](../../../good-practices/divider.md) — a horizontal line between blocks, optionally labelled ("or",
  "Optional").

Nearby, in other groups:

- The whole surface is a link or action → `ActionTile`; a card the user selects → `Tile`.
- Sections that replace each other → `Tabs` (navigation).
- Record detail over the page → `Sidepanel` (overlays).

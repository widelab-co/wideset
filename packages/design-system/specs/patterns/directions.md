# Visual directions

> Four ways a Wideset app meets its background — Flat, Frame, Inset and Canvas — chosen once per
> app, before the first screen.

## Problem

Two products built from the same components can look like different families: in one the
navigation and the page share a white surface split by a line, in another the page is a raised
card on a grey frame. The difference is never inside a component; it is only in what surrounds
the content. Left to chance, every screen picks its own surround and the app looks assembled.
Pick one direction for the whole app and keep it on every screen.

A direction is independent of where the navigation goes. Every direction works with a `Sidebar`,
with a workspace rail beside a `Sidebar`, or with a top bar.

## The four directions

| Direction  | The surround                                                                   | Reads as                        | Wideset Core screen |
| ---------- | ------------------------------------------------------------------------------ | ------------------------------- | ------------------- |
| **Flat**   | One white surface; lines split the navigation, the page header and the content | Calm, dense, tool-like          | Kanban, Process     |
| **Frame**  | The navigation on a grey tint; the page white and full-bleed                   | Clear split, still edge to edge | Communication       |
| **Inset**  | The navigation on the grey frame; the page a raised white card inside it       | Soft, focused, document-like    | Calendar            |
| **Canvas** | A grey page; the top bar on it; the content in white cards                     | Modular, dashboard-like         | Crypto              |

Choose by the product, not by taste: Flat for dense working tools (tables, boards, editors),
Frame for apps with several side-by-side panels (messages, mail), Inset when the page is one
object to focus on (a calendar, a document), Canvas when the page is a set of separate modules
(an overview, a wallet). The default is Flat: it is what Figma's components are drawn on.

## Recipes

Each recipe is the whole surround; everything inside `main` is the screen's own content.
Spacing and radii are Figma's.

### Flat

```tsx
<div className="bg-ws-static-foreground flex h-dvh">
  <Sidebar>…</Sidebar>
  <main className="min-w-0 flex-1 overflow-y-auto">…</main>
</div>
```

`Sidebar` keeps its default `surface="page"`: white with a `border-ws-static-subtle` line on its
right edge. Inside the page, regions are split by the same subtle line (a page header:
`border-b border-ws-static-subtle`).

### Frame

```tsx
<div className="bg-ws-static-foreground flex h-dvh">
  <Sidebar surface="tinted">…</Sidebar>
  <main className="min-w-0 flex-1 overflow-y-auto">…</main>
</div>
```

`surface="tinted"` lays Figma's Static/Fill/Alpha/Subtle over the app's white and drops the line:
the same grey as the frame in light, a step lighter than the page in dark. Panels inside the page
are split by `border-ws-static-subtle` lines, never by gaps of grey.

### Inset

```tsx
<div className="bg-ws-static-background flex h-dvh">
  <Sidebar surface="frame">…</Sidebar>
  <main className="bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 flex min-w-0 flex-1 flex-col overflow-hidden">
    …
  </main>
</div>
```

The card is 12px from the top, right and bottom edges and 8px from the sidebar, with a 16px
radius and `shadow-ws-low` (none in dark, where the lighter surface carries the lift). The page
scrolls inside the card, so the card's corners stay put. The `frame` sidebar centres its nav in
its column: 18px from the window edge, as far as from the card. A line inside it (above the
account) keeps that inset; run edge to edge it stops in the grey before the card and reads as
broken.

### Canvas

```tsx
<div className="bg-ws-static-background min-h-dvh">
  <header className="…">…</header>
  <main className="…">
    <section className="bg-ws-static-foreground rounded-ws-container-md …">…</section>
  </main>
</div>
```

The top bar has no fill: it sits on the grey. Content goes in white sections with a 12px radius,
no border and no shadow; a field placed directly on the grey takes `bg-ws-static-highlight-base`.

### Top bar instead of a sidebar

In Flat the top bar is a `header` on the page's white. Figma's Navigation Bar draws a
`border-b border-ws-static-base` line under it; leave the line out when the page below opens with
its own large title and space (Figma's Finance dashboard), keep it when content starts right
under the bar. In Canvas it sits on the grey with no line. Either way it holds the brand, the
primary navigation and the account, in that order.

## Starting points

Each direction has a whole screen to start from, rebuilt 1:1 from the Wideset Core Figma file;
its code is at `https://wideset-docs.widelab.workers.dev/blocks/<id>.md`. Copy the closest one and change its content; keep its
surround.

| Block               | Direction | Navigation     |
| ------------------- | --------- | -------------- |
| `kanban`            | Flat      | Sidebar        |
| `process`           | Flat      | Rail + sidebar |
| `finance-dashboard` | Flat      | Top bar        |
| `communication`     | Frame     | Sidebar        |
| `calendar`          | Inset     | Sidebar        |
| `crypto`            | Canvas    | Top bar        |
| `gantt`             | Flat      | Takeover       |

A takeover is a window over the app with no sidebar: a top bar with back and breadcrumbs, then the
work (Gantt). Panels open over any direction and keep their own look; start a record's detail
from `task-sidepanel` (`https://wideset-docs.widelab.workers.dev/blocks/task-sidepanel.md`).

## Rules

- One direction per app. Every screen, including settings and empty states, uses the same
  surround; a modal or side panel keeps its own look on top of any of them.
- The direction lives in the root and in `Sidebar`'s `surface`; never in a component's
  `className`.
- Do not mix the surrounds: a grey page with a white sidebar, or an inset card beside a page-
  coloured sidebar, belongs to no direction.
- Inside the page, separate with what the direction uses: lines in Flat and Frame, the card edge
  in Inset, white sections in Canvas. A `Card` inside a Flat page is bordered; Canvas sections are
  the cards, so do not put a bordered `Card` inside one.
- Wider than 1440px, the surround keeps filling the window (sidebar, rail, top bar, edge panels)
  and the content stops growing: the page's title row and everything under it share one
  `mx-auto w-full max-w-[80rem]` column (`wideset-craft`, content width). Boards and calendars,
  which are canvases, may keep filling. A side panel stacks its sections from the top with a
  section gap; spread over a tall window they drift apart.

## Anti-patterns

- Choosing a direction per screen. Users notice before they can say why.
- A `Sidebar` restyled through `className` (a fill, a border) instead of `surface`.
- An Inset card that scrolls with the page: the corners then scroll away. Scroll inside it.
- An Inset sidebar hugging the window edge, or a line in it running edge to edge.
- A dashboard stretched across a 2560px window: tables whose columns drift apart, a chart three
  times its designed width, a panel section pinned to the panel's bottom.
- A Canvas page whose sections have borders or shadows: the grey ground already separates them.

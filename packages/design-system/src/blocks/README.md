# Blocks: starting points

Whole screens built from Wideset, one folder each, rebuilt 1:1 from the screens in the Wideset
Core Figma file (page "🖥️ Screens"). They are the starting point for anyone generating something
new with Wideset: pick the screen closest to what you build, copy its folder, change the content.

A block is consumer code, like an example: it imports the library as `@wideset/react` and its own
files by a relative path inside its folder (ESLint enforces both). It never imports another block.

```
src/blocks/<id>/index.tsx     default export: the screen, at full viewport size (h-dvh)
src/blocks/<id>/*.tsx         its parts (sidebar, header, panels), named after what they are
src/blocks/<id>/data.ts       its sample content
```

Every block is one of four visual directions. A direction decides only what surrounds the
content: what the navigation sits on, how the page meets the background and how content blocks
are drawn. Navigation is a separate choice: a `Sidebar`, a rail beside a sidebar, or a top bar.

## The four directions

| Direction  | Looks like                                                    | Figma screens            |
| ---------- | ------------------------------------------------------------- | ------------------------ |
| **Flat**   | One white surface; lines split navigation, header and content | Kanban, Process, Finance |
| **Frame**  | Navigation on a grey tint; the page white and full-bleed      | Communication            |
| **Inset**  | Navigation on the grey frame; the page is a raised white card | Calendar                 |
| **Canvas** | Grey page, top bar on it, content in white cards              | Crypto                   |

### Flat

```tsx
<div className="bg-ws-static-foreground flex h-dvh">
  <Sidebar>…</Sidebar> {/* surface="page": white + subtle right line */}
  <main className="min-w-0 flex-1 overflow-y-auto">…</main>
</div>
```

Regions inside the page are split by `border-ws-static-subtle` lines (a page header:
`border-b`). With a top bar instead of a sidebar, the bar is a `header` on the white;
Figma's Navigation Bar line (`border-b border-ws-static-base`) stays when content starts right
under it and goes when the page opens with a large title (Finance).

### Frame

```tsx
<div className="bg-ws-static-foreground flex h-dvh">
  <Sidebar surface="tinted">…</Sidebar> {/* grey tint over the white, no line */}
  <main className="min-w-0 flex-1 overflow-y-auto">…</main>
</div>
```

The page is white and full-bleed; panels inside it are split by `border-ws-static-subtle` lines.
The tint is Figma's Static/Fill/Alpha/Subtle, so in dark the sidebar is a step lighter than the
page, where Inset's frame is a step darker.

### Inset

```tsx
<div className="bg-ws-static-background flex h-dvh">
  <Sidebar surface="frame">…</Sidebar>
  <main className="bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 flex min-w-0 flex-1 flex-col overflow-hidden">
    … {/* the page scrolls inside the card */}
  </main>
</div>
```

Figma Calendar: card 16px radius (`rounded-ws-container-lg`), Elevation/Low (`shadow-ws-low`,
none in dark, where the lighter surface carries it), 12px from the top, right and bottom edges and
8px from the sidebar.

### Canvas

```tsx
<div className="bg-ws-static-background min-h-dvh">
  <header className="…">…</header> {/* the top bar sits on the grey, no fill */}
  <main className="…">
    <section className="bg-ws-static-foreground rounded-ws-container-md …">…</section>
  </main>
</div>
```

Figma Crypto: cards 12px radius (`rounded-ws-container-md`), no shadow, no border; fields on the
grey take `bg-ws-static-highlight-base`.

## Rules

- Rebuild the Figma screen 1:1: layout, sizes, spacing, type, colours and states as drawn, in
  light and dark (every screen has a Dark copy). Measure in Figma, do not eyeball.
- Wideset components wherever Figma uses one; never restyle a component with `className` (layout
  only: width, flex, margins). `ws` tokens only: no palette or plain Tailwind scale classes, no
  hex, no inline styles.
- What Wideset has no component for (a top-bar nav item, a keyboard shortcut chip, a chat bubble,
  a calendar month grid, a kanban column, a chart) is composed inside the block from `ws` tokens
  and named in the block's report as a candidate component.
- People are `Avatar` with initials and a colour; no photos or other binary assets. Brand marks are
  `Avatar shape="square"` with initials. Icons are Remix.
- Sample content is static, in `data.ts`. Interactions a starting point needs work (selection,
  tabs, toggles); nothing talks to a server.

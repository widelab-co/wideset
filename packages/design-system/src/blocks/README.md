# Blocks: starting points

Whole screens built from Wideset, one folder each, rebuilt 1:1 from the screens in the Wideset
Core Figma file (page "🖥️ Screens"). They are the starting point for anyone generating something
new with Wideset: pick the screen closest to what you build, copy its folder, change the content.

The SaaS screens after Crypto (Analytics, Sales overview, Customers, Customer detail, Billing,
Settings, Team) have no Figma screen yet: they are composed from Wideset by the same rules, with
the library as the measure instead of a drawing. Their parts that Wideset has no component for (a
key figure card, a chart, a facts list, an activity timeline, an empty state) each sit in a file of
their own, named after what they are.

A block is consumer code, like an example: it imports the library as `@wideset/react` and its own
files by a relative path inside its folder (ESLint enforces both). It never imports another block.

```
src/blocks/<id>/index.tsx     default export: the screen, at full viewport size (h-dvh)
src/blocks/<id>/*.tsx         its parts (sidebar, header, panels), named after what they are
src/blocks/<id>/data.ts       its sample content
```

Every block is one of four visual directions. A direction decides only what surrounds the
content: what the navigation sits on, how the page meets the background and how content blocks
are drawn. Navigation is a separate choice: a `Sidebar`, a rail beside a sidebar, a top bar, a
takeover (a window over the app with a top bar to leave by: back and breadcrumbs, as in Gantt), or
none, for the screens before the app (sign in and sign up: a raised card on the grey ground, its
footer the way out; see `specs/patterns/auth.md`).

Panels are blocks too, listed apart (`PANELS` in `index.ts`): they open over a screen of any
direction and keep their own look. The task side panel is one; Gantt shows the same panel open on a
task, as a byte-identical copy that a test keeps in step.

## The four directions

| Direction  | Looks like                                                    | Figma screens            |
| ---------- | ------------------------------------------------------------- | ------------------------ |
| **Flat**   | One white surface; lines split navigation, header and content | Kanban, Process, Finance |
| **Frame**  | Navigation on a grey tint; the page white and full-bleed      | Communication            |
| **Inset**  | Navigation on the grey frame; the page is a raised white card | Calendar, Sign In        |
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
  and gets its own component pull request, Figma's component first; the block switches to the
  component once it lands.
- People are `Avatar` with initials and a colour; no photos or other binary assets. The product's
  mark is the block's own `brand-mark.tsx` (Figma's workspace Thumbnail on inverse tokens, 32px,
  36px in a larger switcher); other workspaces are `Avatar shape="square"` with initials. The
  sign-in screens show the app icon instead (`app-icon.tsx`, Figma's glass tile, the same in
  dark). Icons are Remix.
- Past 1440px the frame keeps filling the window and the content stops growing
  (`mx-auto w-full max-w-[80rem]`; a thread reads at 48rem); boards, calendars and timelines may
  fill. Panels stack their sections from the top. At 1440×960 nothing scrolls.
- A row that does one thing (opens a task, expands a person) is one target across its whole
  width, with the hover fill on the whole row (in Gantt it runs on into the timeline); never only
  its text.
- Sample content is static, in `data.ts`. Interactions a starting point needs work (selection,
  tabs, toggles); nothing talks to a server.

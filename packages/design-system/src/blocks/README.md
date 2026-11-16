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

Every app screen sets its direction with one prop, `<AppShell direction>` (`specs/patterns/directions.md`);
the `Sidebar` inside takes the matching surface on its own. Never write the surround by hand. The
screens before the app (sign in, sign up, not found) have no `AppShell`, and the panel stages
centre their panel on a plain white screen.

```tsx
<AppShell direction="inset">
  {' '}
  {/* or flat, frame, canvas */}
  <Sidebar>…</Sidebar>
  <AppShell.Main>…</AppShell.Main>
</AppShell>
```

- **Inset** (Figma Calendar): the page is a white card, 16px radius, Elevation/Low (none in dark,
  where the lighter surface carries it), 12px from the top, right and bottom edges and 8px from the
  sidebar; the page scrolls inside it. A bar at its top runs edge to edge with a
  `border-ws-static-base` line.
- **Flat**: regions inside the page are split by `border-ws-static-subtle` lines (a page header:
  `border-b`).
- **Frame**: the sidebar on Figma's Static/Fill/Alpha/Subtle, so in dark it is a step lighter than
  the page, where Inset's frame is a step darker; panels inside the page are split by
  `border-ws-static-subtle` lines.
- **Canvas** (Figma Crypto): the page is the grey; content in white sections, 12px radius
  (`rounded-ws-container-md`), no shadow, no border; fields on the grey take
  `bg-ws-static-highlight-base`.
- With a top bar instead of a sidebar, the bar is the first child of `AppShell.Main`. Figma's
  Navigation Bar line (`border-b border-ws-static-base`) stays when content starts right under it
  and goes when the page opens with a large title (Finance). A board, grid or chart that scrolls on
  its own fills the page with `min-h-0 flex-1`.

## Rules

- Rebuild the Figma screen 1:1: layout, sizes, spacing, type, colours and states as drawn, in
  light and dark (every screen has a Dark copy). Measure in Figma, do not eyeball.
- Wideset components wherever Figma uses one; never restyle a component with `className` (layout
  only: width, flex, margins). `ws` tokens only: no palette or plain Tailwind scale classes, no
  hex, no inline styles.
- What Wideset has no component for (a top-bar nav item, a keyboard shortcut chip, a chat bubble,
  a calendar month grid, a kanban column, a chart) is composed inside the block from `ws` tokens
  and gets its own component pull request, Figma's component first; the block switches to the
  component once it lands. Such a part sits in a file of its own that starts with
  `// TODO(custom): <what it is, what Wideset lacks>`, so `git grep -l "TODO(custom)"` lists the
  candidate components.
- People are `Avatar`, a mix as in a real product (and in the Figma screens): some with a photo,
  `src` from the block's `people.assets.ts` with the initials as its fallback, the rest initials and
  a colour. A block ships only `.ts` and `.tsx`, so a photo is a 96px JPEG data URL in that file,
  and a person has the same face on every screen. No other binary assets. The product's
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

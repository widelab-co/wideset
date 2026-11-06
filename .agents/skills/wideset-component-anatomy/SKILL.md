---
name: wideset-component-anatomy
description: Give a Wideset component a correct, quiet Anatomy section on its docs page (apps/docs, /components/<page>#anatomy) — the picture with each part named beside it and spotlit on hover, and the parts table as a tree. Covers what to base the composition on (code exports, Figma with every slot on, the stage's content), writing `anatomy()` in the playground file, the fixed visual rules, the looks that were tried and rejected, and auditing every page at once. Use when a component gains or changes a part, when an Anatomy section looks wrong (names off their parts, a part "not in the picture", a drawing shrunk), when rolling the section out across components, or when asked to change how the section looks.
license: Apache-2.0
metadata:
  internal: true
  pattern: apps/docs/src/playgrounds/card.tsx, apps/docs/src/components/AnatomyDiagram.tsx
---

# Component anatomy

The Anatomy section shows a component's parts: the component drawn 1:1 with each part named
beside it, and a table of the parts as a tree. Hovering a name or a row spotlights that part.
Both halves are generated; a component contributes only its **composition** (what the picture
draws) and its parts' **`data-slot`s**. Card is the pattern to copy.

Paths: `pkg/` = `packages/design-system/`, `docs/` = `apps/docs/`. The section lives in
`docs/src/components/AnatomyDiagram.tsx` (picture, table wiring),
`docs/src/pages/components/[id].astro` (section and table markup) and `--docs-anatomy-veil` in
`docs/src/styles/docs.css`. Nothing in them is per component: never special-case a component
there; fix its composition instead.

## What the page does on its own

- **Only with two or more parts.** A one-part component (Divider, Checkbox) has no
  Anatomy section and no table-of-contents entry: one name beside the playground's own drawing
  says nothing. Do not write an `anatomy()` for it. A component whose exports are kinds of one
  thing rather than pieces of it (Pagination's Numbers and Overflow are its two `type`s) sets
  `anatomy: false` in its playground file and has no section either.
- **Parts** are the component's named exports with a props type (`partsOf` in
  `docs/src/lib/catalog.ts`). The page passes the root (`entry.exports[0]`), so every other part
  is named by its member in the picture: `CardHeader` reads `Header`, the root its own name.
  The table names each part as Props does, `Card.Header`.
- **The picture** draws `anatomy()` from `docs/src/playgrounds/<page>.tsx`, else `preview()`,
  else the stage (`pkg/src/components/<folder>/examples/<page>/default.tsx`). It finds each part
  by `data-slot` (an alias export such as `IconButtonIcon` = `ButtonIcon` by either slot) and
  points at the **first** match. It measures the parts once in the drawing's own unscaled space;
  placing the names is then arithmetic for any frame width, with no measure loop.
- **Size:** the component is drawn **1:1, never enlarged**. It stays centred unless its names
  need the room, and is scaled down only when the frame cannot hold it beside them (a wide
  modal at 1280px). It wraps at the frame's width, never at its position.
- **Where names go** (grey `caption-md`, no lines, dots or numbers):
  - the root: on the left, level with its first line;
  - a **one-line drawing** (at most 48px tall: a button, a chip, tabs, a text input): every
    other part in a row above, centred over its part; where two collide, the one whose part's
    centre lies further right moves right (an icon keeps its name, its item takes the nudge);
  - a **taller drawing**: in the left column, or in the right column when the part sits in the
    drawing's right third (a card's action, a close button, a trailing icon);
  - in a column, names keep the order the component is built (a parent above its first child),
    each level with the middle of its part's first line, or pushed down 22px from the one
    above; a name pushed past its own part moves to the row above when the part starts at the
    top, else to the right column, unless there it would land further off its part or push a
    name already there (a header's close button) off its own: then it stays on the left.
- **Hover** a name or a table row:
  - the name becomes a badge: `bg-ws-static-foreground`, no stroke, `rounded-ws-control-sm`,
    `text-ws-static-strong`, weight one step up; the other names fade to 40%;
  - the part is **spotlit**: a box of its exact rect and corners (its own radius, a rounded
    ancestor's where their corners meet, or the only child's that fills it), drawn **inside the
    drawing** so it shares the part's scale and pixel edges, its shadow a tint over everything
    else: `--docs-anatomy-veil`, the table row's own highlight (`alpha-base`, 8% black) on the
    light page and the system scrim at 70% (about 40% black) on the dark one;
  - the spotlight **cuts** from part to part without moving; only the tint fades (120ms in,
    80ms out), and leaving a name waits 80ms so moving onto the next does not flash; badges
    80ms in, 60ms out; the row lights with the same tint.
- **The table** follows the picture: rows in the order the component is built, indented 1.25rem
  per level of nesting, a root that draws nothing (a provider) first, parts the picture cannot
  point at last with their label (below); parts read `Card.Header`, as in Props (no separate
  named-export column). One face (Inter): part `body-md` 14/20,
  renders subtle, description `body-sm` subtle on the row's first baseline; 40px rows;
  full-width rules; Renders hides when the table is narrower than 36rem.

## What to base a composition on

1. **The part list is the code's** named exports. Every part the table lists belongs in the
   picture unless it cannot be drawn (below).
2. **The structure and order are Figma's**: the component with every optional slot on. Where Figma's doc page
   draws an anatomy, follow its part order and the instance it points at.
3. **The content is the stage's** (`default.tsx`): the same realistic labels, so the picture
   reads like the playground above it.

## Writing `anatomy()`

Add it to `docs/src/playgrounds/<page>.tsx` only when the stage or the preview leaves a part out.

1. **Every part once, nested as in real use** (`Card > Card.Header > Card.Title`), as a
   consumer would write it. The first instance of a repeated part (`Tabs.Trigger`,
   `Pagination.Item`) is the one named: make it the representative one, not disabled.
2. **The smallest composition that shows them all.** Two items, not five; one level of each
   nesting; short realistic text. Keep it within **20rem** wide: at 1440px it draws 1:1 beside
   its names, at 1280px (table of contents and rail open) at about 0.8×.
3. **Overlays drawn open, in place.** A part that portals (menu content, popover, tooltip,
   modal) must render inside the drawing: reproduce its surface inline with the part's
   `data-slot` set by hand, as `dropdown-menu.tsx` does
   (`<div data-slot="dropdown-menu-content" className={SURFACE}>`). A real open portal escapes
   the frame and covers the page.
4. **Give empty parts a size, nothing more.** A media slot shows the sample image its own
   examples use (Card: the Media example's photo, cropped to the frame), so it reads as media.
   No borders, backgrounds or padding added to make parts visible: the spotlight shows each
   part's shape. The context a part lives in (a modal on its scrim) is fine.
5. **Parts that start on the same line** (`Card > Media`, `Tabs > List`, `Accordion > Item >
Trigger`) share a first line: their names stack 22px apart and only the first is level.
   Acceptable when the component is built that way; never add spacing to spread them.
6. **No dev cases:** no `asChild` tricks, routing or forms unless a part only exists that way.

## Parts the picture cannot draw

Only these may be missing from the picture, each with its label in the table:

- a **provider or root that renders no element of its own** (`DropdownMenu`, `ComboBox`) and
  a **portal** wrapper: "Renders no element", the default;
- a part that **only exists in another state**: say which, in the playground file's `absent`
  map by named export: `SelectItemText: 'Only when open'`,
  `ComboBoxHighlightedLabel: 'Only while typing'`, `SidebarCollapsed: 'Only when collapsed'`.

Anything else missing is a composition bug or a missing `data-slot`.

## `data-slot` (library side)

Every rendered part sets `data-slot="<kebab of its export>"` before `{...props}` (`CardHeader`
→ `card-header`). A wrapper whose only child is the visible part (Card.Action around a badge) is
fine: the spotlight takes the child's corners. Adding or fixing a `data-slot` is a library
change.

## Rejected — do not bring these back

Each was built, looked at and removed. If a request seems to ask for one, say so first.

- **Numbered markers** in the accent colour: the numbers followed the table's alphabetical
  order, so they jumped around the component (Card: 1, 7, 6, 8, 4, 3, 5 top to bottom), and the
  purple was loud.
- **Dashed outlines** around every part at rest: noise.
- **Leader lines** in every form (to the part, to the outermost edge, hairlines with end dots,
  lines only on hover): they cut through text, two lines landed on the same edge, and names
  level with their parts read without them. No **dots** either.
- **An accent outline** around the hovered part: too loud. The tint does the work.
- **A padded spotlight** (3–4px around the part, matched or fixed 4px corners): read as random
  gaps spilling outside the component. The spotlight is the part's exact box.
- **A glass rim** (frosted band, light edge, soft shadow): invisible on white, fussy elsewhere.
- **The spotlight outside the drawing's layer** (an SVG mask or a sibling box): at a fractional
  scale its edges and the part's fall on different half-pixels and a seam shows. It must be
  drawn inside the drawing.
- **An animated spotlight** sliding between parts: the cut is calmer.
- **A stroke on the badge:** a plain foreground pill.
- **A dark scrim on the light page** (22% and more): too heavy. 4% (`alpha-subtle`) was too faint to notice; 8% (`alpha-base`) is the tint.
- **The table's white-wash tint on the dark page:** it lights the rest up instead of dimming it.
- **Enlarged components** (1.75× for all, 1.5× for small controls): components are always 1:1.
- **Four-sided name placement** to keep lines from crossing: it threw names to the far side in
  a narrow frame.
- **In the table:** a `#` column; mono or mixed sizes in one row; tall rows; folder icons,
  chevrons and folding; tree guide lines (├ │ └) and elbows; rules missing under the part
  column; a doubled bottom rule.

## Check

Open `/components/<page>#anatomy` (`pnpm docs:dev`) at 1440px and 1280px wide, light and dark.

- [ ] Every table row has its name in the picture, or its label for one of the
      three reasons above.
- [ ] The tree matches the code: compare the indentation with `anatomy()` / `default.tsx`.
- [ ] No two names overlap, none sits on the drawing, none is cut by the frame.
- [ ] Each name is level with its part's first line, or is a shared-top case (writing rule 5).
- [ ] Names in the row above only on a one-line drawing, or for a part at the top whose column
      slot was taken.
- [ ] Hover every name and every row: the spotlight is exactly the part, corners included, the
      rest dims (light: a faint grey, dark: a real dim), and the row lights up.
- [ ] At 1280px the drawing is not below about 0.6×; if it is, the composition is wider than it
      needs to be (writing rule 2).

To check every page at once, paste [scripts/audit-anatomy.js](scripts/audit-anatomy.js) into
the console of any docs page and run `await auditAnatomy()`; keep the tab in front (a
background tab throttles its timers and pages time out). It prints one line per page: parts
drawn, zoom, parts not in the picture, overlaps, names on the drawing or outside the frame,
names above or on the right, and names more than 4px off their part's first line.

# Spacing and width

## Spacing has a hierarchy

### The rule

The gap between two things grows with the size of what it separates. Use five levels and nothing
in between:

| Level | Separates                                                    | Class       | px  |
| ----- | ------------------------------------------------------------ | ----------- | --- |
| 1     | Parts of one element (icon and text, title and its subtitle) | `gap-ws-3`  | 4   |
| 2     | Controls in a row, label and helper text                     | `gap-ws-5`  | 8   |
| 3     | Fields in a form, rows of a stack                            | `gap-ws-11` | 20  |
| 4     | Groups inside a card or panel                                | `gap-ws-12` | 24  |
| 5     | Sections of a page                                           | `gap-ws-16` | 40  |

Nothing goes below level 1. `gap-ws-1` and `gap-ws-2` (2px) are for inside components; a line of
text and its caption or time are parts of one element, so they take level 1 (`gap-ws-3`).

Containers: page `p-ws-12` (24px), Card has its own padding (`p-ws-11`, 20px), Modal and
Sidepanel set theirs. Do not re-pad a component's built-in regions.

A panel you compose yourself (an activity rail, an aside, a filter column) is a container too:
`w-[20rem]` (never under 18rem) and the page's padding, `p-ws-12`. Nothing in it touches its edge:
an avatar group, an icon button or a long name sits inside that padding, and a list in it spaces
its items at level 3 (`gap-ws-11`) with level 1 inside each item.

### Why

When every gap is 16px, nothing groups: the eye cannot tell which label belongs to which field or
where a section ends. Distinct levels make grouping visible without lines or boxes, which is what
keeps a screen calm. Five levels are enough; a sixth value is almost always a level used wrong.

### Do / don't

```tsx
// Do: the levels are visible — tight title group, wider fields, widest sections
<div className="gap-ws-16 flex flex-col">
  <section className="gap-ws-12 flex flex-col">
    <div className="gap-ws-3 flex flex-col">
      <h2 className="typography-subtitle-xs text-ws-static-strong">Delivery</h2>
      <p className="typography-body-md text-ws-static-subtle">Where and when orders arrive.</p>
    </div>
    <div className="gap-ws-11 flex flex-col">{/* FormFields */}</div>
  </section>
</div>

// Don't: one gap everywhere, and pixel values the scale already has
<div className="flex flex-col gap-[16px]">
  <h2>Delivery</h2>
  <p>Where and when orders arrive.</p>
  {/* FormFields */}
</div>
```

- `gap` on a flex or grid parent, not margins on children.
- Never Tailwind's own scale (`p-4`, `gap-6`): `p-4` is 16px, `p-ws-4` is 6px, and both compile.
- Dividers scale with what they split: none inside a group, `Divider` between groups only when
  space alone is not enough, never between page sections (use level 5 space).

## Width is a decision

### The rule

Decide the content width before you build. Composed screens are centred with room at the edges;
only data that needs the width gets it.

| Screen type                      | Content width                                           |
| -------------------------------- | ------------------------------------------------------- |
| Form, settings, single column    | `max-w-[40rem]`                                         |
| Detail page (record view)        | main column `max-w-[48rem]`, optional side column 20rem |
| Dashboard, overview              | `max-w-[80rem] mx-auto w-full`                          |
| List, table, board               | full width of the main area                             |
| Sign-in, empty first-run, result | centred card or column, `max-w-[28rem]`                 |
| Reading (docs, terms)            | `max-w-[40rem]`                                         |
| Side rail or aside beside a page | `w-[20rem]` (never under 18rem), padded `p-ws-12`       |

### Why

Auto-stretching every layout to a 27" screen is the clearest sign of generated UI: lines of text
too long to read, forms whose labels sit a metre from their fields, cards with nothing in them.
Deliberate width reads as handcrafted. Tables are the exception because their columns are the
content.

## One left axis

The page title, section titles, field labels and table edges start on the same vertical line. A
title indented by its container's padding while the content below it is not, or the reverse, is
the second most common tell after mixed sizes. When a Card sits on the page, its title lines up
with the card content, and the page title lines up with the card's outer edge.

## Rules

- Keep padding on all sides of a surface equal, or wider horizontally. Never tighter horizontally.
- Density is a screen-level decision: pick compact or comfortable and hold it. Mixing `size="sm"` and `size="lg"` controls on one screen looks like a bug.
- Do not centre a form or table in a huge empty page. Use a sensible maximum width from a left edge that aligns with the page title.

Structures for each screen type are in [layout-scaffolds.md](layout-scaffolds.md).

## Responsive

- Design at 1280px, then check 768px and 390px. Rows wrap (`flex-wrap`) before they shrink; actions
  move under the title, not off-screen.
- Use the container's width, not the viewport's, where a component lives in panels of different
  sizes.
- Keep one control size per screen at every width. For breakpoints and touch targets, read the
  responsive rules in [foundations.md](foundations.md): only `lg` controls reach 44px.

Layout primitives (page container, section, stack) are not in Wideset yet, so widths and gaps are
classes every screen repeats. Use the classes above.

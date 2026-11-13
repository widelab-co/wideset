# Typography: a flat scale

## The rule

Keep almost all text in a narrow band. Body, labels and table text are **14px**
(`typography-body-md`, `typography-label-sm`); metadata is 12px (`typography-caption-md`);
card and section titles are one step up (16px); the main heading of the page is the one larger
text (32px). Make things more important with **weight and colour first**, size last.

## Why

Generated UI builds hierarchy by stacking sizes: 32px title, 24px subtitle, 18px intro, 14px body.
Four jumps make every block shout and the screen loses its focal point. A flat scale with one
clear title is calmer, scans faster and reads as more expensive. Wideset's components already set
their own text at 14px, so matching that band keeps your text and the components in one voice.

## Roles

| Role                       | Class                                                                   | Size / line height |
| -------------------------- | ----------------------------------------------------------------------- | ------------------ |
| Page title (one per page)  | `typography-title-md text-ws-static-strong`                             | 32 / 40            |
| Section title              | `typography-subtitle-xs text-ws-static-strong`                          | 16 / 24            |
| Card title                 | `Card.Title` (its own style); outside a Card `typography-subtitle-xs`   | 16 / 24            |
| Modal, side panel title    | set by `Modal.Title` (`subtitle-sm`), `Sidepanel.Title` (`subtitle-md`) | 18 / 24, 20 / 28   |
| Body, descriptions         | `typography-body-md text-ws-static-base`                                | 14 / 20            |
| Emphasis inside body       | `typography-body-strong-md` or `text-ws-static-strong`                  | 14 / 20            |
| Field and list labels      | `typography-label-sm` (components set this themselves)                  | 14 / 20            |
| Metadata, timestamps, help | `typography-caption-md text-ws-static-subtle`                           | 12 / 16            |
| Numbers in tables          | `typography-number-sm tabular-nums`                                     | 14 / 20            |
| Key figure in a KPI row    | `typography-title-md tabular-nums`                                      | 32 / 40            |
| The figure a page is about | `typography-title-lg tabular-nums` (a balance)                          | 40 / 48            |
| Long reading (docs, terms) | `typography-body-lg`                                                    | 16 / 24            |

## A title follows its container

A title's size follows its container and the free space around it: the tighter the container,
the smaller the title; the more empty space, the larger it works. A subtitle stays one step above
the content it opens and never competes with the page heading.

| Container                                                     | Free space | Title                                                           |
| ------------------------------------------------------------- | ---------- | --------------------------------------------------------------- |
| The whole page                                                | most       | `title-md` 32 (the one figure the page is about: `title-lg` 40) |
| A roomy, mostly empty container: empty state, sign-in/sign-up | a lot      | `title-md` 32 or `title-sm` 24                                  |
| A large part of a page, a wide panel                          | plenty     | `title-sm` 24                                                   |
| A side panel (narrow, at the edge)                            | less       | `subtitle-md` 20                                                |
| A modal, a pop-up, a status modal                             | little     | `subtitle-sm` 18                                                |
| A card, a page section, a toolbar group                       | tight      | `subtitle-xs` 16                                                |
| A list row, a table header, a menu item                       | tightest   | the text size, weight up: `label-strong-sm` 14                  |

A page title in a tight bar (a toolbar, a step header) takes the size of that bar's space
(`title-sm`), not the page default.

The class names do not tell the size: `md` means 32px in `title`, 20px in `subtitle`, 16px in
`label`, 14px in `body` and 12px in `caption`. Pick from the table above, never from the name;
the naming traps are listed in `wideset-build`'s typography foundation.

## Hierarchy without size

Use these in this order before you reach for a bigger size:

1. **Colour**: `text-ws-static-strong` for what matters, `-base` for reading text, `-subtle` for
   everything secondary. Three levels are enough; never invent a fourth grey.
2. **Weight**: the `-strong-` variant of the same size.
3. **Position and space**: first in the column, more space above it.
4. **Size**: one step, only for titles.

```tsx
// Do: one title, weight and colour carry the rest
<header className="gap-ws-3 flex flex-col">
  <h1 className="typography-title-md text-ws-static-strong">Orders</h1>
  <p className="typography-body-md text-ws-static-base">
    Every order from all locations, newest first.
  </p>
</header>

// Don't: three size jumps, and a heading at the size of a hero figure
<header>
  <h1 className="typography-title-lg">Orders</h1>
  <h2 className="typography-subtitle-md">All locations</h2>
  <p className="typography-body-lg">Every order from all locations, newest first.</p>
</header>
```

## Details that show

- One family (Wideset's font). No italic for decoration, no second family for "contrast".
- Sentence case for titles, buttons and labels ("New order", not "New Order").
- Line length for reading text: stop at about 40rem (`max-w-[40rem]`).
- Numbers that are compared (tables, totals, key figures) add `tabular-nums` to their
  `typography-number-*` or `title-*` class: those classes set size and weight, not tabular
  figures, so digits only line up with it.
- Do not pass `typography-*` into a component's `className` to resize it; use its `size` prop.
- Truncate only where the full text is available another way (tooltip, detail view); a page title
  wraps.

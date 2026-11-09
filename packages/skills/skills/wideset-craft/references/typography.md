# Typography: a flat scale

## The rule

Keep almost all text in a narrow band. Body, labels and table text are **14px**
(`typography-body-md`, `typography-label-sm`); metadata is 12px (`typography-caption-md`);
section titles are one step up (18–20px); the page title is the only larger text (32px). Make
things more important with **weight and colour first**, size last.

## Why

Generated UI builds hierarchy by stacking sizes: 32px title, 24px subtitle, 18px intro, 14px body.
Four jumps make every block shout and the screen loses its focal point. A flat scale with one
clear title is calmer, scans faster and reads as more expensive. Wideset's components already set
their own text at 14px, so matching that band keeps your text and the components in one voice.

## Roles

| Role                       | Class                                                                 | Size / line height |
| -------------------------- | --------------------------------------------------------------------- | ------------------ |
| Page title (one per page)  | `typography-subtitle-lg text-ws-static-strong`                        | 32 / 40            |
| Section title              | `typography-subtitle-xs text-ws-static-strong`                        | 18 / 24            |
| Card title                 | `Card.Title` (its own style); outside a Card `typography-subtitle-sm` | 20 / 28            |
| Body, descriptions         | `typography-body-md text-ws-static-base`                              | 14 / 20            |
| Emphasis inside body       | `typography-body-strong-md` or `text-ws-static-strong`                | 14 / 20            |
| Field and list labels      | `typography-label-sm` (components set this themselves)                | 14 / 20            |
| Metadata, timestamps, help | `typography-caption-md text-ws-static-subtle`                         | 12 / 16            |
| Numbers in tables          | `typography-number-sm tabular-nums`                                   | 14 / 20            |
| Key figure (KPI)           | `typography-subtitle-md tabular-nums`                                 | 24 / 32            |
| Long reading (docs, terms) | `typography-body-lg`                                                  | 16 / 24            |

Never in product screens: `typography-title-*` (48–72px display sizes). They belong to marketing
pages and, at most, one empty-state hero.

The class names do not tell the size: `title-*` is the display family, not "a title", and `md`
means 16px in `label`, 14px in `body`, 12px in `caption` and 24px in `subtitle`. Pick from the
table above, never from the name; the naming traps are listed in `wideset-build`'s typography
foundation.

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
  <h1 className="typography-subtitle-lg text-ws-static-strong">Orders</h1>
  <p className="typography-body-md text-ws-static-base">
    Every order from all locations, newest first.
  </p>
</header>

// Don't: three size jumps and a display size in a product page
<header>
  <h1 className="typography-title-sm">Orders</h1>
  <h2 className="typography-subtitle-md">All locations</h2>
  <p className="typography-body-lg">Every order from all locations, newest first.</p>
</header>
```

## Details that show

- One family (Wideset's font). No italic for decoration, no second family for "contrast".
- Sentence case for titles, buttons and labels ("New order", not "New Order").
- Line length for reading text: stop at about 40rem (`max-w-[40rem]`).
- Numbers that are compared (tables, totals, key figures) add `tabular-nums` to their
  `typography-number-*` or `subtitle-*` class: those classes set size and weight, not tabular
  figures, so digits only line up with it.
- Do not pass `typography-*` into a component's `className` to resize it; use its `size` prop.
- Truncate only where the full text is available another way (tooltip, detail view); a page title
  wraps.

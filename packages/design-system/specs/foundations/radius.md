# Radius

Corners come from two semantic families: `rounded-ws-control-*` for interactive controls and
`rounded-ws-container-*` for surfaces that hold content. Nested corners stay concentric: the
inner radius is the outer radius minus the padding between them.

Source: `packages/design-system/src/styles/tokens/theme-desktop-semantic.css`
(`--radius-ws-*`), values from `theme-desktop-tokens.css` and `theme-base-tokens.css`
(`--ws-radius-*`).

## Classes

| Class                       | rem   | px   | Used by                                                         |
| --------------------------- | ----- | ---- | --------------------------------------------------------------- |
| `rounded-ws-control-none`   | 0     | 0    | Square control                                                  |
| `rounded-ws-control-sm`     | 0.25  | 4    | Checkbox, Tag, StatusBadge                                      |
| `rounded-ws-control-md`     | 0.375 | 6    | `xs` Button, Chip, Tooltip, list and menu items, segments       |
| `rounded-ws-control-lg`     | 0.5   | 8    | `sm`/`md` Button, TextInput, Select (the default control)       |
| `rounded-ws-control-xl`     | 0.625 | 10   | `lg` Button, TextInput, Select                                  |
| `rounded-ws-control-full`   | pill  | pill | Pill Tag and StatusBadge, Slider, pill Tabs                     |
| `rounded-ws-container-none` | 0     | 0    | Edge-to-edge surface                                            |
| `rounded-ws-container-sm`   | 0.5   | 8    | DropdownMenu, Select list, Textarea                             |
| `rounded-ws-container-md`   | 0.75  | 12   | Modal, Tile, ActionTile, ActionBar, InlineAlert, Accordion item |
| `rounded-ws-container-lg`   | 1     | 16   | Card, Popup, Sidepanel, Toast                                   |
| `rounded-ws-container-xl`   | 1.25  | 20   | Largest surface                                                 |

Side variants work as usual: `rounded-b-ws-container-lg`.

## Selection rules

- Something you click, type into or toggle → `control`. Something that holds other things →
  `container`.
- A custom control placed next to Wideset controls takes the radius of the matching size:
  `h-ws-forms-md` with `rounded-ws-control-lg`, `h-ws-forms-lg` with `rounded-ws-control-xl`.
- Surfaces get larger radii as they get larger: menus `container-sm`, dialogs and tiles
  `container-md`, page-level cards and panels `container-lg`.

## Concentric corners

When a rounded element sits inside another, inner radius = outer radius − padding (never below
0). Pick the token closest to the result. SegmentedControl is the reference:

```
rounded-ws-control-lg (0.5rem) − p-ws-2 (0.125rem) = 0.375rem → segment rounded-ws-control-md
rounded-ws-control-xl (0.625rem) − p-ws-2 (0.125rem) = 0.5rem → segment rounded-ws-control-lg
```

```tsx
<div className="rounded-ws-container-lg bg-ws-static-container p-ws-5">
  {/* 1rem − 0.5rem = 0.5rem */}
  <div className="rounded-ws-container-sm bg-ws-static-alpha-base p-ws-9">…</div>
</div>
```

When the padding is equal to or larger than the outer radius (Card: `container-lg` with
`p-ws-11`), the inner element can be square or take a small control radius; do not repeat the
outer radius inside it.

## Primitives

`--ws-radius-0` … `--ws-radius-600` and `--ws-radius-full` are the raw steps the semantic
classes point at. They have no utility class. Use `rounded-(--ws-radius-300)` only when no
semantic class fits; prefer the semantic class so a re-brand that changes
`--ws-corner-radius-*` reaches your element too.

## Banned

- Tailwind scale classes: `rounded`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-full`.
  They do not match Wideset's values and do not follow a re-brand.
- The same radius on parent and child with padding between them (corners look pinched).

## Light and dark

Radius does not change with the theme.

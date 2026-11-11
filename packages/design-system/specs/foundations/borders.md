# Borders and focus

A border separates or outlines; its colour comes from a stroke role, never a hue. Focus is always
visible and always drawn the same way: a 2px outline offset by 2px, coloured by the control's role.

Radius tokens (`rounded-ws-control-*`, `rounded-ws-container-*`) are in [tokens.md](../tokens.md).

## Widths

| Class                  | Value |
| ---------------------- | ----- |
| `border-ws-width-none` | 0     |
| `border-ws-width-xs`   | 0.5px |
| `border-ws-width-sm`   | 1px   |
| `border-ws-width-md`   | 2px   |
| `border-ws-width-lg`   | 3px   |

Components draw their hairlines with plain `border` (1px, same as `sm`). For your own markup
`border` or a `border-ws-width-*` class are both fine; no off-token widths
(`border-[1.5px]`).

**Trap:** `cn()` reads `border-ws-width-md` and `border-ws-static-base` as the same group and
keeps only the last one, so the colour or the width disappears. Pass the width as `border` /
`border-2`, or keep the two classes out of the same `cn()` merge.

## Stroke colours

| Class                                                                       | Use for                                                                                 |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `border-ws-static-subtle`                                                   | Quiet separators: sidebar edge, tab rail, list dividers                                 |
| `border-ws-static-base`                                                     | Default outline of cards, tables, panels, popovers                                      |
| `border-ws-static-strong`                                                   | Edges that must read clearly: unchecked checkbox and radio, strong dividers             |
| `border-ws-static-inverse-subtle` · `-base` · `-strong`                     | The same, on an inverse surface                                                         |
| `border-ws-dynamic-secondary-default`                                       | Rest border of inputs, selects and bordered buttons (`-hover`, `-pressed`, `-disabled`) |
| `border-ws-dynamic-primary-strong-default`                                  | Focused or selected field                                                               |
| `border-ws-dynamic-danger-strong-default`                                   | Invalid field                                                                           |
| `border-ws-dynamic-primary-default`                                         | Brand-outlined control (bordered primary button)                                        |
| `border-ws-semantic-negative` (and `info`, `positive`, `notice`, `neutral`) | Outline of a status block                                                               |
| `border-ws-non-semantic-teal-default` (any of the 13 hues)                  | Outline of a category tag                                                               |

`-strong-` dynamic strokes are the emphatic set: use them for focus, selection and error, the plain
ones for rest and hover. A standalone line between sections → `Divider` (`emphasis`:
`subtle` | `base` | `strong`), not a hand-drawn border.

## Focus ring

```tsx
<div
  tabIndex={0}
  className="rounded-ws-control-md focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default"
/>
```

- `wds-focus-visible` (in `utilities/wds.css`) sets width and offset only: `outline-2
outline-offset-2`. Always pair it with an `outline-ws-*` colour on the element.
- Colour by role: `outline-ws-dynamic-primary-strong-default` for most controls,
  `outline-ws-dynamic-danger-strong-default` on danger controls,
  `outline-ws-dynamic-success-strong-default` on success controls.
- Apply it under `focus-visible:`, never `focus:`, so mouse clicks do not show a ring.
- Text fields and select triggers use a halo instead: `border-ws-dynamic-primary-strong-default`
  plus `shadow-ws-forms-active` (invalid: `border-ws-dynamic-danger-strong-default` plus
  `shadow-ws-forms-active-danger`). These stay visible in dark.
- `wds-disabled` (same file) is the shared disabled behaviour: no pointer events, default cursor.

## Light and dark

All stroke roles switch with `.dark`. Neutral strokes are black at 8–16 % opacity in light and
near-white at 8–12 % in dark, so a border shows on any surface below it. Focus colours follow the
brand ramp of each theme.

## Banned

- `border-gray-200`, `border-black/10`, `ring-*` focus rings, `outline-blue-500`.
- `outline-none` on a focusable element without a replacement ring.
- `shadow-ws-focus-base`: unused legacy; use `wds-focus-visible`.
- `wds-focus`: does not exist (only `wds-focus-visible`).
- A shadow where a border is meant: page-level separation is a border ([elevation.md](elevation.md)).

## Docs

https://wideset.co/docs/colors (Border) · Source: `packages/design-system/src/styles/utilities/wds.css`

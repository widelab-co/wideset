# Elevation

Elevation tells the user what sits above what: a surface fill for every layer, plus a shadow in
light mode for things that float. Components already carry their elevation; you set it only on
your own surfaces, and only from the classes below.

Stacking order (`z-index`) is a separate concern → [z-index.md](z-index.md).

## Surfaces stack

| Layer    | Fill class                | Shadow (light)       | Examples                                          |
| -------- | ------------------------- | -------------------- | ------------------------------------------------- |
| Canvas   | `bg-ws-static-background` | none                 | The page                                          |
| Chrome   | `bg-ws-static-foreground` | none, border instead | `Sidebar`                                         |
| Content  | `bg-ws-static-container`  | none, border instead | `Card`, `Table`, `Sidepanel`                      |
| Floating | `bg-ws-static-overlay`    | `shadow-ws-medium`   | `DropdownMenu`, `Select` list, `Tooltip`, `Toast` |
| Dialog   | `bg-ws-static-overlay`    | `shadow-ws-high`     | `Modal`, `Popup`, `StatusModal`                   |
| Backdrop | `bg-ws-static-scrim-base` | none                 | Behind `Modal` and `Sidepanel`                    |

Content blocks on the page are flat: separate them with `border-ws-static-base`, not a shadow
(`Card` bordered does exactly this). In light, the grey canvas against white containers gives the
depth; in dark, each layer up is a lighter grey.

## Shadow classes

| Class                                                       | Use for                                                                          |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `shadow-ws-low`                                             | A small raised element inside a control (segmented control thumb)                |
| `shadow-ws-medium`                                          | Menus, dropdowns, toasts, floating bars (`ActionBar`)                            |
| `shadow-ws-high`                                            | Modals and popups                                                                |
| `shadow-ws-controls-control`                                | The 1px lift under filled and bordered buttons                                   |
| `shadow-ws-forms-base`                                      | Rest state of text inputs and select triggers                                    |
| `shadow-ws-forms-active` · `shadow-ws-forms-active-danger`  | Focus halo on form fields (see [borders.md](borders.md))                         |
| `shadow-ws-table-freeze`                                    | The edge of a frozen table column while scrolling                                |
| `drop-shadow-ws-medium` · `drop-shadow-ws-controls-tooltip` | Shapes cut with `clip-path` (tooltip arrow), where `box-shadow` would be clipped |

`low`, `medium` and `high` include a 1px outline ring (the part that survives in dark).
Never stack two shadow classes: `cn()` keeps only the last.

## Light and dark

Figma ships one set of black shadows; on a dark surface that is lighter than the page they read
as a muddy halo. So in dark:

- `shadow-ws-low`, `shadow-ws-controls-control`, `shadow-ws-forms-base`, `shadow-ws-table-freeze`
  and `drop-shadow-ws-controls-tooltip` turn off.
- `shadow-ws-medium`, `shadow-ws-high` and `drop-shadow-ws-medium` shrink to the 1px outline ring
  only.
- Depth comes from the fills: `background` < `foreground` < `container` < `overlay`, each lighter.
- Focus halos (`shadow-ws-forms-active*`) stay on in both themes.

This happens through variables (`--ws-elevation-*`), so the same class works in both themes and
under any variant prefix. Do not add `dark:shadow-none` or your own dark shadow.

## Banned

- Tailwind's scale: `shadow-sm`, `shadow-lg`, `drop-shadow-md`. They ignore the theme.
- Arbitrary shadows: `shadow-[0_4px_12px_rgba(0,0,0,.1)]`.
- `shadow-ws-static-*`: does not exist (`--ws-static-shadow-*` are colours, not shadows).
- `shadow-ws-focus-base` for focus: unused legacy; use `wds-focus-visible` ([borders.md](borders.md)).
- A shadow on a page-level card to "lift" it: use `bg-ws-static-container` and a border.
- `z-index` to fake elevation, or elevation to fix stacking → [z-index.md](z-index.md).

## Docs

https://wideset.co/docs/elevation (z-index bands) · Source:
`packages/design-system/src/styles/utilities/shadow.css`

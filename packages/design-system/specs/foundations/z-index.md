# Z-index

Stacking uses named bands (`z-ws-sticky`, `z-ws-modal`), never numbers. Components own the upper
bands, so a Tooltip or Select list opened inside a Modal always clears it; the lower bands are
for your page layout.

Docs: `https://wideset.co/docs/elevation` · Source:
`packages/design-system/src/styles/utilities/z-index.css`

## Bands

| Class               | Value | Owner     | Use for                                                              |
| ------------------- | ----- | --------- | -------------------------------------------------------------------- |
| `z-ws-deep`         | -100  | page      | Decorative backgrounds behind everything                             |
| `z-ws-base`         | 1     | page      | Lift above siblings inside a local stacking context; not a default   |
| `z-ws-masked`       | 100   | page      | Content that other page elements may cover                           |
| `z-ws-mask`         | 200   | page      | Elements that cover masked content: frozen Table column, page header |
| `z-ws-sticky`       | 300   | page      | Sticky header, ActionBar, sticky Table head                          |
| `z-ws-drawer`       | 700   | component | Sidepanel and other drawers                                          |
| `z-ws-modal`        | 800   | component | Modal, StatusModal and their overlays                                |
| `z-ws-popout`       | 900   | component | DropdownMenu, Select list, Popup, Tooltip, FilterButton panel        |
| `z-ws-notification` | 1000  | component | Toast                                                                |

Variables: `--ws-z-index-{name}` (for CSS and `calc()`).

## Selection rules

- Page layout uses `deep` to `sticky`. Do not put your own elements in `drawer` and above
  unless they behave like that component (a custom drawer → `z-ws-drawer`).
- Do not set a z-index on Wideset overlays; they portal and pick their band themselves.
- A band is a range. To sit just above a band, add to it and stay below the next one:

```tsx
<header className="sticky top-0 z-ws-sticky">…</header>
<div className="z-[calc(var(--ws-z-index-sticky)+1)]" />
```

- Reach for `z-ws-base` only when siblings overlap inside one component; first check whether
  DOM order already solves it.
- A new stacking context (`transform`, `filter`, `isolation-isolate`, `opacity` < 1) traps its
  children: a high band inside it cannot escape. Portal the element instead of raising it.

## Banned

- Tailwind's scale and raw numbers: `z-10`, `z-50`, `z-[9999]`, `style={{ zIndex: 1000 }}`. They
  do not line up with the bands. In Wideset source, `src/styles/z-index.test.ts` rejects `z-N`
  and any `z-[…]` that does not reference a `--ws-z-index-*` band.

## Light and dark

Bands do not change with the theme. Visual depth (surface fill, shadow) is separate from
stacking → [elevation.md](elevation.md).

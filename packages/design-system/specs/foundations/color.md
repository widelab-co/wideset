# Color

Every colour in Wideset is a role, not a hue: a class says what the thing is (page, card, primary
button, error text) and the theme decides its value in light and dark. Pick the role that matches
the job; never pick a colour because it looks right.

The naming scheme, the full token lists and `cn()` live in [tokens.md](../tokens.md). Stroke
roles are in [borders.md](borders.md); shadows and surface depth in [elevation.md](elevation.md).

## Four families

| Family         | Class shape                      | What it is for                                                                            |
| -------------- | -------------------------------- | ----------------------------------------------------------------------------------------- |
| `static`       | `bg-ws-static-container`         | Non-interactive: page, surfaces, body text, dividers. One value, no states.               |
| `dynamic`      | `bg-ws-dynamic-primary-default`  | Interactive: anything you click. Each role has `default`, `hover`, `pressed`, `disabled`. |
| `semantic`     | `bg-ws-semantic-negative`        | Status: info, positive, negative, notice, neutral. Not clickable by itself.               |
| `non-semantic` | `bg-ws-non-semantic-teal-subtle` | Categories with no meaning: tags, avatars, chart series. 13 hues.                         |

## Surfaces (`bg-ws-static-*`)

| Class                                             | Use for                                                                                      |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `bg-ws-static-background`                         | The grey ground behind content blocks when a page needs one. Grey in light, darkest in dark. |
| `bg-ws-static-foreground`                         | The app: `Sidebar` and the page beside it (`main`), split by the sidebar's subtle line.      |
| `bg-ws-static-container`                          | Cards, tables, side panels: content blocks on the page.                                      |
| `bg-ws-static-overlay`                            | Floating layers: dropdowns, popups, modals, toasts, tooltips.                                |
| `bg-ws-static-panel`                              | A docked panel surface; between foreground and container in dark. No component uses it yet.  |
| `bg-ws-static-highlight-base`                     | Rest fill of form fields and choice controls (inputs, checkbox, tile).                       |
| `bg-ws-static-highlight-subtle`                   | Fill behind outlined buttons and tags.                                                       |
| `bg-ws-static-highlight-strong`                   | A selected item inside a group (segmented control, tile). Visible in dark only.              |
| `bg-ws-static-alpha-subtle` · `-base` · `-strong` | Translucent neutral tint over any surface (4 / 8 / 12 %).                                    |
| `bg-ws-static-scrim-base`                         | Backdrop behind a modal or side panel.                                                       |
| `bg-ws-static-inverse-background`                 | A dark island on a light page (and the reverse): default tooltip.                            |

`inverse-*` versions exist for container, foreground, overlay and alpha too. Use them only
inside an inverse surface, with `text-ws-static-inverse-*` on top.

## Text (`text-ws-static-*`)

| Class                                                 | Use for                                                  |
| ----------------------------------------------------- | -------------------------------------------------------- |
| `text-ws-static-strong`                               | Headings, titles, values the eye should land on first.   |
| `text-ws-static-base`                                 | Body copy and most labels.                               |
| `text-ws-static-subtle`                               | Helper text, captions, placeholders, secondary metadata. |
| `text-ws-static-inverse-strong` · `-base` · `-subtle` | The same three, on an inverse surface.                   |

Icons take the text colour through `currentColor`; colour the parent, not the icon.

## Interactive (`*-ws-dynamic-*`)

Roles: `primary` (main action, brand), `secondary` (neutral action), `tertiary` (quiet neutral
fills: nav item hover, tab indicator, zebra rows), `inverse` (controls placed on an inverse
surface), `danger` (destructive action), `success` (confirming action).

| Need                                               | Classes                                                                                                                                                    |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Solid control fill                                 | `bg-ws-dynamic-primary-default` + `hover:bg-ws-dynamic-primary-hover` + `active:bg-ws-dynamic-primary-pressed` + `disabled:bg-ws-dynamic-primary-disabled` |
| Text on that fill                                  | `text-ws-dynamic-on-primary-default` (and `-hover`, `-pressed`, `-disabled`)                                                                               |
| Ghost control (transparent at rest, tint on hover) | `bg-ws-dynamic-secondary-alpha-default` + `hover:bg-ws-dynamic-secondary-alpha-hover` + `active:bg-ws-dynamic-secondary-alpha-pressed`                     |
| Selected / current item tint                       | `bg-ws-dynamic-tertiary-alpha-strong-default` (or `bg-ws-dynamic-primary-alpha-strong-default` for a brand tint)                                           |
| Coloured link-style text                           | `text-ws-dynamic-primary-default`, `text-ws-dynamic-danger-default`                                                                                        |
| Neutral control text                               | `text-ws-dynamic-secondary-default`                                                                                                                        |
| Control border                                     | `border-ws-dynamic-secondary-default`; `-strong-` for focus/selected: `border-ws-dynamic-primary-strong-default`                                           |

`tertiary` has fills only (no `text-` or `border-` classes). `on-*` text exists for primary,
secondary, danger, success and inverse.

## Status (`*-ws-semantic-*`)

Five meanings: `info`, `positive`, `negative`, `notice`, `neutral`. Two strengths, each with its
own text pairing:

| Strength      | Fill                              | Text on it                             |
| ------------- | --------------------------------- | -------------------------------------- |
| Subtle (tint) | `bg-ws-semantic-negative`         | `text-ws-semantic-on-subtle-negative`  |
| Solid         | `bg-ws-semantic-inverse-negative` | `text-ws-semantic-on-inverse-negative` |
| No fill       | page or card                      | `text-ws-semantic-negative`            |

Outline: `border-ws-semantic-negative`. Status is a message, not an action: a delete button is
`dynamic-danger`, an error banner is `semantic-negative`. Prefer the components that already do
this (`InlineAlert`, `StatusBadge`, `SystemAlert`, `Toast`) over hand-built status boxes.

## Categorical (`*-ws-non-semantic-*`)

Hues: `blue`, `brand`, `cyan`, `green`, `indigo`, `lime`, `orange`, `pink`, `purple`, `red`,
`teal`, `violet`, `yellow`. Pairs: `bg-ws-non-semantic-teal-subtle` + `text-ws-non-semantic-teal-on-subtle`,
`bg-ws-non-semantic-teal-strong` + `text-ws-non-semantic-teal-on-strong`; outline
`border-ws-non-semantic-teal-default`. Use for labelling categories (projects, people, series).
Never use `red`/`green` here to mean error/success → use `semantic`.

## Selection rules

1. Is it clickable? → `dynamic`. Does it report a state? → `semantic`. Does it only tell
   categories apart? → `non-semantic`. Otherwise → `static`.
2. Text on a filled surface uses that surface's `on-*` pair, never `text-ws-static-*`.
3. Stack surfaces in order: `background` → `foreground`/`container` → `overlay`. Do not put
   `container` on `container`; separate with a border instead.
4. Translucent tints (`alpha-*`) for hover and selection, so they work on any surface below.
5. Need a colour with no class? Read a role variable, `bg-(--ws-static-fill-container)`; only
   as a last resort a primitive, `bg-(--ws-colors-light-brand-600)` (it will not switch in dark).

## Banned

- Tailwind palette classes: `bg-white`, `text-gray-900`, `border-slate-200`, `bg-blue-600`.
- Raw hex, `rgb()`, or `bg-[#4e3ee0]` in component or app code.
- `dark:` variants to fix a colour: the token already switches.
- Primitives (`--ws-colors-*`) where a role class exists.
- `shadow-ws-static-*` classes: they do not exist (shadow colours are not utilities).

## Light and dark

Every class above resolves through a role variable that `.dark` redefines, so the same markup
works in both themes. What changes in dark: the page is the darkest layer and surfaces get
lighter as they rise (`background` < `foreground` < `panel` < `container` < `overlay`); white
fills become translucent white; `highlight-strong` becomes visible. Full mechanics in
[theming.md](theming.md).

## Docs

https://wideset.co/docs/colors · Source: `packages/design-system/src/styles/tokens/`

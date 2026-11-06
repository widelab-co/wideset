# Tokens

Every visual value in Wideset is a token, and every token class carries `ws`. This page tells an
agent how the names are built, which family to reach for, and where to find the full lists. It
does not list every token: the CSS files do.

Foundations: [color](foundations/color.md) · [theming](foundations/theming.md) ·
[elevation](foundations/elevation.md) · [borders and focus](foundations/borders.md) ·
[z-index](foundations/z-index.md) · [spacing](foundations/spacing.md) ·
[radius](foundations/radius.md) · [typography](foundations/typography.md).

## Naming

| Layer     | Shape                                  | Example                                                      | Who uses it                                              |
| --------- | -------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------- |
| Primitive | `--ws-<group>-…` (prefix in front)     | `--ws-colors-light-brand-600`, `--ws-size-4`                 | Overrides for a re-brand. Never in components.           |
| Role      | `--ws-<family>-<kind>-<role>-<state>`  | `--ws-dynamic-fill-primary-hover`, `--ws-static-text-subtle` | Overrides for one role; `bg-(--…)` when no class exists. |
| Utility   | `--<tailwind-namespace>-ws-…`          | `--background-color-ws-dynamic-primary-hover`                | Backs the class.                                         |
| Class     | `<utility>-ws-<family>-<role>-<state>` | `bg-ws-dynamic-primary-hover`                                | Your markup.                                             |

Colour roles use `fill` / `text` / `stroke` in the variable and `bg-` / `text-` / `border-` in
the class: `--ws-static-fill-container` → `bg-ws-static-container`, `--ws-static-stroke-base` →
`border-ws-static-base`. The same colour names also exist as `outline-ws-…` (focus rings),
`fill-ws-…` / `stroke-ws-…` (SVG, from the text roles) and `decoration-ws-…` (underlines).

## Colour families

| Family         | Means                                                          | Roles                                                                                                                                                                           |
| -------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dynamic`      | Interactive. States `default`, `hover`, `pressed`, `disabled`. | `primary`, `secondary`, `tertiary`, `inverse`, `danger`, `success`; text on fills is `on-<role>`; translucent `alpha-` and `alpha-strong-` fills; emphatic `-strong-` strokes   |
| `static`       | Non-interactive surfaces, text and lines. No states.           | Surfaces `background`, `foreground`, `container`, `overlay`, `panel`; `highlight-*`, `alpha-*`, `scrim-base`; text and strokes `subtle`, `base`, `strong`; each with `inverse-` |
| `semantic`     | Status. Not clickable.                                         | `info`, `positive`, `negative`, `notice`, `neutral`; fills plain (tint) or `inverse-` (solid); text `on-subtle-` / `on-inverse-`                                                |
| `non-semantic` | Categories, no meaning.                                        | 13 hues; fills `-subtle` / `-strong`, text `-on-subtle` / `-on-strong`, stroke `-default`                                                                                       |

## Most-used colour classes

| Job                                        | Class                                                                                                                        |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| App page (`main` beside a `Sidebar`)       | `bg-ws-static-foreground`                                                                                                    |
| Ground behind content blocks               | `bg-ws-static-background`                                                                                                    |
| Card, table, panel                         | `bg-ws-static-container`                                                                                                     |
| Menu, popover, modal                       | `bg-ws-static-overlay`                                                                                                       |
| Form field rest fill                       | `bg-ws-static-highlight-base`                                                                                                |
| Modal backdrop                             | `bg-ws-static-scrim-base`                                                                                                    |
| Heading / body / helper text               | `text-ws-static-strong` / `text-ws-static-base` / `text-ws-static-subtle`                                                    |
| Card outline / quiet divider / strong edge | `border-ws-static-base` / `border-ws-static-subtle` / `border-ws-static-strong`                                              |
| Primary action fill and its text           | `bg-ws-dynamic-primary-default` + `text-ws-dynamic-on-primary-default`                                                       |
| Neutral action fill and its text           | `bg-ws-dynamic-secondary-default` + `text-ws-dynamic-on-secondary-default`                                                   |
| Ghost hover tint                           | `hover:bg-ws-dynamic-secondary-alpha-hover`                                                                                  |
| Selected row / nav item                    | `bg-ws-dynamic-tertiary-alpha-strong-default`                                                                                |
| Brand-coloured text or link                | `text-ws-dynamic-primary-default`                                                                                            |
| Input border, focused, invalid             | `border-ws-dynamic-secondary-default`, `border-ws-dynamic-primary-strong-default`, `border-ws-dynamic-danger-strong-default` |
| Focus ring colour                          | `outline-ws-dynamic-primary-strong-default`                                                                                  |
| Error banner                               | `bg-ws-semantic-negative` + `text-ws-semantic-on-subtle-negative`                                                            |
| Solid success badge                        | `bg-ws-semantic-inverse-positive` + `text-ws-semantic-on-inverse-positive`                                                   |
| Category tag                               | `bg-ws-non-semantic-violet-subtle` + `text-ws-non-semantic-violet-on-subtle`                                                 |

## Size, shape and type

| Kind           | Classes                                                                                               | Notes                                                                                                                                               |
| -------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Spacing        | `p-ws-4`, `gap-ws-2`, `mt-ws-8` … steps `ws-0`–`ws-28`                                                | Non-linear: `ws-1` 1px, `ws-3` 4px, `ws-4` 6px, `ws-5` 8px, `ws-9` 16px, `ws-12` 24px, `ws-14` 32px. `p-4` is Tailwind's 16px, not `p-ws-4`.        |
| Control height | `h-ws-forms-xs` · `sm` · `md` · `lg`                                                                  | 24 / 32 / 40 / 48px, the height of buttons and fields                                                                                               |
| Control size   | `size-ws-control-xs` … `xxl`                                                                          | 12–32px, icon and indicator boxes                                                                                                                   |
| Radius         | `rounded-ws-control-sm` · `md` · `lg` · `xl` · `full`; `rounded-ws-container-sm` · `md` · `lg` · `xl` | `control` for things you click, `container` for surfaces                                                                                            |
| Border width   | `border-ws-width-xs` · `sm` · `md` · `lg`                                                             | See [borders](foundations/borders.md)                                                                                                               |
| Type           | `typography-body-md`, `typography-label-strong-sm`, `typography-title-lg` …                           | Composites in `utilities/typography.css`; raw `text-ws-400`, `font-ws-medium`, `leading-ws-600`, `tracking-ws-tight-50` only when no composite fits |
| Shadow         | `shadow-ws-low` · `medium` · `high`                                                                   | See [elevation](foundations/elevation.md)                                                                                                           |
| Stacking       | `z-ws-sticky`, `z-ws-modal`, `z-ws-popout` …                                                          | See [z-index](foundations/z-index.md)                                                                                                               |

## Finding a token

1. Decide the family (interactive? status? category? else static) and the property (`bg`,
   `text`, `border`).
2. Check the name on the [colors page](https://wideset-docs.widelab.workers.dev/docs/colors), which lists every
   colour class once.
3. Size, radius and type classes: `theme-desktop-semantic.css`. Shadows: `utilities/shadow.css`.
   Z-index: `utilities/z-index.css`. Type composites: `utilities/typography.css`.
4. Values per theme: `theme-light-tokens.css`, `theme-dark-tokens.css`; ramps in
   `theme-base-tokens.css`. Visual list: https://wideset-docs.widelab.workers.dev/docs/colors
5. Nothing fits? Use a role variable in arbitrary syntax, `bg-(--ws-static-fill-container)`.
   A Figma value with no token is a Figma bug to report, not a hex to hard-code.

All files above are generated from Figma or maintained by the design system; do not edit them.

## Banned

| Instead of                                                           | Use                                                                                                           |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `bg-white`, `text-gray-900`, `border-slate-200`                      | `bg-ws-static-container`, `text-ws-static-strong`, `border-ws-static-base`                                    |
| `#4e3ee0`, `bg-[#4e3ee0]`, `rgb(…)`                                  | A role class, or `bg-(--ws-…)`                                                                                |
| `p-4`, `gap-2`, `w-64`, `text-sm`, `rounded-lg`, `shadow-md`, `z-50` | `p-ws-*`, `gap-ws-*`, an arbitrary width `w-[16rem]`, `typography-*`, `rounded-ws-*`, `shadow-ws-*`, `z-ws-*` |
| `dark:bg-…`                                                          | Nothing: roles switch with `.dark`                                                                            |
| `bg-(--ws-colors-light-…)` in components                             | The role class (primitives do not switch theme)                                                               |
| New `@theme` names without `ws` (`--spacing-4`, `--radius-lg`)       | A `ws` token; never redefine Tailwind defaults                                                                |

Plain Tailwind classes that do not read a scale (`flex`, `w-full`, `top-1/2`, `p-0`,
`rounded-full`, `border`) are fine.

## `cn()` and tailwind-merge

`cn` (exported from `@wideset/react`) is `clsx` + a tailwind-merge configured for `ws`
tokens, so `cn('p-ws-4', 'p-ws-6')` keeps `p-ws-6` and a consumer `className` overrides a
component class. Spacing, radius, shadow, drop-shadow, font size, weight, family, tracking,
leading and `z-ws-*` are registered in `src/lib/utils.ts`. Colours merge by property (`bg-`,
`text-`, `border-`).

Trap: `border-ws-width-*` is not registered, so tailwind-merge reads it as a border colour and
drops `border-ws-static-base` (or vice versa) in the same call. Use `border` / `border-2` for
width next to a colour class.

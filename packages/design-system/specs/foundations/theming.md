# Theming

Wideset is themed with CSS variables and the cascade: no provider, no build step, no JS. Override
the highest token that covers the change, and every component, state and theme built on it follows.

## Setup

| Import                     | When                                                                                                                                                            |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@wideset/react/styles`    | Default. Compiled tokens, utilities and component classes.                                                                                                      |
| `@wideset/react/theme`     | Your app runs Tailwind v4 and should generate `bg-ws-…` classes itself. Import after `tailwindcss`; add `tailwindcss-radix` and `tailwindcss-animate` yourself. |
| `@wideset/react/preflight` | Your app has no Tailwind: the browser reset components are drawn against.                                                                                       |

Wideset loads no font. Components inherit `font-family` from `body`; set your brand font there,
or point `body` at `var(--font-ws-sans)` for Wideset's Inter stack.

## Token layers

| Layer     | Example                                                           | Override it to                                  |
| --------- | ----------------------------------------------------------------- | ----------------------------------------------- |
| Primitive | `--ws-colors-light-brand-600`, `--ws-colors-dark-brand-600`       | Re-brand: every role built on the ramp follows. |
| Role      | `--ws-dynamic-fill-primary-default`, `--ws-static-fill-container` | Change one role, state by state.                |
| Utility   | `--background-color-ws-dynamic-primary-default`                   | Change one class only. Rarely right.            |

Details and naming: [tokens.md](../tokens.md).

## Three ways to customise

| Approach    | Scope        | Use it when                                                       |
| ----------- | ------------ | ----------------------------------------------------------------- |
| Tokens      | Whole app    | Brand colour, radius, font. Anything that should hold everywhere. |
| `className` | One instance | A one-off: layout, spacing, a rare colour. Token classes only.    |
| Composition | One instance | Change structure: pick, reorder or replace parts; `asChild`.      |

Repeating the same `className` on many instances means it should have been a token override.

```tsx
<Button preset="filled" className="rounded-ws-control-full px-ws-8">
  Fully rounded
</Button>
```

`className` is merged with `cn()` (tailwind-merge), so your class wins a conflict without
`!important`.

## Re-branding via primitives

Load your overrides after Wideset's stylesheet. Light and dark use separate ramps, so a re-brand
overrides both, including the `-opacity-` steps (hover tints and alpha fills are literal colours,
not derived):

```css
:root {
  /* light: role tokens read brand 300–900 and 1100 */
  --ws-colors-light-brand-600: #e0115f;
  --ws-colors-light-brand-800: #b30e4d;
  --ws-colors-light-brand-900: #8f0b3d;
  --ws-colors-light-brand-opacity-600-8: #e0115f14;
  /* dark: role tokens read brand 100–700 and 1000 */
  --ws-colors-dark-brand-600: #e83a7a;
  --ws-colors-dark-brand-opacity-500-16: #ee5c9129;
}
```

To change one role without touching the ramp, override the role variable (and its dark value
under `.dark`):

```css
:root {
  --ws-dynamic-fill-primary-default: #e0115f;
  --ws-dynamic-fill-primary-hover: #c20e53;
}
.dark {
  --ws-dynamic-fill-primary-default: #ff6392;
}
```

Radius, spacing and type are tokens too (`--radius-ws-control-md`, `--radius-ws-container-md`).

## Light and dark

- Light is the default (`:root`). Dark values live under `.dark`; add the class to `<html>` or to
  a wrapper to theme a subtree. `.dark` also sets `color-scheme: dark`.
- The package ships the tokens, not a toggle: `document.documentElement.classList.toggle('dark')`.
- There is no `.light` class: you cannot nest a light island inside a dark page.
- Never write `dark:` variants on Wideset classes; every role already switches.
- Elevation differs by theme: shadows are mostly off in dark, depth comes from surface fills.
  See [elevation.md](elevation.md).

## Desktop mode

Figma has Desktop and Mobile modes for sizes (spacing, control and form heights, radii, type
scale, border widths). Code ships **Desktop only** (`theme-desktop-tokens.css`), always on, with no
class or media query to switch it. Responsive sizing is your layout's job.

## Where overrides must live

Utility variables resolve on `:root` (light) and on the `.dark` element. Put overrides on `:root`
or on `.dark`; an override on some other wrapper (`.brand-x { --ws-dynamic-fill-primary-default: … }`)
does not reach the classes inside it.

## Banned

- Redefining Tailwind defaults in `@theme` (`--spacing-4`, `--radius-lg`, `--font-sans`): it
  changes the consumer's Tailwind too. Wideset tokens all carry `ws`.
- Hard-coding hex in components to "match the brand": override the token.
- Editing files in `src/styles/tokens/`: they are generated from Figma.

## Docs

https://wideset.co/docs/theming · https://wideset.co/docs/colors

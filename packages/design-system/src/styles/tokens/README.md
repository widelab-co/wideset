## Tokens update guide

### How to update the CSS files using Figma tokens.

1. Export CSS from Figma, using the **css2variables** plugin.
2. Paste the `tokens_figma.css` to `src/styles/tokens/` for reference. Note: this file is excluded from the npm build (`dist/`).
3. Transfer all variables from the `[data-theme='Values']` section into `@theme` section in `src/styles/tokens/theme-base-tokens.css`. Make sure the variables are correct (e.g. no commas, like `--border-12,5` - change to `--border-12-5`).
4. Transfer all color variables from the `[data-theme='Light']` section into `@theme` section in `src/styles/tokens/theme-light-tokens.css`.
5. Transfer all color variables from the `[data-theme='Dark']` section into `@layer base .dark` section in `src/styles/tokens/theme-dark-tokens.css`.
6. Transfer all variables **besides --font-family- ones** from the `[data-theme='Desktop']` sections into `@theme` section in `src/styles/tokens/theme-desktop-tokens.css`.
7. From the repository root, run `pnpm prefix-tokens`. Figma names stay unprefixed; this adds the `ws` prefix to every pasted token (`--size-4` → `--ws-size-4`, `--font-weight-medium` → `--ws-font-weight-medium`). It is idempotent, so running it twice is safe.
8. Run `pnpm generate-semantic-variables`. This will update all semantic variables in the theme-x-semantic.css files, based on the figma tokens imported above.

### The `ws` prefix

Every Wideset token and token utility is prefixed: `bg-ws-dynamic-primary-default`, `p-ws-4`, `rounded-ws-control-md`, `font-ws-medium`, `z-ws-modal`. Without it, `@theme` redefines Tailwind's defaults (`--spacing-4`, `--font-weight-medium`, `--font-sans`, …) and a consumer's own Tailwind config or shadcn silently change.

- **Never define a Tailwind default name in `@theme`.** Need a different value? Add a new `ws` token (e.g. `--ws-font-weight-medium` → `font-ws-medium`).
- **Where the prefix goes** (`prefix-tokens.cjs`): semantic tokens in `theme-*-semantic.css` carry it right after the Tailwind namespace (`--background-color-ws-…`, `--spacing-ws-…`; `non-semantic` and `z-index` stay whole), because Tailwind builds the class name from what follows. Primitives in `theme-*-tokens.css` carry it in front (`--ws-colors-light-brand-600`, `--ws-size-4`, `--ws-font-weight-medium`) — nothing derives a class from them and they are what a consumer overrides.
- **Exceptions:** `p-0`/`inset-0`/`min-w-0`… and `rounded-full` stay unprefixed — Tailwind's own classes compute the same value.
- Plain Tailwind classes that don't use Tailwind's scale (`flex`, `w-full`, `top-1/2`, `*-0`) are fine inside components. Scale classes (`w-64`, `text-sm`, `rounded-lg`, `max-w-sm`) are not: the consumer's Tailwind defines the same class name with its own theme, and whichever stylesheet loads last wins for both. Use a `ws` token or an arbitrary value (`w-[16rem]`).

- The base tokens from theme-base-tokens won't be read by the script - these are base tokens, from which others are generated, they shouldn't be used raw.
- There may be some new tokens, which prefixes are not included in the script. Please double-check, and if there are, add them to the script accordingly / check with Design about the change.

## Shadows are maintained by hand

`src/styles/utilities/shadow.css` is **not** produced by the token pipeline above. Neither
the **css2variables** export nor `pnpm generate-semantic-variables` touches it — edit it
manually whenever Design changes an effect style.

### Why it cannot be generated

In Figma, shadows are **effect styles**, not variables. The export plugin only emits
variables, so nothing about them reaches `tokens_figma.css`. On top of that, each effect
style is a _stack_ of drop-shadow layers whose colours are hardcoded 8-bit hex-alpha
values (`#00000014`, `#0000000D`, `#4734F733`, …) rather than references to a colour
token — there is no single variable to bind a shadow to. The one exception is the 1px
outline layer of `Elevation/Low|Medium|High`, which is bound to `Static/Shadow/Outline`;
that is why it is the only layer written as `var(--ws-static-shadow-outline, …)`.

### How to update

1. Open the Shadows page and the Elevation rules in the Figma file.
2. Read the layers off the effect style itself (Figma MCP `get_design_context` reports them
   as `Effect(type: DROP_SHADOW, color: …, offset: …, radius: …, spread: …)`), not off the
   documentation table — the table has been transcribed by hand and has drifted before.
3. Copy the layers in Figma's order. Hex alphas are rounded to two decimals
   (`#14` = 0.078 → `0.08`); `radius` maps to blur, `spread` to the 4th length.
4. Update the mapping comment at the top of `shadow.css` if a style is added or removed.

The library has exactly nine effect styles:

| Figma effect style                                              | utility                                                              |
| --------------------------------------------------------------- | -------------------------------------------------------------------- |
| `Elevation/Low`                                                 | `shadow-ws-low`                                                      |
| `Elevation/Medium`                                              | `shadow-ws-medium`, `drop-shadow-ws-medium`                          |
| `Elevation/High`                                                | `shadow-ws-high`                                                     |
| `Controls/Control`                                              | `shadow-ws-controls-control`                                         |
| `Controls/Tooltip`                                              | `drop-shadow-ws-controls-tooltip`                                    |
| `Forms/Base`                                                    | `shadow-ws-forms-base`                                               |
| `Forms/Active`                                                  | `shadow-ws-forms-active`, `shadow-ws-forms-active-danger`            |
| `Focus/Base`, `Focus/Danger`, `Focus/Success`, `Focus/Inversed` | not shadows in code — see `wds-focus-visible` in `utilities/wds.css` |

`Controls/Control` and `Forms/Base` have identical geometry but different colours
(`#14151A` vs `#1A1A1A`), so they are two separate tokens on purpose. Do not merge them.

### Themes

Figma ships one shadow set and every layer is black, including the token-bound outline ring
(`Static/Shadow/Outline` is black in light _and_ dark). A dark surface sits _lighter_ than
the page behind it, so those layers read as a muddy halo rather than elevation —
**dark mode therefore has no elevation at all**. Depth in dark comes from the surface fills
(`Static/Fill/Background` < `Container` < `Overlay`).

This is done with plain custom-property inheritance, not with overrides fighting the
cascade. Every shadow token is an alias:

```css
:root {
  --ws-elevation-medium: 0px 0px 0px 1px …; /* the real layers */
}
.dark {
  --ws-elevation-medium: 0 0 0 0 transparent;
}
@theme {
  --shadow-ws-medium: var(--ws-elevation-medium);
}
```

Tailwind inlines an `@theme` value into the utility at build time — so `--shadow-ws-medium`
itself cannot be redefined per theme — but it keeps `var()` references intact, emitting
`.shadow-ws-medium{--tw-shadow:var(--ws-elevation-medium)}`. One redefinition under `.dark` then
reaches every utility built from that token, including variant-prefixed ones like
`data-[state=checked]:shadow-ws-low`, with no specificity games and no `!important`.

Two things to keep in mind when editing:

- Use `0 0 0 0 transparent`, not `none`. The compiled declaration is
  `box-shadow: var(--tw-inset-shadow), …, var(--tw-shadow)`, and `none` is not valid as one
  item of a comma-separated list — it would invalidate the whole thing. The `filter` forms
  are the exception: `none` is correct there.
- **Focus rings are not aliased, on purpose.** `shadow-ws-forms-active` / `-danger` are Figma's
  `Forms/Active` effect used as the focus indicator on TextInput, Textarea, Select and
  DatePicker. They hold their layers directly in `@theme`, so the `.dark` block cannot
  switch them off and focus stays visible in both themes.

Do not reintroduce per-theme shadow _values_ — the inverted white shadows that used to live
in this file were legacy, not a Figma decision.

### Caveat: never map colour tokens into `--shadow-*`

`--ws-static-shadow-*` tokens are **colours**, and `--shadow-*` is Tailwind's box-shadow
namespace: mapping them in `generate-semantic-variables.cjs` minted `shadow-ws-static-*`
utilities that resolved to `box-shadow: <colour>` and did nothing (which is how a
non-existent shadow class once ended up on StatusModal). The mapping has been removed —
the raw `--ws-static-shadow-*` tokens are consumed directly by `shadow.css`. Don't re-add it.

## tailwind-merge Configuration

The design system uses `tailwind-merge` to automatically resolve conflicts between Tailwind CSS classes. `src/lib/utils.ts` recognises custom spacing tokens such as `ws-control-xs` and `ws-forms-md` through an `isWs` validator, which accepts every `ws-*` spacing value.

### Important: Updating Custom Size Tokens

**If you add, remove, or rename custom size tokens**, confirm that their classes are covered by the `twMerge` configuration in `src/lib/utils.ts`. New `ws-*` spacing values are already recognised; a new utility namespace may need a validator or class group. The current spacing configuration is:

```typescript
const isWs = (value: string) => value.startsWith('ws-');

const twMerge = extendTailwindMerge<string>({
  extend: {
    theme: {
      spacing: [isWs],
    },
  },
});
```

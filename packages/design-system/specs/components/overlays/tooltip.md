---
name: Tooltip
import: import { Tooltip } from '@wideset/react'
group: overlays
status: stable
parts: [Tooltip, TooltipTrigger, TooltipContent, TooltipLabel, TooltipDescription, TooltipPortal]
related: [Popup, FormField, IconButton]
docs: https://wideset.co/components/tooltip
storybook: components-tooltip--default
---

# Tooltip

> A short, read-only hint about a control, shown on hover and keyboard focus.

## When to use

- Naming or explaining an icon-only control (Share, Filter).
- A one-line extra detail that helps but is not needed to complete the task.

## When not to use

- Anything interactive inside (links, buttons, inputs) → `Popup`.
- Instructions the user needs to fill a field; they must stay visible → `FormField` helper text.
- Errors or status → `InlineAlert` or `Toast`.
- Touch-first screens, where there is no hover: put the text on screen instead.

## Anatomy

```tsx
<Tooltip>
  <Tooltip.Trigger asChild>
    <IconButton icon={RiShareLine} variant="secondary" preset="border" aria-label="Share" />
  </Tooltip.Trigger>
  <Tooltip.Content side="top">
    <Tooltip.Label>Share link</Tooltip.Label>
    <Tooltip.Description>Anyone with the link can view this file.</Tooltip.Description>
  </Tooltip.Content>
</Tooltip>
```

`Tooltip.Content` portals itself to `document.body`. `Tooltip.Description` is optional.
Each `Tooltip` brings its own provider; no app-level wrapper is needed.

## Choosing props

| Prop            | Value                                        | Use for                                                      |
| --------------- | -------------------------------------------- | ------------------------------------------------------------ |
| `variant`       | `default`                                    | A dark tooltip, for light surfaces. The usual choice.        |
|                 | `inverse`                                    | A light tooltip, for dark or coloured surfaces.              |
| `size`          | `md` (default)                               | Body-size text.                                              |
|                 | `sm`                                         | Caption-size text for dense toolbars and tables.             |
| `arrow`         | default `true`                               | `false` when the tooltip sits right next to a large trigger. |
| `delayDuration` | ms, default 100                              | Longer for toolbars where tooltips would flash while moving. |
| `side`          | on Content: `top`, `right`, `bottom`, `left` | Edge of the trigger; flips when there is no room.            |

`variant`, `size` and `arrow` go on `Tooltip`; Label and Description read them. `open` /
`onOpenChange` exist (Radix Tooltip) but are for demos and tests, not app UI.

## Content

- Label: a few words, sentence case, no trailing period ("Share link").
- Description: one short sentence, only when the label is not enough.
- Pick `variant` by the background behind the trigger, not by importance. One `size` per screen.

## Accessibility

- The tooltip is announced as the trigger's description, not its name: an icon-only trigger
  still needs its own `aria-label`.
- The trigger must be focusable (a button, link or `IconButton`), so keyboard users get the hint.
- Never hide information users need only in a tooltip.

## Do / Don't

```tsx
// Do: asChild onto a real control
<Tooltip.Trigger asChild><IconButton icon={RiFilter3Line} aria-label="Filter" /></Tooltip.Trigger>

// Don't: a plain icon is not focusable, and the tooltip never reaches keyboard users
<Tooltip.Trigger asChild><RiInformationLine /></Tooltip.Trigger>
```

- Don't put buttons or links in `Tooltip.Content` → `Popup`.

## Gotchas

- `default` is the dark tooltip and `inverse` the light one. Choose by the surface behind the
  trigger; do not reach for `inverse` to mean "dark".
- A disabled `<button>` receives no hover or focus, so its tooltip never shows. Explain the
  disabled reason in text, or wrap the button in a focusable element.
- Without `asChild`, `Tooltip.Trigger` renders its own `<button>`; do not put a button inside it.
- `Tooltip.Portal` is optional: Content already portals. Wrap only to set a different
  `container` or `forceMount`.

## API

Full props: `https://wideset.co/components/tooltip.md` · Types:
`packages/design-system/src/components/tooltip/Tooltip.types.ts`

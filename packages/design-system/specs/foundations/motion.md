# Motion

Components animate out of the box (press, hover tint, menus, modals, toasts, field errors) and
read every duration, easing, distance and scale from `--ws-motion-*` tokens. Reduced motion is
handled by the tokens themselves, so there is nothing to set up.

Docs: `https://wideset-docs.widelab.workers.dev/docs/motion` · Source:
`packages/design-system/src/styles/utilities/motion.css`, `packages/design-system/src/motion/`

## Tokens

| Token                                                  | Value                             | Used for                                             |
| ------------------------------------------------------ | --------------------------------- | ---------------------------------------------------- |
| `--ws-motion-duration-stagger`                         | 40ms                              | Per-item offset in a staggered list                  |
| `--ws-motion-duration-micro`                           | 80ms                              | Press feedback, hover tint, one shake segment        |
| `--ws-motion-duration-quick`                           | 150ms                             | Menus, closing (tooltip, modal), text swap, checkbox |
| `--ws-motion-duration-fast`                            | 250ms                             | Opening (modal), icon swap, tabs pill                |
| `--ws-motion-duration-medium`                          | 350ms                             | Switch thumb, panel close, toast close               |
| `--ws-motion-duration-slow`                            | 400ms                             | Sidebar collapse, panel open, skeleton reveal        |
| `--ws-motion-duration-very-slow`                       | 500ms                             | Emphasis: success check, badge appear                |
| `--ws-motion-ease-smooth-out`                          | cubic-bezier(0.22, 1, 0.36, 1)    | Open, close, slide, resize                           |
| `--ws-motion-ease-in-out`                              | ease-in-out                       | Cross-fades (icon swap, text swap)                   |
| `--ws-motion-ease-out`                                 | ease-out                          | Menus, tooltip, hover tint                           |
| `--ws-motion-ease-linear`                              | linear                            | Shimmer, spinners, shake envelope                    |
| `--ws-motion-ease-bounce`                              | cubic-bezier(0.34, 1.36, 0.64, 1) | Pop-ins: badge, indicator                            |
| `--ws-motion-ease-bounce-strong`                       | cubic-bezier(0.34, 1.85, 0.64, 1) | Stronger pop-in                                      |
| `--ws-motion-distance-{micro,small,base,medium,large}` | 4 / 6 / 8 / 12 / 30px             | Text swap, shake, slide-in, text reveal, check badge |
| `--ws-motion-scale-{large,medium,small,tiny}`          | 0.96 / 0.97 / 0.98 / 0.99         | Modal, toast, button press and tooltip, unused       |
| `--ws-motion-blur-{small,medium,large}`                | 2 / 3 / 8px                       | Swaps and panel reveal, page slide, success check    |

Rule of thumb: opening is `fast` + `smooth-out`, closing is `quick`, hover and press are
`micro`/`quick` + `ease-out`. Exits are shorter than entrances. Menus fade both ways on `quick`.

## What moves

Only buttons press: `Button`, `IconButton`, `SplitButton` and `Chip` shrink a little
(`--ws-motion-scale-small`) while held. Fields, tabs, menus, list rows, tiles and calendar cells
answer with colour, never with a scale or bounce.

Fields and their menus stay still. The lists of `Select`, `MultiSelect`, `ComboBox`,
`FilterButton` and `DropdownMenu`, the date and time pickers and `Popup` open and close with a
short fade (`--ws-motion-duration-quick`, `--ws-motion-ease-out`): no zoom, no slide.

## Using the tokens in your own UI

Reference tokens with Tailwind's variable syntax, exactly as the components do:

```tsx
<div className="transition-[background-color,opacity] duration-(--ws-motion-duration-quick) ease-(--ws-motion-ease-out)" />
```

Never hard-code `duration-300` or `ease-in` for UI that sits next to Wideset components: it
will not match, and it will not shorten under reduced motion.

## Turning motion off

`MotionProvider` switches built-in animation off for a subtree; `defaultMotion` does it for one
component and wins over the provider (so it can also switch motion back on inside a disabled
subtree).

```tsx
import { Button, MotionProvider } from '@wideset/react';

<MotionProvider enabled={false}>
  <App />
</MotionProvider>

<Button defaultMotion={false}>Save</Button>
```

Components that accept `defaultMotion` include Accordion, ActionBar, ActionTile, Breadcrumbs,
Button, IconButton, LinkButton, SplitButton, Calendar, Checkbox, Chip, ComboBox, DatePicker,
DateRangePicker, DropdownMenu, FileItem, FileUpload, FilterButton, ListItem, Modal,
MultiSelect, Pagination, Popup, ProgressBar, RadioButton, SegmentedControl, Select, Sidebar,
Sidepanel, Slider, StatusModal, Switch, Tabs, TextInput, Textarea, Toast and Tooltip.

## Changing it

Redefine a token in a stylesheet loaded after Wideset's; wrap it in
`prefers-reduced-motion: no-preference` so the reduced-motion override still wins:

```css
@media (prefers-reduced-motion: no-preference) {
  :root {
    --ws-motion-duration-quick: 100ms;
    --ws-motion-scale-small: 1; /* no shrink on press */
  }
}
```

For one instance: `defaultMotion={false}` plus your own `motion-safe:` classes in `className`.

## Reduced motion

Under `prefers-reduced-motion: reduce` every duration drops to 1ms (stagger to 0ms) and every
scale to 1. Components keep their end states but stop moving. Anything you build from the
tokens inherits this; anything with hard-coded timings must add `motion-safe:` /
`motion-reduce:` itself.

## Shake on validation

`useShake` flags a rejected value with a short horizontal shake. It returns a `ref` for
`TextInput` or `Textarea` and a `shake()` to call when validation fails; calling it again
restarts it. Always pair it with a visible error message: the shake is not announced.

```tsx
import { Button, FormField, TextInput, useShake } from '@wideset/react';

const { ref, shake } = useShake<HTMLInputElement>();
// in onSubmit: if (!valid) { setError('Enter a valid email address'); shake(); }

<FormField label="Email" htmlFor="email" errorText={error}>
  <TextInput ref={ref} id="email" name="email" variant={error ? 'danger' : 'primary'} />
</FormField>;
```

## Banned

- Tailwind timing classes (`duration-300`, `ease-in-out`, `delay-150`) on Wideset-adjacent UI.
- Re-implementing a component's built-in animation with your own keyframes; use
  `defaultMotion={false}` first.
- A press scale on anything that is not a button, or a zoom or slide on a menu or picker you
  build yourself.

## Light and dark

Motion does not change with the theme.

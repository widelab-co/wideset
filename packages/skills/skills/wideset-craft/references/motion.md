# Motion

## The rule

Motion belongs to the components. Modal, Sidepanel, DropdownMenu, Tooltip, Toast, Tabs,
SegmentedControl and the form controls already animate with Wideset's motion tokens and turn it
down for reduced motion. **Do not add your own transitions, keyframes or animation libraries to a
screen.**

**Only buttons press (a subtle scale); fields, tabs, menus, list rows, tiles and calendar cells
answer with colour, never with a scale or bounce.** Fields and their menus stay still: a select,
combobox, filter, picker or dropdown menu opens and closes with a short fade, no zoom or slide.
Hold anything you build yourself to the same rule.

## Why

Motion that was never designed together is the loudest inconsistency there is: one panel slides
in 200ms, another fades in 500ms, a third bounces. Wideset's components share one timing set
(`--ws-motion-duration-fast` 250ms, `--ws-motion-duration-medium` 350ms, small fixed distances),
so a screen built only from them already moves as one system.

## When you need more

- Turn component motion off where it is wrong (tests, screenshots, a dense tool) with the
  component's `defaultMotion={false}` or `<MotionProvider enabled={false}>`, not with CSS overrides.
- If a screen genuinely needs its own motion (a list item appearing after an action), use the
  `ws-` motion utilities (such as `ws-slide-in-from-top-*`) and the `--ws-motion-duration-*` and
  `--ws-motion-ease-*` tokens, never raw `duration-300` or `ease-in-out`.
- Motion explains a change (something appeared, moved, was removed). It never decorates, loops or
  waits for attention.
- Respect `prefers-reduced-motion`: keep opacity, drop movement.

Wideset's motion tokens are the motion system. No springs or custom timings on top.

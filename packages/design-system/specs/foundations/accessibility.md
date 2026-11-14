# Accessibility

Wideset components are built on native elements and Radix primitives, so roles, keyboard
support, focus management and live regions come with them. What they cannot know is your
content: names for icon-only controls, labels for fields, why something is disabled. That part
is the consumer's job.

Component-specific rules live in each component spec's Accessibility section; this file holds
the rules shared by all of them.

## Consumer duties

| Duty                          | How                                                                                                                                                                                                                                                                     |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name icon-only controls       | `aria-label` on `IconButton`; icon-only `SegmentedControl.Item` requires it by type                                                                                                                                                                                     |
| Label every field             | Wrap the control in `FormField` with `label` and `htmlFor` matching the control `id`                                                                                                                                                                                    |
| Explain errors in text        | `FormField` `errorText` (linked by `aria-describedby`); a shake or red border alone is not announced                                                                                                                                                                    |
| Title every dialog            | `Modal.Title` / `Popup.Title` / `Sidepanel.Title` inside the content                                                                                                                                                                                                    |
| Keep headings in order        | Use real `h1`–`h6`; `typography-*` classes are visual only                                                                                                                                                                                                              |
| Say why something is disabled | Nearby text or a Tooltip on a focusable wrapper; a disabled control cannot explain itself                                                                                                                                                                               |
| Do not rely on colour         | Status needs text or an icon plus text; see [Iconography](./iconography.md)                                                                                                                                                                                             |
| Make a row one target         | A row that does one thing (opens a record, expands a group, picks an option) is one `button` or link across its full width and height, with the hover fill on the whole row and an inset focus ring; never only its text. Every target is at least 24×24px (WCAG 2.5.8) |

See [Iconography](./iconography.md) for decorative vs meaningful icons.

## Focus

Every interactive component shows a visible focus ring on keyboard focus only. Never remove it
(`outline-none`, `focus:outline-hidden`) on a Wideset component or on anything you wrap it in.

For a custom interactive element, use the same ring Wideset uses:

```tsx
<div
  role="button"
  tabIndex={0}
  className="rounded-ws-control-lg outline-ws-dynamic-primary-strong-default focus-visible:wds-focus-visible"
>
  …
</div>
```

`wds-focus-visible` draws a 2px outline with a 2px offset; the outline colour class sets its
colour (`outline-ws-dynamic-danger-strong-default` for destructive controls). It follows the
element's radius. Prefer a native `<button>` over `role="button"` whenever possible.

## Disabled vs `aria-disabled`

- Native `disabled` (Button, IconButton, Checkbox, Switch, TextInput, …) removes the control from
  the tab order and blocks events. Use it when the action is simply unavailable.
- Elements without a native `disabled` (links, chips, link-style tiles) get `aria-disabled`
  from their `disabled` prop: LinkButton, Chip and ActionTile rendered as a link do this, leave
  the tab order and ignore activation for you.
- Either way, the user cannot discover the reason from the control. Show the reason in text
  next to it.
- `wds-disabled` (`pointer-events-none cursor-default`) is visual only. Never use it as the
  disabled state of a custom control without also setting `disabled` or `aria-disabled`.

## Keyboard

Overlays, menus, tabs, selects, sliders and date pickers use Radix (or equivalent) keyboard
models: arrow keys inside composite widgets, `Escape` to close, focus trapped in a Modal and
returned to the trigger on close. Do not add your own key handlers on top; do not stop
propagation of `Escape` or arrow keys inside them.

## Announcements

Toast, InlineAlert and SystemAlert announce themselves: errors with `role="alert"`, everything
else with `role="status"`. Do not add another live region around them. Write the message so it
makes sense read aloud without the icon.

## Reduced motion

All built-in motion respects `prefers-reduced-motion` through the `--ws-motion-*` tokens; see
[Motion](./motion.md). `MotionProvider enabled={false}` turns animation off app-wide if you
offer an in-app setting.

## Contrast

- Use semantic text classes on their matching surfaces: `text-ws-static-strong`,
  `text-ws-static-base` and `text-ws-static-subtle` on page and container backgrounds; `on-*`
  classes (`text-ws-semantic-on-subtle-positive`, `text-ws-semantic-on-inverse-negative`) on a
  filled surface of the same role. Mixing roles is where contrast breaks → [color.md](color.md).
- Custom colours on Wideset surfaces (brand hex, palette classes) are unchecked; stay on
  tokens and check both themes after a re-brand.
- Disabled colours are intentionally low contrast and are exempt; do not use them for
  readable content.

## Per family

Checks for what you add around the components.

- **Buttons and links.** An action is a `Button`, a destination is a link (`LinkButton`); do not
  swap them. An `IconButton` label names the action and its object ("Delete invoice"), and rows
  that repeat it need distinct names.
- **Forms.** Group related checkboxes or radios with `FormField` `WrapperComponent="fieldset"`;
  the label then names the group. Keep one control per `FormField`. Set `type` and
  `autoComplete` on inputs.
- **Dialogs** (`Modal`, `StatusModal`, `Sidepanel`). Focus returns to the trigger by itself. When
  you open one without a `Trigger` (from a menu item or an effect), make sure focus has
  somewhere sensible to return to.
- **Menus and popups.** Open them from a real `Button` through `asChild`, with a label (an icon
  trigger needs `aria-label`). `DropdownMenu` is for commands and `Select` for values: their roles
  differ, so a screen reader announces them differently.
- **Tooltips.** A `Tooltip` supplements; anything essential is visible without hover, since touch
  has none. Its trigger must be focusable: not a plain `span`, not a disabled `Button`.
- **Tabs and SegmentedControl.** Arrow keys move between items and Tab enters the panel. `Tabs`
  shows sections; `SegmentedControl` picks a value or a view.
- **Tables.** Use `Table` with `Table.Head` and `Table.Header` so every cell has a header; never
  a grid of `div`s. Give sortable headers a `sortAriaLabel`. Selection checkboxes need their own
  names ("Select invoice 1042"), not one shared label. An action-only column still needs a
  heading, even a visually hidden one.
- **Navigation.** `Breadcrumbs` and `Pagination` are labelled `nav` landmarks; when a page has
  two of the same, rename one (`Pagination` `navigationAriaLabel`, or `aria-label` on
  `Breadcrumbs`). After a client-side route change, move focus to the new page's `h1` or `main`.
- **Feedback.** `ProgressBar` needs a `label`; the circle type has none, so name the task in text.
  Messages that must stay findable go in `InlineAlert`, not a `Toast`.

## Check it

1. Tab through the page without a mouse: everything works, in order, with visible focus.
2. Activate each control with Enter or Space and close each overlay with Escape.
3. Zoom to 200%: nothing overlaps or is cut off.
4. Run an automated check (axe, Lighthouse). It finds about a third of problems; it does not
   replace steps 1 to 3.
5. If you can, listen to one flow in a screen reader (VoiceOver, NVDA).

## Banned

- Removing focus outlines; `tabIndex` greater than 0.
- `div`/`span` with `onClick` where a `Button`, `IconButton` or `LinkButton` fits.
- Placeholder text as the only label.
- `aria-hidden` on anything focusable.

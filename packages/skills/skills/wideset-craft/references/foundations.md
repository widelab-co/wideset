# Foundations in short

The shared rules behind every screen. Token lists and scales are on the docs site: [tokens](https://wideset-docs.widelab.workers.dev/docs/tokens.md), [colors](https://wideset-docs.widelab.workers.dev/docs/colors.md), [spacing](https://wideset-docs.widelab.workers.dev/docs/spacing.md), [typography](https://wideset-docs.widelab.workers.dev/docs/typography.md), [icons](https://wideset-docs.widelab.workers.dev/docs/icons.md), [theming](https://wideset-docs.widelab.workers.dev/docs/theming.md).

## Choosing a token

- Clickable: `dynamic`. Reports a state: `semantic`. Only tells categories apart: `non-semantic`. Anything else: `static`. A delete button is `dynamic-danger`, an error banner is `semantic-negative`, and `non-semantic` red or green never means error or success.
- Text on a filled surface takes that surface's `on-*` pair, never `text-ws-static-*`.
- The sidebar and the page share one white surface: `Sidebar` is `bg-ws-static-foreground` with its subtle right line (its default), `main` takes `bg-ws-static-foreground`. Never a grey page beside the white sidebar. Above the page, surfaces stack `-container`, then `-overlay`.
- No class for what you need: a role variable, `bg-(--ws-static-fill-container)`. A primitive such as `--ws-colors-light-brand-600` does not switch in dark.
- Steps are indices: `ws-3` 4px, `ws-5` 8px, `ws-7` 12px, `ws-9` 16px, `ws-11` 20px, `ws-12` 24px, `ws-14` 32px, `ws-16` 40px. A value outside the scale is an arbitrary one (`w-[22rem]`), not `w-64`.
- A custom element beside a `size="md"` control takes `h-ws-forms-md` and `rounded-ws-control-lg`. Inner radius is outer radius minus padding.
- A sticky page header takes `z-ws-sticky`; page layout stays at or below that band. No numbers, and a `transform` or `filter` parent traps a child's z-index.
- `cn()` reads `border-ws-width-*` and a border colour as one group and drops one. Use `border` or `border-2` beside a colour class. Two shadow classes in one `cn()` also keep only the last.
- No `dark:` fix for a shadow or colour, no `duration-300` next to Wideset components, and no tracking on top of a `typography-*` class.

## Theming

- A re-brand overrides the light and the dark ramp, including the `-opacity-` steps: hover tints are literal colours.
- Overrides live on `:root` or `.dark`. On another wrapper they do not reach the classes inside it, and there is no `.light` class for a light island in a dark page.
- Never redefine Tailwind's own names in `@theme` (`--spacing-4`, `--radius-lg`). Repeating one `className` on many instances means it should be a token override.

## Props that repeat

- `variant` is meaning, `preset` is weight. There is no `variant="outline"` or `variant="ghost"`: use `variant="secondary" preset="border"` and `preset="ghost"`. `Button` has no `loading` or `icon` prop: change the label, disable it and compose `Button.Icon`.
- `value` without its handler freezes the control. Stateful components also take `defaultValue`, and the callback fires in both modes.
- `Checkbox` can report `'indeterminate'`: narrow it before storing a boolean. `Select`, `RadioButton`, `Tabs` and `SegmentedControl` values are strings: convert ids at the boundary.
- Router links go through `asChild` on `Button` and `Sidebar.Item`. Every part has a `data-slot`: target `[&_[data-slot=card-header]]:…` before forking a component.

## Icons

- Remix components by reference: always the `icon` prop, on icon parts too (`<Button.Icon icon={RiAddLine} />`). `Avatar` alone takes an element.
- `Line` by default, `Fill` for a selected or active state. Alone, an icon is `1em` and `currentColor`: size with `text-ws-400` to `text-ws-600`, never `w-5` or a `width` attribute.
- A decorative icon gets `aria-hidden="true"`; one with no text beside it gets `role="img"` and `aria-label`. If a row of icons needs tooltips to be understood, use labels.

## Accessibility

- Keep the focus ring: no `outline-none` without a replacement. A custom interactive element takes `outline-ws-dynamic-primary-strong-default focus-visible:wds-focus-visible`, and `wds-disabled` alone does not disable anything.
- Real `h1` to `h6` in order: `typography-*` is visual only. Colour alone never carries a status.
- A disabled control cannot say why: put the reason in nearby text. Native `disabled` when simply unavailable; links, chips and link tiles get `aria-disabled` from their `disabled` prop.
- An `IconButton` label names the action and its object ("Delete invoice"), and repeated rows need distinct names, as do selection checkboxes ("Select invoice 1042"). An action-only table column still has a heading, and sortable headers take `sortAriaLabel`.
- A `Tooltip` trigger is focusable (not a `span` or a disabled `Button`), and what it says is not essential. A dialog opened without a trigger needs somewhere for focus to return.
- Do not add key handlers or live regions around Wideset's overlays, `Toast` and alerts. After a client-side route change, move focus to the page's `h1` or `main`. No `tabIndex` above 0, and no `aria-hidden` on anything focusable.
- `ProgressBar` needs a `label`; the circle type has none, so name the task in text.

## Responsive

- Components have no responsive behaviour: the layout changes, base classes for the phone, `md:` and `lg:` above. Those are Tailwind's widths. `--ws-breakpoints-*` is not valid inside `@media`: write `min-[65rem]:`.
- Under `md`, the shell is one column and the same items open in a left `Sidepanel`; from `md` to `lg`, `Sidebar` with `collapsed`; above that, the full `Sidebar`.
- Tables: `overflow-x-auto` with `stickyColumn`, or hide secondary columns under `md`, or render `ListItem` or `Card` rows. The page never scrolls sideways.
- Footer actions stack on phones, primary on top. A long form on a phone is a page, not an overlay. `min-w-0` and `truncate` or `break-words` on anything of unknown length.
- Touch targets are 44px, and only `lg` controls reach it: use `lg` on touch layouts or space targets at least `gap-ws-5`. Nothing depends on hover. Set `type`, `inputMode` and `autoComplete` on inputs.

## Words

- One word per concept. Numbers as digits. No full stop on labels, buttons or titles. No "please", "oops", "simply" or exclamation marks in errors.
- Headings name the thing ("Invoices", not "Manage your invoices"). A section whose content makes it obvious needs none.
- An error says what went wrong and how to fix it, without blame, and keeps what the user typed: "Enter an email address, like name@company.com".
- A confirmation names what is affected and what cannot be undone, and repeats the action on the button: "Delete invoice" and "Keep invoice", not "Yes" and "No".
- A toast is the result in a few words, past tense: "Invoice sent".
- Helper text says what the field needs or how the value is used. A placeholder is an example, never the label or an instruction, and repeats nothing.
- Sample data varies in length, so it tests the layout.

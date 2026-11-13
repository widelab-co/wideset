---
name: wideset-build
description: Build or change screens with Wideset. Use before writing any UI in a project that uses Wideset, when choosing between similar components (Modal or Sidepanel, Select or RadioButton, Tag or StatusBadge), when combining components into a form, a filterable table or a confirmation, or when a Wideset screen compiles but behaves wrong.
license: Apache-2.0
---

# Build with Wideset

The component source is in the project, or at `https://wideset.co/components/<id>.md`. Read it for exact props. This skill holds what source cannot tell you: which component fits, how they combine, and what breaks without an error.

The pages here and on the docs site are written once. Their examples import from `@wideset/react`. In registry mode (`components/ui/wideset/` in the source) keep the code and take each import from [registry-imports](references/registry-imports.md), since paths cannot be guessed from names.

## Before you write

0. **For a new app, pick its visual direction and start from its screen.** Once per app, before the first screen: [directions](references/specs/patterns/directions.md) describes Flat (one white surface, lines; the default), Frame (navigation on the grey frame, page white), Inset (page a raised card on the grey frame) and Canvas (grey page, content in white cards). If the person gave a screenshot or a reference, match its surround; otherwise ask, or take Flat. Then start from the closest whole screen rather than an empty file: `https://wideset-docs.widelab.workers.dev/blocks/<id>.md` (`kanban`, `process`, `finance-dashboard` for Flat, `communication` for Frame, `calendar` for Inset, `crypto` for Canvas) holds its code. Keep its surround and replace its content. In an existing app, keep the direction it already has. Sign in and sign up start from `sign-in`, `sign-in-card` or `sign-up`.

1. **Find the screen's pattern** and copy its structure:

   | Building                                  | Read                                                                       |
   | ----------------------------------------- | -------------------------------------------------------------------------- |
   | The frame: navigation, toasts             | [app-shell](references/specs/patterns/app-shell.md)                        |
   | A form or settings page                   | [form-page](references/specs/patterns/form-page.md)                        |
   | A table with search, filters, pages       | [list-and-filters](references/specs/patterns/list-and-filters.md)          |
   | One row's detail, opened beside the list  | [detail-in-sidepanel](references/specs/patterns/detail-in-sidepanel.md)    |
   | Delete or another action hard to undo     | [confirm-destructive](references/specs/patterns/confirm-destructive.md)    |
   | Success, error, loading and empty states  | [page-feedback](references/specs/patterns/page-feedback.md)                |
   | Several components sharing state or value | [composition](references/specs/patterns/composition.md)                    |
   | Sign in, sign up, a password reset        | [auth](references/specs/patterns/auth.md)                                  |
   | Anything else                             | [the specs index](references/specs/README.md), which lists every component |

2. **Choose each component from its group**, not from what looks close. Each group file asks the questions in order:
   [actions](references/specs/components/actions/README.md),
   [inputs](references/specs/components/inputs/README.md),
   [selection](references/specs/components/selection/README.md),
   [date and time](references/specs/components/date-time/README.md),
   [feedback](references/specs/components/feedback/README.md),
   [navigation](references/specs/components/navigation/README.md),
   [overlays](references/specs/components/overlays/README.md),
   [data display](references/specs/components/data-display/README.md),
   [layout](references/specs/components/layout/README.md).

3. **Before using a component, read its file.** [good-practices](references/good-practices.md) lists them: when to use it, when not, do and don't, and `Gotchas`, where working code goes wrong. Read its source for props.

## Look-alikes

Choose by what the thing does. These pairs get mixed up most:

| Need                                        | Use                   | Not                  |
| ------------------------------------------- | --------------------- | -------------------- |
| A few options a person compares at a glance | `RadioButton.Group`   | `Select`             |
| A list of commands that run when picked     | `DropdownMenu`        | `Select`             |
| A value typed, or filtered while typing     | `ComboBox`            | `Select`             |
| A setting that applies at once              | `Switch`              | `Checkbox`           |
| A yes or no that applies on submit          | `Checkbox`            | `Switch`             |
| Sections of a page                          | `Tabs`                | `SegmentedControl`   |
| Two to five in-place options or views       | `SegmentedControl`    | `Tabs`               |
| A state (active, failed)                    | `StatusBadge`         | `Tag`                |
| A category                                  | `Tag`                 | `StatusBadge`        |
| Something clickable or removable            | `Chip`                | `Tag`                |
| A short decision or small form that blocks  | `Modal`               | `Sidepanel`          |
| Detail or a long form beside the page       | `Sidepanel`           | `Modal`              |
| Going to another page, as a text link       | `LinkButton`          | `Button` + `onClick` |
| A search field                              | `TextInput`, composed | `Search`             |

## What compiles and still breaks

- `Sidebar` is one tree for both modes: put the nav and `Sidebar.Trigger` straight into `Sidebar.Header` / `Sidebar.Section`. `Sidebar.Expanded` and `Sidebar.Collapsed` wrap only what exists in one mode; never duplicate the nav in both.
- A trigger wrapping your `Button` needs `asChild`; without it a button nests in a button.
- `persistent`, `showCloseButton` and `autoFocusOnOpen` go on `Modal.Content`, not on `Modal`.
- `Modal.Close asChild` closes at once. For a save that can fail, control `open` and close it yourself.
- Controlling `open` does not reset what is inside. Reset the form when the modal opens, not when it closes.
- `FormField` wires only one direct child. Set `WrapperComponent="fieldset"` for a group, and do not wrap the control in a Fragment.
- `errorText` does not turn the border red: also set `variant="danger"` on the control, every time `errorText` is set: `<FormField label="Country" htmlFor="country" errorText={error}><Select id="country" variant={error ? 'danger' : 'primary'} … /></FormField>`.
- A `CheckboxGroup` or `RadioButtonGroup` has no accessible name until you give it one. `FormField` renders no legend: put `id` on the `FormField`, then `aria-labelledby` with that id on the group (or `aria-label` when there is no heading): `<FormField label="Notify me by" id="notify-label" WrapperComponent="fieldset"><CheckboxGroup aria-labelledby="notify-label">…`.
- `Select` has two forms, `options` or composed parts, and they do not mix. A composed `Select` takes `id`, `size` and `aria-*` on `Select.Trigger`.
- An option's `value` cannot be `''`: the empty string means no value.
- `Tile.Radio` works only inside `Tile.RadioGroup`, and a selectable tile holds no other controls.
- `Toast` is imperative: mount one `ToastProvider` in the shell and call `useToast().showToast`.
- Table selection and sorting are yours: the table reports, you hold the state and sort the rows.
- Handlers differ: `Select` uses `onValueChange(value)`, `ComboBox` uses `onChange(value)` and `TextInput` uses `onChange(event)`.
- Overlays stack themselves. Do not add `z-*` to them.
- `p-4` is Tailwind's 1rem, while `p-ws-4` is Wideset's 0.375rem. Zero is `p-ws-0` too, never `p-0` or `mt-0`.

## Styling and content

Style only with `ws` classes, and let components own their looks: `className` is for layout. Look up a token at `https://wideset.co/docs/tokens.md`.

For how a finished screen should look, and for the rules on token choice, focus, icons, words and responsive layout, load `wideset-craft`.

## Before you finish

Re-read what you wrote, and fix any of these:

- A raw `<button>`, `<input>`, `<select>` or `<table>` where Wideset has a component.
- A `FormField` with `errorText` whose control has no `variant`, or a checkbox or radio group with no `aria-labelledby` or `aria-label`.
- A class without `ws` for spacing, colour, radius or type, or a `dark:` variant.
- A component you chose because it looked right, without checking its group file.
- A `Gotchas` line in a component's good-practices file that your code breaks.

Run the type-checker with the project's config and fix all it reports: `npx tsc --noEmit`, or `npx tsc --noEmit -p tsconfig.app.json` in a Vite project, whose root `tsconfig.json` checks no files.

Then load `wideset-review` when the screen is done.

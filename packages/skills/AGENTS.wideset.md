# Wideset

This project builds UI with the Wideset design system, version 1.0.0. These rules apply to every UI change. This file is generated and overwritten on update; put your own rules elsewhere.

## First

Find out how this project consumes Wideset. With `@wideset/react` in `package.json` (mode `npm`) import from it, and `npx wideset info --json` reports the version and setup. With `components/ui/wideset/` in the source (mode `registry`) import from `@/components/ui/wideset/...`.

Before writing UI, load the `wideset-build` skill. Its specs say which component fits and what breaks without an error; component source says only what props exist. Before using a component, read its file, listed in the skill's `references/good-practices.md`.

## Hard rules

1. **Choose before you generate.** Pick each component from the index below by what it does, not by how it looks. Never guess a prop or token: read the component's source or `https://wideset.co/components/<id>.md`. Anything missing there does not exist.
2. **Tokens only.** Every token class carries `-ws-`: `p-ws-4`, `gap-ws-7`, `rounded-ws-control-md`. `p-4` is Tailwind's, with a different value. No palette classes, raw hex, Tailwind scale classes or `dark:` variants: tokens flip in dark mode on their own.
3. **Compose, do not rebuild.** Use Wideset's components and subcomponents (`Card.Header`, `Modal.Content`) before writing your own. Overlay triggers use `asChild`. In Next.js Server Components use named exports (`CardHeader`).
4. **Icons are Remix components passed as props**, from `@remixicon/react`: `<IconButton icon={RiAddLine} aria-label="Add" />`. No inline `<svg>`, no other icon library.
5. **One primary action per view.** Hierarchy comes from type and space, colour carries meaning, and cards do not nest.
6. **Forms: two things that compile and fail.** `FormField errorText={…}` does not turn the control red: also set `variant={error ? 'danger' : 'primary'}` on it. A `CheckboxGroup` or `RadioButtonGroup` has no name: `<FormField label="Notify me by" id="notify" WrapperComponent="fieldset"><CheckboxGroup aria-labelledby="notify">`.
7. **The screen holds the state.** Components own only open, hover and focus. Data, selection, filters and pages live in the screen, and `open` does not reset what is inside an overlay.

## Tokens

Surfaces `bg-ws-static-background` `bg-ws-static-container` `bg-ws-static-overlay`; text `text-ws-static-strong` `text-ws-static-base` `text-ws-static-subtle`; borders `border-ws-static-subtle` `border-ws-static-base` `border-ws-static-strong`.

Type is one class: `typography-subtitle-lg`, `typography-body-md`, `typography-label-sm`, `typography-number-md`. Spacing: `ws-3` 0.25rem, `ws-5` 0.5rem, `ws-7` 0.75rem, `ws-9` 1rem, `ws-12` 1.5rem, `ws-14` 2rem. Your own `ws` classes need `@import '@wideset/react/theme'` in your Tailwind entry CSS.

Font: the page font is variable Inter, set through `--font-ws-sans`; `wideset init` adds it as `styles/wideset-font.css`. Text that looks heavier than the design means no variable font is loaded: load `wideset-setup`.

## Components

- Button: an action with a visible label; `variant` is meaning, `preset` is emphasis, one `filled` per view.
- IconButton: an icon-only action; `aria-label` is required.
- LinkButton: text-style navigation that keeps link semantics.
- SplitButton: a default action plus a menu of related alternatives.
- FilterButton: a compact multi-select toolbar filter; in a form use MultiSelect.
- ActionBar: a floating bulk-action bar while items are selected.
- ActionTile: a tile that opens an action or destination; for selecting use Tile.
- TextInput: one line of free text; a search field is a composed TextInput.
- Textarea: free text over several lines.
- Select: exactly one value from a known list.
- MultiSelect: several values from a known list.
- ComboBox: one value found by typing, optionally a custom value.
- FormField: label + helper/error text around one control.
- FileUpload: a presentational dropzone; your library owns the files.
- FileItem: one row per file: uploading, done or failed.
- Checkbox: an on/off choice saved with the form.
- CheckboxGroup: lays out and names a set of checkboxes.
- RadioButton: exactly one of a short visible set.
- RadioButtonGroup: owns the single value and the keyboard model.
- Switch: a setting that takes effect the moment it flips.
- Slider: a value or range along a scale; values are `number[]`.
- SegmentedControl: one of a few options that changes the view next to it.
- Chip: a small clickable label to toggle a filter or remove a value.
- Tile: static, checkbox or radio tiles; acting tiles are ActionTile.
- DatePicker: a form field for one date, ISO `yyyy-MM-dd`.
- DateRangePicker: a date span with optional presets.
- TimePicker: times at a fixed interval, value `HH:mm`.
- Calendar: an always-visible grid; in a form use DatePicker.
- InlineAlert: persistent feedback attached to one section.
- SystemAlert: a product-wide banner at the top of the page.
- Toast: brief floating feedback through `useToast`.
- ProgressBar: percentage progress, bar or circle.
- ProgressTracker: untitled step segments; titled steps are ProgressStepper.
- Tabs: switch between sibling sections of one page.
- Breadcrumbs: the path to the current page.
- Pagination: page through a collection; it never slices data.
- Sidebar: the permanent app navigation that collapses to icons.
- ProgressStepper: named, ordered steps of a flow.
- Modal: a blocking dialog for a short decision or small form.
- StatusModal: a blocking dialog whose message is a status.
- Popup: a small anchored panel that leaves the page usable.
- Sidepanel: a full-height edge panel for details, long forms or filters.
- DropdownMenu: commands that run on select; never for picking a value.
- Tooltip: a read-only hint on hover or focus.
- Table: records compared across rows; sorting, selection and paging are your state.
- ListItem: one compact row; the row inside menus and selects.
- Avatar: a person, team or the agent orb next to a name.
- Tag: a static category label; colour is categorical.
- StatusBadge: a static state label.
- Card: a bounded surface for one subject; not clickable, not a page wrapper.
- Accordion: named sections opened in place.
- Divider: a horizontal separator, optionally labelled.

## Skills

- `wideset-build`: Build or change screens with Wideset
- `wideset-craft`: The composition and taste layer for any UI built with Wideset, the judgement that turns a correct screen into a sharp one
- `wideset-review`: Review UI built with Wideset before calling it done
- `wideset-setup`: Install and configure the Wideset design system in a React app

Docs: https://wideset.co/docs. Registry: https://wideset.co/r.

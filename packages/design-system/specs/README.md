# Wideset specs

Usage specs for AI agents (and people) **building with** `@wideset/react`. Read this index
first, then only the files the task needs: a component's group file to pick the right component,
its spec (or, in the Wideset skills, its docs page) to use it, a foundation file to style around it, a pattern file to build a screen.

Facts live in the code (types, CVA variants, JSDoc) and in the generated reference
(`https://wideset-docs.widelab.workers.dev/components/<id>.md`). Specs add what the code cannot say: when to use
a component and when not, which variant for which job, how its parts compose, what not to do.
Sources of truth, in order: Figma → code → specs. Writing or changing a spec:
[AUTHORING.md](AUTHORING.md).

## Rules that hold everywhere

- Import components from `@wideset/react`; never rebuild one from Radix or plain elements.
  If no component fits, compose existing ones and say so; don't invent a new public component.
- Style only with `ws` token classes (`bg-ws-static-container`, `p-ws-4`, `gap-ws-5`,
  `rounded-ws-control-md`). Plain Tailwind scale classes (`p-4`, `text-sm`, `rounded-lg`) and
  palette classes (`text-gray-900`) are wrong: see [tokens.md](tokens.md).
- Icons are Remix components passed by reference through the `icon` prop: `icon={RiCheckLine}`
  ([iconography](foundations/iconography.md)).
- Deprecated components (`status: deprecated`) name their replacement on their first line; use
  the replacement even when older code uses the deprecated one.

## Using these specs in your project

Add to your project's `AGENTS.md` or `CLAUDE.md`:

```markdown
UI is built with Wideset (@wideset/react). Before writing UI, read the Wideset specs index
(`specs/README.md`) and only the specs the task needs. Never invent tokens, props or components.
```

Today the specs live in the Wideset repository (`packages/design-system/specs/`). Shipping them
inside the npm package and serving them from the docs site (`llms.txt`) is planned, so the path
in the snippet will point into `node_modules/@wideset/react/` then.

## Components

### [Actions](components/actions/README.md)

- [Button](components/actions/button.md): an action with a visible label; `variant` is meaning,
  `preset` is emphasis, one `filled` per view.
- [IconButton](components/actions/icon-button.md): an icon-only action; `aria-label` is required.
- [LinkButton](components/actions/link-button.md): text-style navigation that keeps link
  semantics.
- [SplitButton](components/actions/split-button.md): a default action plus a menu of related
  alternatives.
- [FilterButton](components/actions/filter-button.md): a compact multi-select toolbar filter; in a
  form use MultiSelect.
- [ActionBar](components/actions/action-bar.md): a floating bulk-action bar while items are
  selected.
- [ActionTile](components/actions/action-tile.md): a tile that opens an action or destination; for
  selecting use Tile.

### [Inputs](components/inputs/README.md)

- [TextInput](components/inputs/text-input.md): one line of free text; a search field is a
  composed TextInput.
- [Textarea](components/inputs/textarea.md): free text over several lines.
- [Search](components/inputs/search.md): **deprecated**, compose TextInput instead.
- [Select](components/inputs/select.md): exactly one value from a known list.
- [MultiSelect](components/inputs/multi-select.md): several values from a known list.
- [ComboBox](components/inputs/combo-box.md): one value found by typing, optionally a custom value.
- [FormField](components/inputs/form-field.md): label + helper/error text around one control.
- [FileUpload](components/inputs/file-upload.md): a presentational dropzone; your library owns the
  files.
- [FileItem](components/inputs/file-item.md): one row per file: uploading, done or failed.

### [Selection](components/selection/README.md)

- [Checkbox](components/selection/checkbox.md): an on/off choice saved with the form.
- [CheckboxGroup](components/selection/checkbox-group.md): lays out and names a set of checkboxes.
- [RadioButton](components/selection/radio-button.md): exactly one of a short visible set.
- [RadioButtonGroup](components/selection/radio-button-group.md): owns the single value and the
  keyboard model.
- [Switch](components/selection/switch.md): a setting that takes effect the moment it flips.
- [Slider](components/selection/slider.md): a value or range along a scale; values are `number[]`.
- [SegmentedControl](components/selection/segmented-control.md): one of a few options that changes
  the view next to it.
- [Chip](components/selection/chip.md): a small clickable label to toggle a filter or remove a
  value.
- [Tile](components/selection/tile.md): static, checkbox or radio tiles; acting tiles are
  ActionTile.

### [Date and time](components/date-time/README.md)

- [DatePicker](components/date-time/date-picker.md): a form field for one date, ISO `yyyy-MM-dd`.
- [DateRangePicker](components/date-time/date-range-picker.md): a date span with optional presets.
- [TimePicker](components/date-time/timepicker.md): times at a fixed interval, value `HH:mm`.
- [Calendar](components/date-time/calendar.md): an always-visible grid; in a form use DatePicker.

### [Feedback](components/feedback/README.md)

- [InlineAlert](components/feedback/inline-alert.md): persistent feedback attached to one section.
- [SystemAlert](components/feedback/system-alert.md): a product-wide banner at the top of the page.
- [Toast](components/feedback/toast.md): brief floating feedback through `useToast`.
- [ProgressBar](components/feedback/progress-bar.md): percentage progress, bar or circle.
- [ProgressTracker](components/feedback/progress-tracker.md): untitled step segments; titled steps
  are ProgressStepper.

### [Navigation](components/navigation/README.md)

- [Tabs](components/navigation/tabs.md): switch between sibling sections of one page.
- [Breadcrumbs](components/navigation/breadcrumbs.md): the path to the current page.
- [Pagination](components/navigation/pagination.md): page through a collection; it never slices
  data.
- [Sidebar](components/navigation/sidebar.md): the permanent app navigation that collapses to
  icons.
- [ProgressStepper](components/navigation/progress-stepper.md): named, ordered steps of a flow.

### [Overlays](components/overlays/README.md)

- [Modal](components/overlays/modal.md): a blocking dialog for a short decision or small form.
- [StatusModal](components/overlays/status-modal.md): a blocking dialog whose message is a status.
- [Popup](components/overlays/popup.md): a small anchored panel that leaves the page usable.
- [Sidepanel](components/overlays/sidepanel.md): a full-height edge panel for details, long forms
  or filters.
- [DropdownMenu](components/overlays/dropdown-menu.md): commands that run on select; never for
  picking a value.
- [Tooltip](components/overlays/tooltip.md): a read-only hint on hover or focus.

### [Data display](components/data-display/README.md)

- [Table](components/data-display/table.md): records compared across rows; sorting, selection and
  paging are your state.
- [Spreadsheet](components/data-display/spreadsheet.md): a dense grid worked cell by cell, with a
  pinned header and row numbers; not a list of rows to open, that is Table.
- [ListItem](components/data-display/list-item.md): one compact row; the row inside menus and
  selects.
- [Avatar](components/data-display/avatar.md): a person, team or the agent orb next to a name.
- [Tag](components/data-display/tag.md): a static category label; colour is categorical.
- [StatusBadge](components/data-display/status-badge.md): a static state label.

### [Layout](components/layout/README.md)

- [Card](components/layout/card.md): a bounded surface for one subject; not clickable, not a page
  wrapper.
- [Accordion](components/layout/accordion.md): named sections opened in place.
- [Divider](components/layout/divider.md): a horizontal separator, optionally labelled.

## Foundations

- [Color](foundations/color.md): colour is a role, not a hue; which surface, text and status class
  goes where.
- [Theming](foundations/theming.md): stylesheets, token layers, light/dark, re-branding.
- [Typography](foundations/typography.md): one `typography-*` class per role; hierarchy by weight
  and colour.
- [Spacing](foundations/spacing.md): the `ws` scale; `p-ws-4` is 0.375rem, `p-4` is not Wideset.
- [Radius](foundations/radius.md): `control` radii for interactive things, `container` for
  surfaces.
- [Borders](foundations/borders.md): widths, stroke roles, the focus ring.
- [Elevation](foundations/elevation.md): how surfaces stack and which shadow each layer takes.
- [Z-index](foundations/z-index.md): named `z-ws-*` bands.
- [Motion](foundations/motion.md): motion tokens, reduced motion, `MotionProvider`.
- [Breakpoints](foundations/breakpoints.md): the `ws` breakpoints and how to use them in Tailwind.
- [Responsive](foundations/responsive.md): adapting a screen from phone to desktop: navigation, tables, touch.
- [Iconography](foundations/iconography.md): Remix icons, the `icon` prop, size and colour.
- [Accessibility](foundations/accessibility.md): what the consumer owes: labels, titles, errors,
  focus.
- [Props](foundations/props.md): handler vocabulary, controlled vs uncontrolled, variant/preset/size, pitfalls.
- [Content](foundations/content.md): the words: labels, errors, empty states, confirmations, toasts.
- [Tokens](tokens.md): how token names are built and how to find the right one.

## Patterns

Wideset has no page templates; patterns are compositions of real components with `ws` layout
classes.

- [App shell](patterns/app-shell.md): Sidebar next to the one scrolling main area.
- [Form page](patterns/form-page.md): FormFields, validation, submit and cancel.
- [List and filters](patterns/list-and-filters.md): search, filters, table, pagination, empty and
  loading.
- [Dense data](patterns/dense-data.md): when a screen is spreadsheet-like; Spreadsheet vs Table vs
  ListItem, density, numbers.
- [Detail in a sidepanel](patterns/detail-in-sidepanel.md): row → Sidepanel with focus return.
- [Confirm destructive](patterns/confirm-destructive.md): Modal or StatusModal + a danger Button.
- [Page feedback](patterns/page-feedback.md): which feedback component for which message.
- [Composition laws](patterns/composition.md): state ownership, overlays, one feedback per result, row actions, loading.

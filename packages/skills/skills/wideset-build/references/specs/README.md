# Wideset specs

Usage specs for AI agents (and people) **building with** `@wideset/react`. Read this index
first, then only the files the task needs: a component's group file to pick the right component,
its good-practices file to use it, a pattern file to build a screen.

Facts live in the code (types, CVA variants, JSDoc) and in the generated reference
(`https://wideset-docs.widelab.workers.dev/components/<id>.md`). Specs add what the code cannot say: when to use
a component and when not, which variant for which job, how its parts compose, what not to do.
Sources of truth, in order: Figma → code → specs.

## Rules that hold everywhere

- Import components from `@wideset/react`; never rebuild one from Radix or plain elements.
  If no component fits, compose existing ones and say so; don't invent a new public component.
- Style only with `ws` token classes (`bg-ws-static-container`, `p-ws-4`, `gap-ws-5`,
  `rounded-ws-control-md`). Plain Tailwind scale classes (`p-4`, `text-sm`, `rounded-lg`) and
  palette classes (`text-gray-900`) are wrong: see [tokens.md](https://wideset-docs.widelab.workers.dev/docs/tokens.md).
- Icons are Remix components passed by reference through the `icon` prop: `icon={RiCheckLine}`
  ([iconography](https://wideset-docs.widelab.workers.dev/docs/icons.md)).
- Deprecated components (`status: deprecated`) name their replacement on their first line; use
  the replacement even when older code uses the deprecated one.

## Components

### [Actions](components/actions/README.md)

- [Button](../good-practices/button.md): an action with a visible label; `variant` is meaning,
  `preset` is emphasis, one `filled` per view.
- [IconButton](../good-practices/icon-button.md): an icon-only action; `aria-label` is required.
- [LinkButton](../good-practices/link-button.md): text-style navigation that keeps link
  semantics.
- [SplitButton](../good-practices/split-button.md): a default action plus a menu of related
  alternatives.
- [FilterButton](../good-practices/filter-button.md): a compact multi-select toolbar filter; in a
  form use MultiSelect.
- [ActionBar](../good-practices/action-bar.md): a floating bulk-action bar while items are
  selected.
- [ActionTile](../good-practices/action-tile.md): a tile that opens an action or destination; for
  selecting use Tile.

### [Inputs](components/inputs/README.md)

- [TextInput](../good-practices/text-input.md): one line of free text; a search field is a
  composed TextInput.
- [Textarea](../good-practices/textarea.md): free text over several lines.
- [Search](../good-practices/search.md): **deprecated**, compose TextInput instead.
- [Select](../good-practices/select.md): exactly one value from a known list.
- [MultiSelect](../good-practices/multi-select.md): several values from a known list.
- [ComboBox](../good-practices/combo-box.md): one value found by typing, optionally a custom value.
- [FormField](../good-practices/form-field.md): label + helper/error text around one control.
- [FileUpload](../good-practices/file-upload.md): a presentational dropzone; your library owns the
  files.
- [FileItem](../good-practices/file-item.md): one row per file: uploading, done or failed.

### [Selection](components/selection/README.md)

- [Checkbox](../good-practices/checkbox.md): an on/off choice saved with the form.
- [CheckboxGroup](../good-practices/checkbox-group.md): lays out and names a set of checkboxes.
- [RadioButton](../good-practices/radio-button.md): exactly one of a short visible set.
- [RadioButtonGroup](../good-practices/radio-button-group.md): owns the single value and the
  keyboard model.
- [Switch](../good-practices/switch.md): a setting that takes effect the moment it flips.
- [Slider](../good-practices/slider.md): a value or range along a scale; values are `number[]`.
- [SegmentedControl](../good-practices/segmented-control.md): one of a few options that changes
  the view next to it.
- [Chip](../good-practices/chip.md): a small clickable label to toggle a filter or remove a
  value.
- [Tile](../good-practices/tile.md): static, checkbox or radio tiles; acting tiles are
  ActionTile.

### [Date and time](components/date-time/README.md)

- [DatePicker](../good-practices/date-picker.md): a form field for one date, ISO `yyyy-MM-dd`.
- [DateRangePicker](../good-practices/date-range-picker.md): a date span with optional presets.
- [TimePicker](../good-practices/timepicker.md): times at a fixed interval, value `HH:mm`.
- [Calendar](../good-practices/calendar.md): an always-visible grid; in a form use DatePicker.

### [Feedback](components/feedback/README.md)

- [Illustration](../good-practices/illustration.md): a drawing for an empty state, a first run or an announcement; not an icon.
- [InlineAlert](../good-practices/inline-alert.md): persistent feedback attached to one section.
- [SystemAlert](../good-practices/system-alert.md): a product-wide banner at the top of the page.
- [Toast](../good-practices/toast.md): brief floating feedback through `useToast`.
- [ProgressBar](../good-practices/progress-bar.md): percentage progress, bar or circle.
- [ProgressTracker](../good-practices/progress-tracker.md): untitled step segments; titled steps
  are ProgressStepper.

### [Navigation](components/navigation/README.md)

- [Tabs](../good-practices/tabs.md): switch between sibling sections of one page.
- [Breadcrumbs](../good-practices/breadcrumbs.md): the path to the current page.
- [Pagination](../good-practices/pagination.md): page through a collection; it never slices
  data.
- [Sidebar](../good-practices/sidebar.md): the permanent app navigation that collapses to
  icons.
- [ProgressStepper](../good-practices/progress-stepper.md): named, ordered steps of a flow.

### [Overlays](components/overlays/README.md)

- [Modal](../good-practices/modal.md): a blocking dialog for a short decision or small form.
- [StatusModal](../good-practices/status-modal.md): a blocking dialog whose message is a status.
- [Popup](../good-practices/popup.md): a small anchored panel that leaves the page usable.
- [Sidepanel](../good-practices/sidepanel.md): a full-height edge panel for details, long forms
  or filters.
- [DropdownMenu](../good-practices/dropdown-menu.md): commands that run on select; never for
  picking a value.
- [Tooltip](../good-practices/tooltip.md): a read-only hint on hover or focus.

### [Data display](components/data-display/README.md)

- [Table](../good-practices/table.md): records compared across rows; sorting, selection and
  paging are your state.
- [Spreadsheet](../good-practices/spreadsheet.md): a dense grid worked cell by cell, with a
  pinned header and row numbers; not a list of rows to open, that is Table.
- [ListItem](../good-practices/list-item.md): one compact row; the row inside menus and
  selects.
- [Avatar](../good-practices/avatar.md): a person, team or the agent orb next to a name.
- [Tag](../good-practices/tag.md): a static category label; colour is categorical.
- [StatusBadge](../good-practices/status-badge.md): a static state label.
- [Count](../good-practices/count.md): how many items sit behind a label.

### [Layout](components/layout/README.md)

- [Card](../good-practices/card.md): a bounded surface for one subject; not clickable, not a page
  wrapper.
- [Accordion](../good-practices/accordion.md): named sections opened in place.
- [Divider](../good-practices/divider.md): a horizontal separator, optionally labelled.

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

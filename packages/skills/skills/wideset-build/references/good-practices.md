# Good practices

One file per component: when to use it, when not, do and don't, and gotchas. Read a component's file before you use it, and its source for props. To choose between components, start from the group file in each heading. Rules for every component: [the specs index](specs/README.md#rules-that-hold-everywhere) and [what compiles and still breaks](../SKILL.md#what-compiles-and-still-breaks).

## [Actions](specs/components/actions/README.md)

- [Button](good-practices/button.md): an action with a visible label; `variant` is meaning, `preset` is emphasis, one `filled` per view.
- [IconButton](good-practices/icon-button.md): an icon-only action; `aria-label` is required.
- [LinkButton](good-practices/link-button.md): text-style navigation that keeps link semantics.
- [TextLink](good-practices/text-link.md): a link inside a sentence; it takes the sentence's type.
- [SplitButton](good-practices/split-button.md): a default action plus a menu of related alternatives.
- [FilterButton](good-practices/filter-button.md): a compact multi-select toolbar filter; in a form use MultiSelect.
- [ActionBar](good-practices/action-bar.md): a floating bulk-action bar while items are selected.
- [ActionTile](good-practices/action-tile.md): a tile that opens an action or destination; for selecting use Tile.

## [Inputs](specs/components/inputs/README.md)

- [TextInput](good-practices/text-input.md): one line of free text; a search field is a composed TextInput.
- [Textarea](good-practices/textarea.md): free text over several lines.
- [Search](good-practices/search.md): **deprecated**, compose TextInput instead.
- [Select](good-practices/select.md): exactly one value from a known list.
- [MultiSelect](good-practices/multi-select.md): several values from a known list.
- [ComboBox](good-practices/combo-box.md): one value found by typing, optionally a custom value.
- [FormField](good-practices/form-field.md): label + helper/error text around one control.
- [FileUpload](good-practices/file-upload.md): a presentational dropzone; your library owns the files.
- [FileItem](good-practices/file-item.md): one row per file: uploading, done or failed.

## [Selection](specs/components/selection/README.md)

- [Checkbox](good-practices/checkbox.md): an on/off choice saved with the form.
- [CheckboxGroup](good-practices/checkbox-group.md): lays out and names a set of checkboxes.
- [RadioButton](good-practices/radio-button.md): exactly one of a short visible set.
- [RadioButtonGroup](good-practices/radio-button-group.md): owns the single value and the keyboard model.
- [Switch](good-practices/switch.md): a setting that takes effect the moment it flips.
- [Slider](good-practices/slider.md): a value or range along a scale; values are `number[]`.
- [SegmentedControl](good-practices/segmented-control.md): one of a few options that changes the view next to it.
- [Chip](good-practices/chip.md): a small clickable label to toggle a filter or remove a value.
- [Tile](good-practices/tile.md): static, checkbox or radio tiles; acting tiles are ActionTile.

## [Date and time](specs/components/date-time/README.md)

- [DatePicker](good-practices/date-picker.md): a form field for one date, ISO `yyyy-MM-dd`.
- [DateRangePicker](good-practices/date-range-picker.md): a date span with optional presets.
- [TimePicker](good-practices/timepicker.md): times at a fixed interval, value `HH:mm`.
- [Calendar](good-practices/calendar.md): an always-visible grid; in a form use DatePicker.

## [Feedback](specs/components/feedback/README.md)

- [InlineAlert](good-practices/inline-alert.md): persistent feedback attached to one section.
- [SystemAlert](good-practices/system-alert.md): a product-wide banner at the top of the page.
- [Toast](good-practices/toast.md): brief floating feedback through `useToast`.
- [ProgressBar](good-practices/progress-bar.md): percentage progress, bar or circle.
- [ProgressTracker](good-practices/progress-tracker.md): untitled step segments; titled steps are ProgressStepper.

## [Navigation](specs/components/navigation/README.md)

- [Tabs](good-practices/tabs.md): switch between sibling sections of one page.
- [Breadcrumbs](good-practices/breadcrumbs.md): the path to the current page.
- [Pagination](good-practices/pagination.md): page through a collection; it never slices data.
- [Sidebar](good-practices/sidebar.md): the permanent app navigation that collapses to icons.
- [ProgressStepper](good-practices/progress-stepper.md): named, ordered steps of a flow.

## [Overlays](specs/components/overlays/README.md)

- [Modal](good-practices/modal.md): a blocking dialog for a short decision or small form.
- [StatusModal](good-practices/status-modal.md): a blocking dialog whose message is a status.
- [Popup](good-practices/popup.md): a small anchored panel that leaves the page usable.
- [Sidepanel](good-practices/sidepanel.md): a full-height edge panel for details, long forms or filters.
- [DropdownMenu](good-practices/dropdown-menu.md): commands that run on select; never for picking a value.
- [Tooltip](good-practices/tooltip.md): a read-only hint on hover or focus.

## [Data display](specs/components/data-display/README.md)

- [Table](good-practices/table.md): records compared across rows; sorting, selection and paging are your state.
- [ListItem](good-practices/list-item.md): one compact row; the row inside menus and selects.
- [Avatar](good-practices/avatar.md): a person, team or the agent orb next to a name.
- [Tag](good-practices/tag.md): a static category label; colour is categorical.
- [StatusBadge](good-practices/status-badge.md): a static state label.

## [Layout](specs/components/layout/README.md)

- [Card](good-practices/card.md): a bounded surface for one subject; not clickable, not a page wrapper.
- [Accordion](good-practices/accordion.md): named sections opened in place.
- [Divider](good-practices/divider.md): a horizontal separator, optionally labelled.

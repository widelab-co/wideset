# @wideset/react

## 1.1.0

### Breaking changes

- **Card:** the lines under the header and above the footer are off by default. Add `divider` to keep them, for example on a card with a table, a list or a footer of actions:

  ```tsx
  <Card divider>…</Card>
  ```

- **Chip:** the root is a passive container: it no longer has a button role, a tab stop or keyboard activation. Move the main action to `Chip.Action` and the text to `Chip.Label`. For removal, add a sibling `Chip.IconButton` with an accessible name and your own handler:

  ```tsx
  // Before
  <Chip onClick={applyFilter}>
    <Chip.Icon icon={RiMapPinLine} />
    Warsaw
  </Chip>

  // After
  <Chip>
    <Chip.Action onClick={applyFilter}>
      <Chip.Icon icon={RiMapPinLine} />
      <Chip.Label>Warsaw</Chip.Label>
    </Chip.Action>
    <Chip.IconButton aria-label="Remove Warsaw" onClick={removeFilter} />
  </Chip>
  ```

- **FormField:** the label's info tooltip opens from a `<button>` (`data-slot="field-label-tooltip"`) instead of a focusable `<svg>`, and a required control's accessible name no longer ends with `*`. `[data-slot=field-label]` now matches the `<label>` itself; the row around it is `[data-slot=form-field-label-row]`. Update tests and styles that target the old elements. If you installed from the registry, run `npx wideset add form-field --overwrite` to get the new `field-label` parts.
- **IconButton:** requires `aria-label` or `aria-labelledby`, also with `asChild` and in `TextInput.IconButton` and `Toast.IconAction`. `IconButton.Icon`, `IconButtonIcon` and `IconButtonIconProps` are removed: pass the icon through the `icon` prop (inside a regular Button use `Button.Icon`):

  ```tsx
  // Before
  <IconButton icon={RiCloseLine} />

  // After
  <IconButton icon={RiCloseLine} aria-label="Close" />
  ```

- **ProgressBar:** is composed from parts. `variant` is renamed to `status`; `label`, `description`, `fixedWidth` and `getValueLabel` are removed. `className` and `ref` reach the root column instead of the track; style the track through `ProgressBar.Track`. A `type="circle"` bar shows its percentage only with `<ProgressBar.Value />`:

  ```tsx
  // Before
  <ProgressBar value={65} label="Uploading assets" description="12 of 18 files uploaded" />

  // After
  <ProgressBar value={65}>
    <ProgressBar.Header>
      <ProgressBar.Label>Uploading assets</ProgressBar.Label>
      <ProgressBar.Value />
    </ProgressBar.Header>
    <ProgressBar.Track />
    <ProgressBar.Description>12 of 18 files uploaded</ProgressBar.Description>
  </ProgressBar>
  ```

- **SegmentedControl:** behaves as a radio group. `rovingFocus` on the root and `name` on items are removed: set `name` on the group. Arrow keys select the focused item and Enter no longer activates it. Track changes with `onValueChange`, not item click handlers. Selectors use `data-state="checked"` / `"unchecked"` instead of `"on"` / `"off"`:

  ```tsx
  // Before
  <SegmentedControl rovingFocus defaultValue="list">
    <SegmentedControl.Item name="view" value="list">List</SegmentedControl.Item>
  </SegmentedControl>

  // After
  <SegmentedControl name="view" defaultValue="list">
    <SegmentedControl.Item value="list">List</SegmentedControl.Item>
  </SegmentedControl>
  ```

- **Switch:** `className` styles the switch control (the same element as `ref`); move row layout classes to the new `wrapperClassName`. Passing both `label` and children is a type error. `SwitchProps` is a union, so extend it with a type alias, not an interface:

  ```tsx
  // Before
  <Switch className="w-full justify-between" label="Email notifications" />
  interface SettingProps extends SwitchProps { hint?: string }

  // After
  <Switch wrapperClassName="w-full justify-between" label="Email notifications" />
  type SettingProps = SwitchProps & { hint?: string };
  ```

- **Table:** an ordinary table no longer gets `tabIndex={-1}`. To keep programmatic focus, set it yourself: `<Table tabIndex={-1}>`. An explicit `tabIndex` also overrides the sticky table's default of `0`.
- **Tabs:** `Tabs.Item.active` is removed. Control the selection on the root with `value` and `onValueChange` (or `defaultValue`):

  ```tsx
  // Before
  <Tabs.Item value="billing" active={selectedTab === 'billing'}>Billing</Tabs.Item>

  // After
  <Tabs value={selectedTab} onValueChange={setSelectedTab}>
    <Tabs.List>
      <Tabs.Item value="billing">Billing</Tabs.Item>
    </Tabs.List>
  </Tabs>
  ```

- **Typography:** the type scale follows Figma's renamed text styles: titles are 24/32/40px and subtitles 16/18/20px. `typography-subtitle-lg` and the 48–72px display sizes are removed, and the `title-*` and `subtitle-*` classes change size. `Card.Title` is 16px (was 20px), Modal, Popup and StatusModal titles 18px (was 20px) and the Sidepanel title 20px (was 24px). Migrate by role:

  | Old class (size)                                     | New class (size)                                                    |
  | ---------------------------------------------------- | ------------------------------------------------------------------- |
  | `typography-subtitle-lg` (32)                        | `typography-title-md` (32): page heading                            |
  | `typography-subtitle-md` (24), heading or key figure | `typography-title-sm` (24) for a heading, `title-md` (32) for a KPI |
  | `typography-subtitle-md` (24), side panel title      | `typography-subtitle-md` (20)                                       |
  | `typography-subtitle-sm` (20)                        | `typography-subtitle-sm` (18)                                       |
  | `typography-subtitle-xs` (18)                        | `typography-subtitle-xs` (16)                                       |
  | `typography-title-lg` / `-md` / `-sm` (72 / 56 / 48) | `typography-title-lg` (40) for the one figure a page is about       |

### New components

- **AppShell:** the full-height frame a screen sits in, with `AppShell.Main` (`AppShellMain`) for the page. `direction="inset" | "flat" | "frame" | "canvas"` sets the window background, the page's look and the surface of a `Sidebar` inside it.
- **Illustration:** Figma's line drawings (`calendar`, `computer`, `folder`, at `lg` 240px and `sm` 140px) for empty states, first runs and announcements. They follow the text and primary colours, so dark mode and a rebrand recolour them.
- **Spreadsheet:** a dense grid people work through cell by cell, with 32px or 40px rows, grid lines, a pinned header, row numbers and arrow-key navigation around one selected cell.

### Features

- **Chip:** new `Chip.Action`, `Chip.Label` and `Chip.IconButton` parts (also `ChipAction`, `ChipLabel`, `ChipIconButton`) for independent main and removal actions.
- **FormField:** the tooltip trigger is a real `<button>` named by `tooltipAriaLabel` ("More information" by default), and `suffix` sits inside the label, so "(optional)" is part of the control's accessible name.
- **ProgressBar:** parts `ProgressBar.Header`, `.Label`, `.Value`, `.Track` and `.Description` (also exported by name), `formatValue(value, max)` and `asChild`. The label names the bar and the description describes it.
- **Select, MultiSelect:** with `preset="ghost"` the field reads as a value: the arrow shows only on hover, focus or open, and a prefix sits beside the value without a divider.
- **Sidebar:** `surface="page" | "tinted" | "frame"`, which follows the `AppShell` direction by default; `Sidebar.Footer` (`SidebarFooter`); `Sidebar.Item` `suffix` for a count or badge, `suffixOnHover` for a shortcut shown on hover and focus, and `nested` for a child of the item above.
- **Styles:** `font-ws-mono` (IBM Plex Mono with system fallbacks) for code and terminals; `decoration-ws-*` utilities for text decoration colours; `ws-scrollbar` on an element, or `ws-scrollbars` on `<html>`, to match Wideset's scrollbars.
- **Switch:** `Switch.Description` (`SwitchDescription`) for supporting text under a composed label, announced as the switch's description.
- **Table:** `Table.CellDescription` (`TableCellDescription`), a quieter second line under a cell's label.
- **Tabs:** `Tabs`, `Tabs.List`, `Tabs.Item` and `Tabs.Label` forward `ref`.

### Fixes

- **Avatar:** an icon avatar no longer announces "Default User Icon"; `aria-label` names it, with its `status` added. A clickable icon avatar warns in the console without `aria-label`. `Avatar` and `Avatar.More` with `onClick` show the focus ring only on keyboard focus.
- **Calendar:** with `today` set and nothing selected it opens on the month of `today` (also in DatePicker and DateRangePicker); with `mode="multiple"` on the earliest selected date.
- **Card:** in a grid track or a flex row a card no longer grows to fit wide content; a table in `Card.Content` scrolls inside it.
- **Checkbox, RadioButton:** keep the checked fill on keyboard focus.
- **DateRangePicker:** in controlled mode the first click of a range is no longer dropped; `presetLabels` also labels the trigger while a preset is active; presets count from the `today` prop.
- **FilterButton:** the list stays where it opened while you tick options, and a long selected value ends with an ellipsis.
- **Modal, StatusModal, Sidepanel:** no browser focus ring around the whole dialog when the dialog itself takes focus.
- **MultiSelect, FilterButton:** the lists stop at the room left in the window and scroll, as Select and ComboBox do.
- **RadioButton, Pagination, Tabs:** arrow-key navigation and focus fixed; SegmentedControl and Tabs show keyboard focus.
- **ScrollArea:** `onScroll` is attached to the scrolling viewport, so it receives scroll events and `event.currentTarget` gives the scroll position.
- **Select:** a long value stays on one line and ends with an ellipsis (also in MultiSelect, ComboBox, Timepicker and Pagination).
- **StatusBadge:** an icon with bare text keeps its label padding instead of collapsing to an icon-sized square.
- **Styles:** `@wideset/react/styles` is about 32 KB smaller: it no longer carries classes only the blocks use.
- **Table:** no unintended focus after a row click; sticky tables stay keyboard-scrollable with a Wideset focus outline. `Table.Foot` with several rows draws its top line once.
- **Toast:** an expanded toast renders every `Toast.Action`; a basic toast keeps one and warns when given more.

### Design (Figma parity)

- **Avatar:** initials show one letter at `xs` and `sm`.
- **Buttons and controls:** only free-standing buttons shrink on press, also not when used as popup triggers. Split buttons, selects, pickers, tabs, chips, list rows, tiles and calendar days don't scale.
- **Card:** `Card.Description` sits 2px under `Card.Title` (was 8px).
- **Colours:** body text (`--ws-static-text-base`) is neutral-800 in light mode (was neutral-900); the neutral fill (`--ws-semantic-fill-neutral`, neutral StatusBadge and SystemAlert) is 8% black in light mode (was 12%).
- **ComboBox:** the clear button sits right before the arrow.
- **FilterButton:** 4px more between the value and the clear button at the small size.
- **SegmentedControl:** unselected icon colour and selection fill.
- **Select, ComboBox:** the list opens 4px below the field (was 13px and 9px).
- **Sidebar:** parts line up on one right edge; a collapsed sidebar keeps every part on the rail's centre line, cuts section headers short and draws the unfold icon.
- **Scrollbars:** match ScrollArea in AppShell.Main, ComboBox, FilterButton, Modal.Body, Select, Spreadsheet, Textarea and every block.
- **Table:** a sortable column that is not sorted shows quiet up-down arrows.
- **Thumbnail:** PDF thumbnails use the Pink Strong token.

## 1.0.0

First public release.

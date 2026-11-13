# @wideset/react

## 1.1.0

### Minor Changes

- 128ef25: New `AppShell`: the full-height frame a screen sits in, with `AppShell.Main` (`AppShellMain`) for the page. `direction="inset" | "flat" | "frame" | "canvas"` sets the window background, the page's look and the surface of a `Sidebar` inside it in one prop. `inset`, the default, is the raised white page on the grey app frame from Figma's Calendar screen; `canvas` is the grey page with white sections from the Crypto screen. `Sidebar` outside an `AppShell` is unchanged.
- 83e55d6: Card's lines under the header and above the footer are optional: `<Card divider>` draws them, and they are off by default, matching Figma's new `Divider` property. Without them the header→content and content→footer gaps are the content's 20px padding. `Card.Description` now sits 2px under `Card.Title` (was 8px), matching Figma's Gap/2, so the title and description read as one unit.
- 3824352: `font-ws-mono`: a monospace family token (`--font-ws-mono`, IBM Plex Mono with system fallbacks) for code, terminals and diffs. Like `font-ws-sans`, the package ships only the variable; the page loads the font.
- 8f467b6: `wideset init` adds variable Inter as the page font by default; `--no-font` keeps your own.
- 6c8bcbc: `Select` and `MultiSelect` with `preset="ghost"` read as a value: its arrow shows only while the field is hovered, focused or open (always on touch screens), and a prefix sits beside the value with no divider. Bordered selects are unchanged. The Select and MultiSelect specs say so.
- 6c8bcbc: `Sidebar` lines its parts up on one right edge: a scrollable section ends where the header and footer end, and a collapsible group row built on a `<button>` reads left-aligned. New `Sidebar.Item` `suffix` for a count or badge on the row's edge, and `Sidebar.Footer` (named export `SidebarFooter`) for the bottom area.
- 6c8bcbc: `Sidebar.Item` takes `nested` for a child of the item above (Figma `Nesting=Level 1`): indented so its icon starts under the parent's label, with no guide line.
- 128ef25: `Sidebar` takes `surface="page" | "tinted" | "frame"`: what it sits on (white with a line, a grey tint, or the bare grey app frame). Inside an `AppShell` it follows the app's `direction` without the prop; set it to override the direction or for a sidebar outside an `AppShell`.
- 100501d: New `Spreadsheet`: a dense grid people work through cell by cell, with 32px or 40px rows, grid lines on every cell, a pinned header and row numbers, and arrow-key navigation around one selected cell. The skills add its good practices and a dense-data pattern.
- 963d7a5: `Switch`: `className` now lands on the switch control, the same element as `ref` and the other props, and the new `wrapperClassName` styles the row around it. `label` and children are mutually exclusive in the types. `Switch.Description` (`SwitchDescription`) adds supporting text under a composed label and is announced as the switch's description (`aria-describedby`, merged with a caller's value).
- 6c8bcbc: New `Table.CellDescription` (named export `TableCellDescription`): a quieter second line under a cell's label, as Figma's Table Cell `Description`. The label keeps the table's type for its size.
- 4a406ca: Body text is one step lighter in light mode: `--ws-static-text-base` is now neutral-800 (#3b3b3b) instead of neutral-900 (#2e2e2e), so strong, base and subtle text sit at even steps (21 and 21 L\*) and base text separates from strong titles. Contrast on white is now 11.2:1 (was 13.6:1). Dark mode is unchanged.
- f19e0d5: The type scale has titles at 24/32/40px and subtitles at 16/18/20px, matching the renamed Wideset Core text styles in Figma. A title's size now follows its container: the page heading stays 32px (`typography-title-md`), and the titles of cards, sections and dialogs get smaller. The 48–72px display sizes are gone.

### Patch Changes

- af20869: `Avatar` and `Avatar.More` with an `onClick` show their focus ring only on keyboard focus; before, the ring was drawn all the time.
- 422cd6c: An icon `Avatar` no longer announces "Default User Icon": the icon is decorative, and `aria-label` on `Avatar` now names it (an image, or a button with `onClick`), with its `status` added to the name. A clickable icon `Avatar` needs `aria-label`; a console warning says so when it is missing.
- 455341a: `Avatar` with `initials` draws only the first letter at `xs` and `sm` (20 and 24px), as Figma does: two letters crowded those circles. The same goes for initials shown while a `src` image loads or after it fails. Pass the full initials; larger sizes still show both.
- d207893: Calendar: with `today` set and nothing selected, the calendar (and the DatePicker and DateRangePicker popups) opens on the month of `today` instead of the real current month. With `mode="multiple"` it opens on the earliest selected date.
- 83e55d6: A card in a grid track or a flex row no longer grows to fit wide content: a table in `Card.Content` scrolls horizontally inside the card.
- 663cfa6: DateRangePicker: in controlled mode (`selected` + `onSelect`) the first click of a range in the calendar is no longer dropped, so the reported range starts on the day the user clicked first.
- 2db290c: DateRangePicker: `presetLabels` now also labels the trigger while a preset is active (it showed the built-in English label before), and a key set to `undefined` falls back to the built-in label instead of an empty button.
- f626f85: DateRangePicker: the date presets (Today, This Week, Last Month, …) and `defaultDatePreset` now count from the `today` prop the calendar uses, instead of always from the real clock, so a screen with a fixed sample date can use presets.
- 6c8bcbc: `FilterButton`'s list no longer slides sideways while you tick options: it stays where it opened as the trigger's summary grows. The small size also leaves 4px more between the selected value and the clear button.
- 6c8bcbc: `Select` keeps its value on one line, aligned to its start (left, or right with `dir="rtl"`), and cuts a long label with an ellipsis, with or without a prefix (it used to centre and wrap onto two lines). The fields built on its trigger (`MultiSelect`, `ComboBox`, `Timepicker`, `Pagination`) follow. `FilterButton` cuts a long selected value with an ellipsis instead of clipping it.
- 862a4fe: A collapsed `Sidebar` keeps every part on the rail's centre line: a scrollable `Sidebar.Section` no longer reserves a scrollbar gutter when collapsed, which pushed its items 5px left of the trigger and the footer, and `Sidebar.Header` and `Sidebar.Footer` centre what they hold. Expanded is unchanged.
- 862a4fe: A collapsed `Sidebar` shows each `Sidebar.SectionHeader` cut short ("P…") where it used to leave an empty gap, as in Figma, so the groups in the rail stay apart and named. Expanded is unchanged.
- 862a4fe: A collapsed `Sidebar.Trigger` draws the unfold icon (arrow pointing right, panel bar on the right), as in Figma, instead of the fold icon turned round, which put the bar on the left. Expanded is unchanged.
- de664b5: `StatusBadge` with an icon and bare text (`<StatusBadge.Icon … />Failing`) keeps its label padding; before, the text was ignored by the icon-only styles and the badge collapsed to an icon-sized square unless the text sat in `StatusBadge.Label`.
- 4a406ca: The neutral `StatusBadge` (low emphasis) and the neutral `SystemAlert` are lighter in light mode: `--ws-semantic-fill-neutral` is now 8% black instead of 12%, matching dark mode's 8%.
- a9dfce4: `Table.Foot` with several rows draws its top line only above the first footer row, not above every row.
- b8daf1b: `Table.Header` draws a sortable column that is not sorted yet with up-down arrows (`RiArrowUpDownLine`) instead of left-right ones, which read as "swap" rather than "sort".
- c7e5039: `Table.Header`: the sort icon of a column that is not sorted is quiet (`text-ws-static-subtle`), so the labels lead and the sorted column stands out. The sorted column's icon is unchanged.
- 60f09cc: An expanded `Toast` renders every `Toast.Action` in order instead of only the first. A basic toast keeps one action and warns in the console when given more.

## 1.0.0

First public release.

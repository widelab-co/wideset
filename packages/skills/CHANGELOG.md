# @wideset/skills

## 1.1.0

### Minor Changes

- 83e55d6: Card's lines under the header and above the footer are optional: `<Card divider>` draws them, and they are off by default, matching Figma's new `Divider` property. Without them the header→content and content→footer gaps are the content's 20px padding. `Card.Description` now sits 2px under `Card.Title` (was 8px), matching Figma's Gap/2, so the title and description read as one unit.
- f19e0d5: `wideset-craft` defaults to 32px controls (`size="sm"`; 40px is the comfortable mode on request), budgets status colour to states that need action, ranks text by `strong` against `subtle`, keeps list rows to a title and one metadata line, and marks a selected row like the active Sidebar item. `wideset-build` keeps `LinkButton` out of rows of buttons.
- f19e0d5: `wideset-craft` and the typography foundation follow the new scale: a title's size follows its container. The page title stays `typography-title-md` (32px), card and section titles are `typography-subtitle-xs` (16px), KPI figures `typography-title-md` and the one figure a page is about `typography-title-lg` (40px).
- c4784ac: The visual directions pattern and starting points. The pattern names the four surrounds a Wideset app can have (Inset, the default, Flat, Frame and Canvas), each one `<AppShell direction>`, and `wideset-build` now starts a new app by picking one and copying the closest whole screen from the docs' Starting points (`wideset.co/blocks`), with a new sign-in and sign-up pattern for the screens before the app. `wideset-craft` defaults to 32px controls, sizes an icon button by the controls beside it, ranks text by strong vs subtle, budgets status colour, draws a selected row like the active Sidebar item and makes Gantt-style rows whole-row targets.

### Patch Changes

- 6c8bcbc: The app-shell pattern, the colour, elevation and token specs and `wideset-craft` now put the page (`main`) on `bg-ws-static-foreground`, the same white as the `Sidebar` beside it, as in Figma; the grey `bg-ws-static-background` is the ground behind content blocks, not the page.
- 6c8bcbc: `wideset-craft`: nothing under `gap-ws-3` between text; a rail or aside you compose is `w-[20rem]` (never under 18rem) and padded like the page, so nothing touches its edge; the review checklist asks for both. The quick reference now says the page is white, like the `Sidebar` beside it.
- 6e446a5: wideset-craft: a page has at most one row of Tabs in its flow; a second switch goes inside a card, becomes a SegmentedControl, or is dropped.
- c4784ac: New `Illustration`: Figma's line drawings (`calendar`, `computer`, `folder`, each drawn at `lg` 240px and `sm` 140px) for empty states, first runs and announcements. Lines follow the text colour and the accent the primary fill, so dark mode and a rebrand recolour them; decorative unless it gets a `title` or an `aria-label`.
- 8f467b6: `wideset init` adds variable Inter as the page font by default; `--no-font` keeps your own.
- 6c8bcbc: `Select` and `MultiSelect` with `preset="ghost"` read as a value: its arrow shows only while the field is hovered, focused or open (always on touch screens), and a prefix sits beside the value with no divider. Bordered selects are unchanged. The Select and MultiSelect specs say so.
- 7d4fa5e: The setup skill no longer registers `@wideset` in `components.json`: Wideset is in shadcn's registry index, so `npx shadcn add @wideset/button` works without it.
- 6c8bcbc: `Sidebar` lines its parts up on one right edge: a scrollable section ends where the header and footer end, and a collapsible group row built on a `<button>` reads left-aligned. New `Sidebar.Item` `suffix` for a count or badge on the row's edge, and `Sidebar.Footer` (named export `SidebarFooter`) for the bottom area.
- 6c8bcbc: `Sidebar.Item` takes `nested` for a child of the item above (Figma `Nesting=Level 1`): indented so its icon starts under the parent's label, with no guide line.
- c4784ac: `Sidebar.Item` takes `suffixOnHover`, which shows a keyboard shortcut in `suffix` only on hover and keyboard focus, keeping its space. The Sidebar spec and `wideset-craft` add the sidebar's trailing edge (suffixes, a section's "+" and the header arrows end on one right edge), shortcut hints, and how starting points behave on windows wider than 1440px.
- 100501d: New `Spreadsheet`: a dense grid people work through cell by cell, with 32px or 40px rows, grid lines on every cell, a pinned header and row numbers, and arrow-key navigation around one selected cell. The skills add its good practices and a dense-data pattern.
- 963d7a5: `Switch`: `className` now lands on the switch control, the same element as `ref` and the other props, and the new `wrapperClassName` styles the row around it. `label` and children are mutually exclusive in the types. `Switch.Description` (`SwitchDescription`) adds supporting text under a composed label and is announced as the switch's description (`aria-describedby`, merged with a caller's value).
- 2bbbd4c: The specs say when to add `ws-scrollbar` to an element that scrolls.

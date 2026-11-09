---
'@wideset/react': minor
'@wideset/skills': patch
---

Tabs: with the divider on, a `regular` list is full width, so its bottom line runs across the container; the tabs stay left-aligned and the underline still sits under the active tab. `divider={false}` keeps the list fitted to its tabs.

Tabs: `pills` take the neutral selected style: the active pill is `bg-ws-dynamic-tertiary-alpha-strong-hover` with strong text, unselected pills have subtle text, a `tertiary-alpha` hover and pressed fill, and icons follow `currentColor`.

**Breaking-ish visual note:** pills lose their brand selected tint and their outlines (the 1px border stays, transparent, so sizes do not change). A regular list with a divider now stretches to its container; to put tabs and an action in one row, set `divider={false}` and draw the line on the row.

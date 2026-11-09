---
'@wideset/react': minor
---

New `Count`: how many items sit behind a label (a tab, a list group title, a section heading, a filter). By default it is the plain grey number (`typography-label-sm`, Static/Text/Subtle, tabular digits) read with the label before it; `contained` draws the same number in a 24px outlined pill, for a count beside an icon or on its own. `Tabs.Count` now renders a not-contained `Count` instead of a neutral `StatusBadge`, so a tab count is the plain grey number, 8px after the label in every tab type and size; `data-slot="tabs-count"` is unchanged.

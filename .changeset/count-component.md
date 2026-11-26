---
'@wideset/react': minor
'@wideset/skills': patch
---

New `Count`: how many items sit behind a label (a tab, a list group, a section heading, a filter). By default it is the plain grey number read with the label before it; `contained` draws it in a 24px outlined pill, for a count beside an icon or on its own.

`Tabs.Count` now renders a `Count` instead of a neutral `StatusBadge`: the plain grey number, 8px after the label in every tab type and size. It now also forwards `ref` and passes other props (`id`, `aria-*`, `data-*`) to the count; `data-slot="tabs-count"` is unchanged.

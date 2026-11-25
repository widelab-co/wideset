---
'@wideset/react': patch
---

`StatusBadge` with an icon and bare text (`<StatusBadge.Icon … />Failing`) keeps its label padding; before, the text was ignored by the icon-only styles and the badge collapsed to an icon-sized square unless the text sat in `StatusBadge.Label`.

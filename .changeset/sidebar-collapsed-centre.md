---
'@wideset/react': patch
---

A collapsed `Sidebar` keeps every part on the rail's centre line: a scrollable `Sidebar.Section` no longer reserves a scrollbar gutter when collapsed, which pushed its items 5px left of the trigger and the footer. Expanded is unchanged.

---
'@wideset/react': patch
---

`MultiSelect` and `FilterButton` lists stop at the room left in the window, as `Select` and `ComboBox` do, so in a short window they scroll instead of running off the page. Those lists and `ComboBox` keep 10px from the window edge.

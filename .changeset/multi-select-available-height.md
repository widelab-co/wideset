---
'@wideset/react': patch
---

`MultiSelect` and `FilterButton` lists (and `Select.Content` with `shouldUsePrimitive={false}`) no longer run off a short window: like `Select`'s list, they stop 10px short of the window edge and scroll the rest, and `ComboBox`'s list keeps the same 10px.

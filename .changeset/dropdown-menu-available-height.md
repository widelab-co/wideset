---
'@wideset/react': patch
---

`DropdownMenu.Content` and `DropdownMenu.SubContent` no longer run off a short window: like `Select`'s list, they stop 10px short of the window edge and scroll the rest.

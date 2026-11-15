---
'@wideset/react': patch
---

`Table` no longer takes focus when a row is clicked, so the browser's dark focus ring does not appear around the whole table; a `stickyHeader` / `stickyColumn` table stays keyboard-focusable for scrolling, now with the library's focus ring, and a `tabIndex` you pass is respected.

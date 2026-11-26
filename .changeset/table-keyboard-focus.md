---
'@wideset/react': minor
---

Fix unintended focus on ordinary tables after a row click. Sticky tables remain keyboard-scrollable with a Wideset focus outline.

**Breaking:** Ordinary tables no longer receive a default `tabIndex={-1}`. To keep programmatic focus, change `<Table>…</Table>` to `<Table tabIndex={-1}>…</Table>`. An explicit `tabIndex` now also overrides the sticky table default of `0`.

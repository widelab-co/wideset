---
'@wideset/react': patch
---

`Spreadsheet`: Tab leaves the grid without briefly focusing a control in a cell, and Firefox no longer stops on the grid's scroll container; the grid now writes `tabindex="-1"` on its scroll container and on controls in cells (update DOM snapshots and `userEvent.tab()` tests, and give a scroll container inside a cell `tabIndex={-1}`).

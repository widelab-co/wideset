---
'@wideset/react': patch
---

`Spreadsheet`: Tab leaves the grid without briefly focusing a control in a cell; the grid now writes `tabindex="-1"` on controls in cells (update DOM snapshots and `userEvent.tab()` tests, give a scroll container in a cell `tabIndex={-1}`), and Enter or F2 also reaches SVG links with `xlink:href`, image map areas, `<summary>`, `<audio>` / `<video>` with controls and `contenteditable="plaintext-only"`.

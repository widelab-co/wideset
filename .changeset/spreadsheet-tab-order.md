---
'@wideset/react': patch
---

`Spreadsheet`: controls in cells are now out of the tab order (the APG grid pattern), so Tab leaves the grid, and comes back to the active cell, without briefly focusing a control. Before, a control's `onFocus` / `onBlur` fired on the way out (a form library marked the field touched), its `Tooltip` flashed open and a screen reader could start announcing it. Enter or F2 still moves focus into a cell's controls, Tab between them.

This also covers editable content and controls that become tabbable later. Navigation within a cell respects changes to controls' own `tabIndex`, including an explicit `-1`.

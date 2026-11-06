---
'@wideset/react': patch
---

`FormField` with `label={null}` renders no empty label row, so its control is no longer pushed down by the gap; helper and error text stay linked to the control.

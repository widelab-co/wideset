---
'@wideset/react': minor
---

ProgressBar is composable: `ProgressBar.Header`, `.Label`, `.Value` (with `formatValue`), `.Track` and `.Description`, also exported by name. The label names the progressbar and the description describes it (`aria-describedby`). `label`, `description` and `fixedWidth` are deprecated and keep working for now. `className` and `ref` now reach the root, the column that holds the header, track and description, rather than the track: move track styles to `ProgressBar.Track`.

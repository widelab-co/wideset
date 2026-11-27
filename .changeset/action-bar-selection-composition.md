---
'@wideset/react': minor
'@wideset/skills': patch
---

Compose the floating selection bar with `ActionBar.Count`, `ActionBar.Actions`, and optional `ActionBar.SelectAll`, also available as named exports. The count announces changes politely. The existing `amountSelected`, `onClose`, and `closeAriaLabel` props are deprecated. Move the label into `ActionBar.Count` and compose a clear-selection button inside `ActionBar.Actions`.

When called without the deprecated count or close props, the bar uses the new floating surface. Wrap bare actions in `ActionBar.Actions` to give them the raised segment.

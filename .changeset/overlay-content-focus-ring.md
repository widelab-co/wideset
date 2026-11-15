---
'@wideset/react': patch
---

`Modal.Content`, `StatusModal.Content` and `Sidepanel.Panel` no longer show the browser's dark focus ring around the whole dialog when the dialog itself is focused (nothing focusable inside, or `event.currentTarget.focus()` in `onOpenAutoFocus`).

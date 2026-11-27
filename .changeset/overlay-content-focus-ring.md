---
'@wideset/react': patch
---

`Modal.Content`, `StatusModal.Content` and `Sidepanel.Panel` no longer show the browser's focus ring around the whole dialog when the dialog itself takes focus (nothing focusable inside, or `focus()` called on it from `onOpenAutoFocus`).

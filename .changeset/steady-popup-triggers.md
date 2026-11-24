---
'@wideset/react': patch
---

Remove press scaling from popup-opening fields and menu triggers; Button and IconButton detect non-false `aria-haspopup` or `role="combobox"` automatically, while ordinary actions retain press feedback.

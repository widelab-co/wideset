---
'@wideset/react': patch
---

FormField, ProgressBar: error text is now announced by screen readers when it appears (`role="alert"` on the helper text in the error state, inserted fresh when a hint turns into an error).

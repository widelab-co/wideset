---
'@wideset/react': patch
---

FormField, ProgressBar: error text is now announced by screen readers when it appears (`role="alert"` on the helper text in the error state). HelperText (installed through the registry) keeps its base classes when given a `className`.

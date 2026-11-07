---
'@wideset/react': patch
---

FormField's helper and error text sit 10px below the control (was 6px) with 4px under them, matching Figma; ProgressBar keeps 12px from the bar to its description, now with 4px under it. Both come from the internal HelperText, which now has Figma's `py-ws-3` padding and merges a passed `className` with its own classes instead of replacing them.

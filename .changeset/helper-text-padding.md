---
'@wideset/react': patch
---

HelperText has Figma's `py-ws-3` padding by default. FormField stacks its label, control and helper text with `gap-ws-4`, as in Figma, so the helper text sits 10px below the control (was 6px) with 4px under it. ProgressBar keeps 12px from the bar to its description. HelperText also merges a passed `className` with its own classes instead of replacing them.

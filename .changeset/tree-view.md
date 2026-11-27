---
'@wideset/react': minor
'@wideset/skills': patch
---

Add `TreeView`, a hierarchy whose levels fold open and shut (files and folders, nested categories), with parts `TreeView.Item`, `.Icon`, `.Label`, `.Suffix` and `.Group`, one selected leaf (`value` / `onValueChange`), open branches as state (`expanded` / `onExpandedChange`) and the WAI-ARIA tree keyboard. Skills: `wideset-build` knows when to use it.

---
'@wideset/react': patch
'@wideset/skills': patch
---

`Switch`: `className` now lands on the switch control, the same element as `ref` and the other props (it used to style the row around it). `label` and children are mutually exclusive in the types, and `Switch.Description` (`SwitchDescription`) adds supporting text under a composed label.

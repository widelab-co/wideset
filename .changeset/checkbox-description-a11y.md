---
'@wideset/react': patch
---

`Checkbox`: the description is no longer part of the accessible name. It sits outside the `<label>` and is linked with `aria-describedby`, for the `description` prop and for `Checkbox.Description`. Clicking the description no longer toggles the checkbox.

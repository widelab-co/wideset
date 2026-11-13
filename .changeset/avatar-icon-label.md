---
'@wideset/react': patch
---

An icon `Avatar` no longer announces "Default User Icon": the icon is decorative, and `aria-label` on `Avatar` now names it (an image, or a button with `onClick`), with its `status` added to the name. A clickable icon `Avatar` needs `aria-label`; a console warning says so when it is missing.

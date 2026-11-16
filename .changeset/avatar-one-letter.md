---
'@wideset/react': patch
---

`Avatar` with `initials` draws only the first letter at `xs` and `sm` (20 and 24px), as Figma does: two letters crowded those circles. The same goes for initials shown while a `src` image loads or after it fails. Pass the full initials; larger sizes still show both.

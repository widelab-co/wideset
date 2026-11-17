---
'@wideset/react': patch
---

`@wideset/react/styles` is about 32 KB smaller: it no longer carries Tailwind classes that only the starting points (blocks) use. Code copied from a starting point gets its `ws` classes from your own Tailwind build with `@wideset/react/theme`, as the installation guide describes.

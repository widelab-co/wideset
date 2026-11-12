---
'wideset': minor
'@wideset/react': minor
'@wideset/skills': patch
---

`wideset init` adds variable Inter as the page font by default; `--no-font` keeps your own.

The font is the new `font` registry item, `styles/wideset-font.css` (Inter self-hosted through Fontsource), imported after the app's other stylesheets. A project that already has a `components.json` or brings its own `@fontsource` font is left alone, so removing the file or its import sticks. `wideset add` in a fresh project runs `init` first and takes `--no-font` too.

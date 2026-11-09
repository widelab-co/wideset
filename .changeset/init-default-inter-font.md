---
'wideset': minor
'@wideset/react': minor
'@wideset/skills': patch
---

`wideset init` now gives a new project Inter by default: it adds the new `font` registry item (`styles/wideset-font.css`, variable Inter self-hosted through Fontsource) and imports it after the app's other stylesheets. Pass `--no-font` to keep your own font. A project that already has a `components.json`, brings its own `@fontsource` font, or removed the file is left alone.

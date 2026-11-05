---
'@wideset/react': minor
---

`Sidebar` now sits on the grey app frame (`bg-ws-static-background`) instead of white, so the page beside it can be white, as in most product apps. **Breaking (visual):** if your `main` used `bg-ws-static-background`, change it to `bg-ws-static-foreground`; the app-shell pattern shows the new frame.

---
'@wideset/react': minor
---

New `AppShell`: the full-height frame a screen sits in, with `AppShell.Main` (`AppShellMain`) for the page. `direction="flat" | "frame" | "inset"` sets the window background, the page's look and the surface of a `Sidebar` inside it in one prop; `inset` is the raised white page on the grey app frame from Figma's Calendar screen. `Sidebar` outside an `AppShell` is unchanged.

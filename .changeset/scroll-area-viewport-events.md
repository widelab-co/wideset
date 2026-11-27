---
'@wideset/react': patch
---

Attach ScrollArea's `onScroll` handler to its scrolling viewport so it receives scroll events and exposes the viewport's scroll position through `event.currentTarget`. Other root props and the existing viewport ref are unchanged.

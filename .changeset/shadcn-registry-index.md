---
'@wideset/skills': patch
---

The setup skill no longer registers `@wideset` in `components.json`: Wideset is in shadcn's registry index, so `npx shadcn add @wideset/button` works without it.

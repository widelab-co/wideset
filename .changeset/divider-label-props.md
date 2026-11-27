---
'@wideset/react': minor
---

**Breaking:** Divider no longer accepts `children` in its props type. Children were previously accepted by TypeScript but ignored at runtime. Use the existing `text` prop for the optional label; rendering and horizontal orientation are unchanged.

```tsx
// Before: accepted by TypeScript, but the label was not rendered
<Divider>or</Divider>

// After
<Divider text="or" />
```

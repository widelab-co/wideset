---
'@wideset/react': minor
'@wideset/skills': minor
---

Card's lines under the header and above the footer are optional: `<Card divider>` draws them, and they are off by default, matching Figma's new `Divider` property. Without them the header→content and content→footer gaps are the content's 20px padding. `Card.Description` now sits 2px under `Card.Title` (was 8px), matching Figma's Gap/2, so the title and description read as one unit.

**Breaking (visual):** bordered cards lose their header and footer lines unless `divider` is set. To keep them on a card with heavy content (a table, a list, a form with a footer of actions):

```tsx
<Card divider>
  <Card.Header>…</Card.Header>
  <Card.Content>…</Card.Content>
  <Card.Footer>…</Card.Footer>
</Card>
```

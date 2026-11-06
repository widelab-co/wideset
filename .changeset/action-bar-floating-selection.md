---
'@wideset/react': minor
---

ActionBar follows the new Figma design: a light tray with the selection count beside a raised segment for Select all and the actions, built from `ActionBar.Count`, `ActionBar.Actions` and `ActionBar.SelectAll`.

**Breaking:** `amountSelected`, `onClose` and `closeAriaLabel` are removed, and the bar no longer lays out its children: compose the parts. The count goes in `ActionBar.Count` (you write the text and its plural; it is now read out politely when it changes), the actions in `ActionBar.Actions`, and the close button gives way to `ActionBar.SelectAll`, a `Checkbox` that selects the rest while the selection is partial and clears it once everything is selected. Actions stay `size="sm"`; the design uses `variant="secondary"` buttons.

```tsx
// Before
<ActionBar isOpen={selected.length > 0} amountSelected={selected.length} onClose={clearSelection}>
  <Button preset="border" variant="secondary" size="sm">
    Publish
  </Button>
</ActionBar>

// After
<ActionBar isOpen={selected.length > 0}>
  <ActionBar.Count>{selected.length} rows selected</ActionBar.Count>
  <ActionBar.Actions>
    <ActionBar.SelectAll
      checked={selected.length === rows.length || 'indeterminate'}
      onCheckedChange={(checked) => (checked === true ? selectAll() : clearSelection())}
    />
    <Button variant="secondary" size="sm">
      Publish
    </Button>
  </ActionBar.Actions>
</ActionBar>
```

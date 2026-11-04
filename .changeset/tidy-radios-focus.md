---
'@wideset/react': minor
---

Fix RadioButton arrow navigation and Pagination focus after ellipsis selection, select SegmentedControl items on arrow navigation, and enable keyboard selection animations in SegmentedControl and Tabs.

**Breaking:** SegmentedControl now uses radio-group behavior. The root no longer accepts `rovingFocus`, and items no longer accept `name`; set `name` on the group for form submission. Arrow keys select the focused item, Space selects an unselected item, and Enter no longer activates items. Custom item selectors must use `data-state="checked"` / `"unchecked"` instead of `"on"` / `"off"`.

Remove `rovingFocus` to use the built-in radio-group navigation; disabling roving focus is no longer supported. Move item-level form names to the group:

```tsx
// Before
<SegmentedControl rovingFocus defaultValue="list">
  <SegmentedControl.Item name="view" value="list">List</SegmentedControl.Item>
  <SegmentedControl.Item name="view" value="grid">Grid</SegmentedControl.Item>
</SegmentedControl>

// After
<SegmentedControl name="view" defaultValue="list">
  <SegmentedControl.Item value="list">List</SegmentedControl.Item>
  <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
</SegmentedControl>
```

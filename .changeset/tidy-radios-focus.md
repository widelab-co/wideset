---
'@wideset/react': minor
---

Fix RadioButton arrow navigation and Pagination focus after ellipsis selection, select SegmentedControl items on arrow navigation, enable keyboard selection animations in SegmentedControl and Tabs, and add Chip pressed colors and animation when using Enter or Space.

**Breaking:** SegmentedControl now uses radio-group behavior. The root no longer accepts `rovingFocus`, and items no longer accept `name`; set `name` on the group for form submission. Arrow keys select the focused item, Space selects an unselected item, and Enter no longer activates items. Custom item selectors must use `data-state="checked"` / `"unchecked"` instead of `"on"` / `"off"`.

Arrow navigation that moves focus to an item also invokes that item's `onClick`. Use the group's `onValueChange` to track selection changes rather than item click handlers. Inside forms, Radix stops the item button's click from bubbling by default and uses hidden radio inputs to dispatch bubbling clicks when their checked state changes; form-level click listeners therefore receive the input as the event target instead of the item button.

RadioButton items no longer carry `data-orientation`; the attribute remains on the group root. Update selectors that previously depended on item-level `data-orientation` to read it from the group instead.

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

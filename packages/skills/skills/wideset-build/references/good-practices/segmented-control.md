# SegmentedControl

## When to use

- Switching how the same content is shown: List / Board / Calendar, Day / Week / Month.
- Two to a few short options that fit in one row and apply on click.

## When not to use

- Moving between separate panels of content → `Tabs`.
- A choice saved later with a form → `RadioButtonGroup`.
- A single on/off setting → `Switch`.
- More options than fit in one row → `Select`.

## Do / Don't

```tsx
// Do: the control changes how the same content is shown
const [view, setView] = useState('board');
<SegmentedControl value={view} onValueChange={setView} aria-label="View">
  <SegmentedControl.Item value="list">List</SegmentedControl.Item>
  <SegmentedControl.Item value="board">Board</SegmentedControl.Item>
</SegmentedControl>;
```

- Don't show separate panels of content behind a segmented control → `Tabs`, which link each
  trigger to its panel.
- Do always set `value` or `defaultValue`; without it no segment looks selected.
- Don't rely on deselecting: clicking the selected segment does nothing.

## Gotchas

- Set `name` and `required` on the root, not on items. Inside a form, each item renders a hidden
  radio input; the selected value is submitted under the group's `name`.
- Arrow navigation selects the focused segment and calls `onValueChange` when selection changes.
  It also invokes the destination item's `onClick`; track selection with the group's
  `onValueChange` rather than item click handlers.
- The `icon` prop takes a component, not an element.
- `icon` on the item makes an icon-only segment; for icon + label put `SegmentedControl.Icon` inside
  the item's children instead.
- `onValueChange` never receives an empty string.
- Selection is always single; there is no `type` prop.
- DOM hooks: `data-slot="segmented-control"`, `"segmented-control-item"`,
  `"segmented-control-icon"`.

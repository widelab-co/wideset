---
name: SegmentedControl
import: import { SegmentedControl } from '@wideset/react'
group: selection
status: stable
parts: [SegmentedControl, SegmentedControlItem, SegmentedControlIcon]
related: [Tabs, RadioButtonGroup, Switch, Select]
docs: https://wideset-docs.widelab.workers.dev/components/segmented-control
storybook: components-segmented-control--default
---

# SegmentedControl

> A compact row of mutually exclusive options that changes the view or mode of the content next to it, immediately.

## When to use

- Switching how the same content is shown: List / Board / Calendar, Day / Week / Month.
- Two to a few short options that fit in one row and apply on click.

## When not to use

- Moving between separate panels of content → `Tabs`.
- A choice saved later with a form → `RadioButtonGroup`.
- A single on/off setting → `Switch`.
- More options than fit in one row → `Select`.

## Anatomy

```tsx
import { RiCalendarLine, RiLayoutColumnLine, RiListCheck2 } from '@remixicon/react';

// Icon + label
<SegmentedControl defaultValue="board">
  <SegmentedControl.Item value="list">
    <SegmentedControl.Icon icon={RiListCheck2} />
    List
  </SegmentedControl.Item>
  <SegmentedControl.Item value="board">
    <SegmentedControl.Icon icon={RiLayoutColumnLine} />
    Board
  </SegmentedControl.Item>
</SegmentedControl>

// Icon only: every item needs aria-label
<SegmentedControl defaultValue="board">
  <SegmentedControl.Item value="list" icon={RiListCheck2} aria-label="List view" />
  <SegmentedControl.Item value="calendar" icon={RiCalendarLine} aria-label="Calendar view" />
</SegmentedControl>
```

Named exports `SegmentedControlItem` and `SegmentedControlIcon` equal the dot members.

## Choosing props

| Prop                     | Value                     | Use for                                                   |
| ------------------------ | ------------------------- | --------------------------------------------------------- |
| `size`                   | `md` (default)            | most toolbars and headers                                 |
|                          | `sm`                      | dense toolbars, table headers                             |
|                          | `lg`                      | next to large buttons and inputs                          |
| `variant`                | `regular` (default)       | each segment sized to its label                           |
|                          | `fullWidth`               | segments share the container width (two to four segments) |
| `value` / `defaultValue` | an item's `value`         | controlled / uncontrolled selection                       |
| `onValueChange`          | `(value: string) => void` | fires in both modes                                       |
| `disabled` (root / item) | `true`                    | all segments / one segment                                |

Match `size` to the controls beside it.

## States

- Default, hover, pressed, selected, keyboard focus, disabled. The selected segment always stays
  selected; disabling the whole control keeps the current selection visible.

## Content

- One or two words per segment, sentence case, parallel ("Day", "Week", "Month").
- Use icons with labels for recognition; icon-only only when the icons are unambiguous.
- Don't mix icon-only and labelled segments in one control.

## Accessibility

- Each icon-only item needs `aria-label` or `aria-labelledby`; the item warns in the console
  without one.
- The control is one tab stop. Arrow keys move focus and select a segment; Space selects the
  focused segment. Enter does not select. Segments are announced as radio options.
- Home and End move focus to the first or last enabled segment without changing selection.
- Name the control (`aria-label`) when no visible heading says what it switches.

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

- The `icon` prop takes a component, not an element.
- `icon` on the item makes an icon-only segment; for icon + label put `SegmentedControl.Icon` inside
  the item's children instead.
- `onValueChange` never receives an empty string.
- Selection is always single; there is no `type` prop.
- DOM hooks: `data-slot="segmented-control"`, `"segmented-control-item"`,
  `"segmented-control-icon"`.

## API

Full props: `https://wideset-docs.widelab.workers.dev/components/segmented-control.md` · Types:
`packages/design-system/src/components/segmented-control/SegmentedControl.types.ts`

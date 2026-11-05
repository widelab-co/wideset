---
name: Slider
import: import { Slider } from '@wideset/react'
group: selection
status: stable
parts: [Slider, SliderLabel]
related: [TextInput, SegmentedControl, ProgressBar]
docs: https://wideset-docs.widelab.workers.dev/components/slider
storybook: components-slider--default
---

# Slider

> Picks a value, or a range between two values, by adjusting along a scale.

## When to use

- The value is relative and the user tunes it by feel: volume, opacity, a price range filter.
- The scale has clear ends (`min`, `max`) and the exact number matters less than the position.

## When not to use

- Precise numeric entry → `TextInput` with `type="number"` (or pair it with a slider, see below).
- A few named steps ("Low", "Medium", "High") → `SegmentedControl`.
- Showing progress the user does not control → `ProgressBar`.

## Anatomy

```tsx
<Slider aria-label="Volume" defaultValue={[40]} />

<Slider
  thumbAriaLabels={['Minimum price', 'Maximum price']}
  defaultValue={[20, 80]}
  showTooltipValue
/>

// the scale printed at both ends
<div className="gap-ws-9 flex items-center">
  <Slider.Label>0</Slider.Label>
  <Slider className="min-w-0 flex-1" aria-label="Volume" defaultValue={[40]} />
  <Slider.Label>100</Slider.Label>
</div>

// the scale under the track, for narrow rows
<div>
  <Slider aria-label="Volume" defaultValue={[40]} />
  <div className="pt-ws-8 flex justify-between">
    <Slider.Label>0</Slider.Label>
    <Slider.Label>100</Slider.Label>
  </div>
</div>
```

`Slider.Label` / `SliderLabel` is the numeric caption for the scale or a readout; the slider
prints no numbers itself, so place it where the layout needs it. `children` render inside the
slider after the thumbs (tick marks, for example).

## Choosing props

| Prop                     | Value                                         | Use for                                                                 |
| ------------------------ | --------------------------------------------- | ----------------------------------------------------------------------- |
| `value` / `defaultValue` | `number[]`                                    | one thumb per value: `[40]` for one value, `[20, 80]` for a range       |
| `onValueChange`          | `(value: number[]) => void`                   | fires while dragging, in both modes                                     |
| `min` / `max` / `step`   | defaults `0` / `100` / `1`                    | the scale                                                               |
| `showTooltipValue`       | `true` or `top` / `right` / `bottom` / `left` | the current value above (or beside) the thumb while dragging or focused |

## States

- Default, hover, dragging, keyboard focus (ring only for keyboard), disabled.
- Disabled ignores the pointer and leaves the tab order; say why it is locked.

## Content

- `Slider.Label` is for plain numbers. Name what the slider sets in a visible label next to it,
  and put units in that label ("Price, EUR").

## Accessibility

- Always name it: `aria-label`, `aria-labelledby`, or `thumbAriaLabels`. There is no fallback:
  without one the thumb has no accessible name.
- In a range, `aria-label="price"` becomes "Minimum price" / "Maximum price"; `thumbAriaLabels`
  sets each thumb's name exactly.
- Each thumb is its own tab stop. Arrows move one step, Page Up / Page Down ten, Home / End jump
  to the ends.

## Do / Don't

```tsx
// Do: slider plus number inputs when the exact value matters
const [value, setValue] = useState([20, 80]);
<Slider value={value} onValueChange={setValue} aria-label="price" />
<TextInput size="sm">
  <TextInput.Input
    aria-label="Minimum price"
    type="number"
    value={value[0]}
    onChange={(e) => setValue([Number(e.target.value), value[1]])}
  />
</TextInput>
```

```tsx
// Don't: a scalar value
<Slider defaultValue={40} />
// Do
<Slider defaultValue={[40]} aria-label="Volume" />
```

## Gotchas

- Values are always arrays, even for one thumb.
- Without `value` or `defaultValue` the slider has one thumb at `min`.
- `type` and `labels` are deprecated: the value's length sets the number of thumbs, and
  `Slider.Label` replaces `labels`.
- `onValueChange` fires on every step while dragging; save on `onValueCommit` when the work is
  expensive.
- `className` and `ref` go to the outer wrapper; every other prop goes to the slider itself.
- The slider is horizontal only; don't pass `orientation="vertical"`.
- DOM hooks: `data-slot="slider"`, `"slider-thumb"`, `"slider-label"`.

## API

Full props: `https://wideset-docs.widelab.workers.dev/components/slider.md` · Types:
`packages/design-system/src/components/slider/Slider.types.ts`

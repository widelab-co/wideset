# Slider

## When to use

- The value is relative and the user tunes it by feel: volume, opacity, a price range filter.
- The scale has clear ends (`min`, `max`) and the exact number matters less than the position.

## When not to use

- Precise numeric entry → `TextInput` with `type="number"` (or pair it with a slider, see below).
- A few named steps ("Low", "Medium", "High") → `SegmentedControl`.
- Showing progress the user does not control → `ProgressBar`.

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

# DateRangePicker

## When to use

- Reporting and analytics filters: "Last week", "This month", or a custom span.
- Booking flows where the user picks a start and an end day.

## When not to use

- One date → `DatePicker`.
- A range picker that stays visible on the page → `Calendar` with `mode="range"`.
- Times within a day → two `TimePicker`s (`mode="from"` and `mode="to"`).

## Do / Don't

```tsx
// Do: control range and preset together
const [range, setRange] = useState<{ from?: string; to?: string }>();
const [preset, setPreset] = useState<keyof typeof dateRangePresetLabels>('thisMonth');

<DateRangePicker
  aria-label="Report period"
  showDatePresets
  selected={range}
  activeDatePreset={preset}
  weekStartsOn={1}
  onSelect={(next, nextPreset) => {
    setRange(next);
    if (nextPreset) setPreset(nextPreset);
  }}
/>;
```

- Don't pass `defaultSelected` and `defaultDatePreset` together; the types reject it.
- Don't pass `Date` objects; both ends are ISO `yyyy-MM-dd` strings.

## Gotchas

- `onSelect` fires once the range is complete (the second click) or when a preset is picked, not on
  the first click.
- A preset closes the popup; a hand-picked range leaves it open so the user can adjust it.
- Preset ranges are worked out from `today` (the current date unless the prop is set). Week
  presets start on Monday unless `weekStartsOn` is set, while the calendar grid follows its own
  default; pass `weekStartsOn` so both agree.
- A controlled `activeDatePreset` other than `custom` wins over `selected` in the field's text.
- Default display format differs from `DatePicker` (`MM/dd/yy` vs `MM.dd.yyyy`); set `dateFormat`
  on both when they appear together.
- `disabledDates` blocks days; `disabled` disables the whole field.
- `className` and `ref` go to the trigger button. DOM hook: `data-slot="date-range-picker"`.

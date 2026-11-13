---
name: DateRangePicker
import: import { DateRangePicker, dateRangePresetLabels } from '@wideset/react'
group: date-time
status: stable
parts: [DateRangePicker, dateRangePresetLabels]
related: [DatePicker, Calendar, TimePicker, FormField]
docs: https://wideset.co/components/date-range-picker
storybook: components-daterangepicker--default
---

# DateRangePicker

> A form field for a span of dates, with an optional panel of common ranges (Today, Last Month…).

## When to use

- Reporting and analytics filters: "Last week", "This month", or a custom span.
- Booking flows where the user picks a start and an end day.

## When not to use

- One date → `DatePicker`.
- A range picker that stays visible on the page → `Calendar` with `mode="range"`.
- Times within a day → two `TimePicker`s (`mode="from"` and `mode="to"`).

## Anatomy

A single component; the trigger, the calendar and the preset panel are built in.
`dateRangePresetLabels` is the map of preset keys to their default English labels.

```tsx
<DateRangePicker aria-label="Report period" showDatePresets defaultDatePreset="lastWeek" />

<DateRangePicker
  aria-label="Stay"
  placeholder="Pick your stay"
  defaultSelected={{ from: '2026-11-03', to: '2026-11-09' }}
/>
```

## Choosing props

| Prop                                     | Value                                  | Use for                                                         |
| ---------------------------------------- | -------------------------------------- | --------------------------------------------------------------- |
| `selected` / `defaultSelected`           | `{ from?: string; to?: string }` (ISO) | controlled / uncontrolled range                                 |
| `activeDatePreset` / `defaultDatePreset` | a preset key                           | controlled / uncontrolled preset                                |
| `onSelect`                               | `(range?, preset?) => void`            | the range plus its preset (`'custom'` for a hand-picked span)   |
| `showDatePresets`                        | `true`                                 | reporting filters; leave off when the user books specific days  |
| `presetLabels`                           | `{ thisWeek: 'Ten tydzień', … }`       | translate or re-word preset labels                              |
| `preset`                                 | `border` (default) / `ghost`           | form field / toolbar and report header                          |
| `variant`                                | `primary` (default) / `danger`         | normal / failed validation                                      |
| `size`                                   | `md` (default) / `sm` / `lg`           | match the inputs beside it                                      |
| `disabledDates`                          | dates or matchers                      | days that cannot be picked                                      |
| `dateFormat`                             | date-fns format, default `'MM/dd/yy'`  | how the trigger displays each end                               |
| `today`                                  | a `Date`, default the current date     | a fixed sample date: presets and the today marker count from it |

Preset keys: `custom`, `today`, `yesterday`, `thisWeek`, `lastWeek`, `thisMonth`, `lastMonth`,
`thisYear`, `lastYear`.

## States

- Empty (placeholder, default `'Select date range'`), filled with a range, filled with a preset,
  open, invalid, disabled.
- A chosen preset shows its name in the field ("Last Week"), not the dates.

## Content

- Phrase the placeholder as the thing to pick: "Pick your stay".
- If the product's copy is in sentence case or another language, pass `presetLabels`; the defaults
  are English Title Case and may be revisited.

## Accessibility

- Name the trigger with `id` plus a label, or `aria-label`. `FormField` links helper and error text
  and sets `aria-invalid`.
- Pair `variant="danger"` with an error message (an end before the start, a span too long).

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

## API

Full props: `https://wideset.co/components/date-range-picker.md` · Types:
`packages/design-system/src/components/daterangepicker/DateRangePicker.types.ts`

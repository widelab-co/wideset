---
name: Calendar
import: import { Calendar } from '@wideset/react'
group: date-time
status: stable
parts: [Calendar]
related: [DatePicker, DateRangePicker, Popup]
docs: https://wideset.co/components/calendar
storybook: components-calendar--default
---

# Calendar

> An always-visible month grid for picking a date, several dates or a range.

## When to use

- The calendar is part of the page: a scheduling side panel, a booking step, a dashboard filter
  that stays open.
- Inside your own popover or panel when neither picker fits.

## When not to use

- A form field that opens a calendar → `DatePicker` (one date) or `DateRangePicker` (a span).
- A time of day → `TimePicker`.

## Anatomy

A single component built on `react-day-picker`; it accepts its `DayPickerProps` (`mode`,
`selected`, `onSelect`, `disabled`, `numberOfMonths`, `weekStartsOn`, `locale`, …). The header has
previous/next buttons and separate month and year buttons that open month and year grids.

```tsx
const [day, setDay] = useState<Date | undefined>();

<Calendar mode="single" selected={day} onSelect={setDay} footer="Weekends are closed." />;
```

## Choosing props

| Prop                                       | Value                                | Use for                                                                 |
| ------------------------------------------ | ------------------------------------ | ----------------------------------------------------------------------- |
| `mode`                                     | `single`                             | one day; `selected` is a `Date`                                         |
|                                            | `range`                              | start then end; `selected` is `{ from, to }` of `Date`s                 |
|                                            | `multiple`                           | several separate days; `selected` is `Date[]`                           |
| `disabled`                                 | dates, ranges or matchers            | days that cannot be picked: `{ before: date }`, `{ dayOfWeek: [0, 6] }` |
| `showOutsideDays`                          | `false` (default)                    | each month reads as one block                                           |
|                                            | `true`                               | ranges that often cross into the next month                             |
| `footer`                                   | node                                 | why days are disabled, or the current selection                         |
| `month` / `defaultMonth` / `onMonthChange` | `Date`                               | control which month is shown                                            |
| `onMonthSelect` / `onYearSelect`           | `(month) => void` / `(year) => void` | react to the header's month and year grids                              |
| `yearsPerPage`                             | number, default `16`                 | years per page in the year grid                                         |

## States

- Days: default, hover, today, selected, in range, disabled, outside (when shown). Disabled days
  cannot be picked and the keyboard skips them.
- The calendar opens on the month of the selected date (or `defaultMonth`), then follows
  navigation.

## Content

- When the reason for disabled days is not obvious, say it in `footer` ("Weekends are closed.").
- Translate the header and grid labels with `monthCaptionAriaLabels`, `monthGridLabels`
  (`title`, `ariaLabel`, `months`) and `yearGridLabels`; pass `locale` for day and month names.

## Accessibility

- Arrow keys move between days; disabled days are skipped.
- The navigation and picker buttons carry English names by default; override them with
  `monthCaptionAriaLabels` (`prevMonth`, `nextMonth`, `prevYear`, `nextYear`, `selectMonth`,
  `selectYear`) in other languages.

## Do / Don't

```tsx
// Do: range state shaped as react-day-picker expects
type Range = { from: Date | undefined; to?: Date };
const [range, setRange] = useState<Range | undefined>();

<Calendar mode="range" selected={range} onSelect={setRange} />;
```

```tsx
// Don't: ISO strings (that is the DatePicker contract)
<Calendar mode="single" selected="2026-11-03" />
// Do
<Calendar mode="single" selected={new Date(2026, 10, 3)} onSelect={setDay} />
```

- Don't build a field + popover around `Calendar` for a form → `DatePicker` already is one.

## Gotchas

- `Calendar` works with `Date` objects; `DatePicker` and `DateRangePicker` work with ISO strings.
- Without `mode` nothing can be selected.
- Here `disabled` blocks days; on the pickers the same rule is `disabledDates`.
- `className` goes on the calendar's root; `classNames` merges per-part overrides, which restyle
  the component and drift from Figma: avoid them.
- DOM hook: `data-slot="calendar"`.

## API

Full props: `https://wideset.co/components/calendar.md` · Types:
`packages/design-system/src/components/calendar/Calendar.types.ts` (plus `DayPickerProps` from
`react-day-picker`)

---
name: DatePicker
import: import { DatePicker } from '@wideset/react'
group: date-time
status: stable
parts: [DatePicker]
related: [DateRangePicker, Calendar, TimePicker, FormField, TextInput]
docs: https://wideset.co/components/date-picker
storybook: components-datepicker--default
---

# DatePicker

> A form field for one calendar date: a field-style trigger that opens a calendar in a popup.

## When to use

- One precise date in a form or filter where seeing the month helps: due date, publish date,
  appointment day.

## When not to use

- A span of dates → `DateRangePicker`.
- A calendar that stays visible on the page → `Calendar`.
- A time of day → `TimePicker` (place it next to the date picker for date + time).
- A date the user already knows and would rather type, such as a birth date → `TextInput`; the
  date picker trigger cannot be typed into.

## Anatomy

A single component; the trigger and the popup calendar are built in.

```tsx
<FormField label="Due date" htmlFor="due-date">
  <DatePicker id="due-date" placeholder="Pick a due date" defaultSelected="2026-11-03" />
</FormField>
```

## Choosing props

| Prop                           | Value                           | Use for                                                                       |
| ------------------------------ | ------------------------------- | ----------------------------------------------------------------------------- |
| `selected` / `defaultSelected` | ISO `'yyyy-MM-dd'` string       | controlled / uncontrolled date                                                |
| `onSelect`                     | `(day?: string) => void`        | receives the ISO string, in both modes                                        |
| `preset`                       | `border` (default)              | a field among other form inputs                                               |
|                                | `ghost`                         | toolbars and filter rows; adds a leading calendar icon                        |
| `variant`                      | `primary` (default)             | normal state                                                                  |
|                                | `danger`                        | a date that failed validation                                                 |
| `size`                         | `md` (default) / `sm` / `lg`    | match the inputs beside it; `sm` for dense tables and filters                 |
| `disabledDates`                | dates or matchers               | days that cannot be picked: `{ before: new Date() }`, `{ dayOfWeek: [0, 6] }` |
| `dateFormat`                   | date-fns format                 | how the trigger displays the date (`'MMMM d, yyyy'`)                          |
| `placeholder`                  | string, default `'Pick a date'` | what to pick when empty                                                       |

Calendar options such as `weekStartsOn` and `numberOfMonths` pass through to the calendar.

## States

- Empty (placeholder), filled, open, invalid (`variant="danger"`), disabled. Disabled does not open
  and leaves the tab order.
- Picking a day closes the popup.

## Content

- Phrase the placeholder as the thing to pick: "Pick a due date".
- Set `dateFormat` to the product's locale convention; the default is `MM.dd.yyyy`.

## Accessibility

- Name the trigger: `id` plus a `<label htmlFor>` (or `FormField` `htmlFor`), or `aria-label`.
  Once named, the chosen date is announced as its description.
- `FormField` with `errorText` links the message and sets `aria-invalid`; red alone tells a screen
  reader nothing, so pair `variant="danger"` with an error message.

## Do / Don't

```tsx
// Don't: Date objects
<DatePicker selected={new Date()} onSelect={(d) => setDue(d)} />;
// Do: ISO strings
const [due, setDue] = useState<string | undefined>('2026-11-03');
<DatePicker aria-label="Due date" selected={due} onSelect={setDue} />;
```

```tsx
// Don't: `disabled` to block days (it disables the whole field)
<DatePicker disabled={{ before: new Date() }} />
// Do
<DatePicker aria-label="Due date" disabledDates={{ before: new Date() }} />
```

## Gotchas

- Values are ISO `yyyy-MM-dd` strings; `Calendar` uses `Date` objects. Don't mix them up.
- `dateFormat` changes only the display; `onSelect` always gets ISO.
- `disabled` (boolean) disables the field; `disabledDates` blocks days. On `Calendar` the day rule
  is called `disabled`.
- Default display format differs from `DateRangePicker` (`MM.dd.yyyy` vs `MM/dd/yy`); set
  `dateFormat` on both when they appear together.
- The calendar opens in a portal, outside the trigger's DOM parent.
- `className` and `ref` go to the trigger button. DOM hook: `data-slot="date-picker"`.

## API

Full props: `https://wideset.co/components/date-picker.md` · Types:
`packages/design-system/src/components/datepicker/DatePicker.types.ts`

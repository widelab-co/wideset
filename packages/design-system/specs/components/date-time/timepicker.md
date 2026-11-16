---
name: TimePicker
import: import { TimePicker } from '@wideset/react'
group: date-time
status: stable
parts: [TimePicker]
related: [DatePicker, DateRangePicker, Select, TextInput, FormField]
docs: https://wideset.co/components/timepicker
storybook: form-timepicker--default
---

# TimePicker

> A select field of times generated at a fixed interval between two bounds.

## When to use

- Picking a time of day on a schedule grid: meeting start, opening hours, a delivery slot.
- The start and end of a time range, as two pickers.

## When not to use

- A calendar date → `DatePicker`.
- An exact minute or a duration that does not sit on an interval → `TextInput`.
- A list of arbitrary options that happen to be times → `Select` with your own `options`.

## Anatomy

A single component: a `Select` whose options are generated from `min`, `max` and
`intervalInMinutes`.

```tsx
<FormField label="Start time" htmlFor="start-time">
  <TimePicker id="start-time" placeholder="Start time" defaultValue="09:00" />
</FormField>
```

## Choosing props

| Prop                     | Value                                     | Use for                                                       |
| ------------------------ | ----------------------------------------- | ------------------------------------------------------------- |
| `value` / `defaultValue` | `'HH:mm'` string (24-hour)                | controlled / uncontrolled time                                |
| `onValueChange`          | `(value: string) => void`                 | receives `'HH:mm'`                                            |
| `min` / `max`            | `'HH:mm'`, defaults `'00:00'` / `'23:59'` | bound the list                                                |
| `intervalInMinutes`      | number, default `15`                      | the step between options                                      |
| `format`                 | `24h` (default) / `12h`                   | labels only (`14:30` vs `02:30 PM`)                           |
| `mode`                   | `from`                                    | the start of a range: drops the last time                     |
|                          | `to`                                      | the end of a range: drops the first time                      |
| `preset`                 | `border` (default) / `ghost`              | standalone form field / inside a table row or toolbar         |
| `variant`                | `primary` (default) / `danger`            | normal / failed validation                                    |
| `size`                   | `md` (default) / `sm` / `lg`              | same heights as `TextInput` and `DatePicker`, so they line up |
| `clearable`              | `true`                                    | the time is optional                                          |

## States

- Empty (placeholder, default `'Time'`), picked, open, invalid, disabled. With `clearable`, a clear
  button appears once a time is picked. Disabled leaves the tab order.

## Content

- Placeholder names the field ("Start time"). Use `12h` only where the audience reads 12-hour
  time; the stored value does not change.

## Accessibility

- Name it with `id` plus a label (`FormField` `htmlFor`) or `aria-label`; don't rely on the
  placeholder.
- The clear button is a separate control; `clearSelectionAriaLabel` sets its name.
- For an invalid time, use `variant="danger"` with `FormField` `errorText`, which links the message.

## Do / Don't

```tsx
// Do: a time range, end after start
<div className="gap-ws-5 flex">
  <TimePicker aria-label="Start time" mode="from" value={start} onValueChange={setStart} />
  <TimePicker
    aria-label="End time"
    mode="to"
    min={start}
    value={end}
    onValueChange={setEnd}
    variant={end && start && end <= start ? 'danger' : 'primary'}
  />
</div>
```

```tsx
// Don't: 12-hour values
<TimePicker format="12h" defaultValue="02:30 PM" />
// Do
<TimePicker format="12h" defaultValue="14:30" aria-label="Start time" />
```

## Gotchas

- The value is always 24-hour `HH:mm`, even with `format="12h"`. Clearing reports `''`, not
  `undefined`.
- `min` / `max` must be `HH:mm`; anything else, or `intervalInMinutes` ≤ 0, gives an empty list
  (with a console warning for bad formats).
- `options` is not accepted, and passing `children` replaces the generated list with your own
  `Select` parts; use `Select` for that instead.
- The component is `TimePicker`; its folder and docs page are `timepicker`.
- `className` goes to the trigger; width utilities (`w-[10rem]`) set its width.
- DOM hook: `data-slot="time-picker"`.

## API

Full props: `https://wideset.co/components/timepicker.md` · Types:
`packages/design-system/src/components/timepicker/Timepicker.types.ts` (plus `SelectProps` in
`packages/design-system/src/components/select/Select.types.ts`)

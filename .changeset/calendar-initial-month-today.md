---
'@wideset/react': patch
---

Calendar: with `today` set and nothing selected, the calendar (and the DatePicker and DateRangePicker popups) opens on the month of `today` instead of the real current month. With `mode="multiple"` it opens on the earliest selected date.

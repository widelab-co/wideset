---
'@wideset/react': patch
---

DateRangePicker: in controlled mode (`selected` + `onSelect`) the first click of a range in the calendar is no longer dropped, so the reported range starts on the day the user clicked first.

---
'@wideset/react': patch
---

DateRangePicker: the date presets (Today, This Week, Last Month, …) and `defaultDatePreset` now count from the `today` prop the calendar uses, instead of always from the real clock, so a screen with a fixed sample date can use presets.

---
'@wideset/react': patch
---

Remove press scaling from Select and MultiSelect fields, TimePicker, Pagination selectors, FilterButton, DatePicker and DateRangePicker fields, Calendar month/year header buttons, and SplitButton's menu trigger. Hover, pressed colors, focus feedback, and popup animations remain.

Button and IconButton now suppress press scaling automatically when the rendered element has `aria-haspopup` other than `false`, including when composed with Radix menu or popup triggers. Ordinary actions retain press scaling; no additional animation prop is required. Custom popup triggers must expose the appropriate `aria-haspopup` semantics, since `onClick` behavior is not inspected.

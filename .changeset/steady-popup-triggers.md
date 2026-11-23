---
'@wideset/react': patch
---

Remove press scaling from Select and MultiSelect fields, TimePicker, Pagination selectors, FilterButton, date fields, Calendar month/year header buttons, and SplitButton's menu trigger; automatically suppress Button and IconButton press scaling when `aria-haspopup` is present and not `false`, while retaining press scaling for ordinary actions.

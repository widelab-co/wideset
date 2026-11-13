---
'@wideset/react': patch
---

`Select` keeps its value on one line, aligned to its start (left, or right with `dir="rtl"`), and cuts a long label with an ellipsis, with or without a prefix (it used to centre and wrap onto two lines). The fields built on its trigger (`MultiSelect`, `ComboBox`, `Timepicker`, `Pagination`) follow. `FilterButton` cuts a long selected value with an ellipsis instead of clipping it.

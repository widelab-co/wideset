---
'@wideset/react': patch
---

`Select` and `MultiSelect` end the field as Figma does: the arrow and the clear button are 24 / 32 / 40px icon buttons side by side, 4px from the right edge, one text inset (12 / 16 / 16px) after the value, with a 20px arrow at lg (it was 16px). The clear button no longer sits on a hand-tuned offset, and `MultiSelect` sets its tags 4 / 8 / 8px from the edge, so two tags fit on one line next to the clear button again.

---
'@wideset/react': minor
---

The type scale has titles at 24/32/40px and subtitles at 16/18/20px, matching the renamed Wideset Core text styles in Figma. A title's size now follows its container: the page heading stays 32px (`typography-title-md`), and the titles of cards, sections and dialogs get smaller. The 48–72px display sizes are gone.

**Breaking.** `typography-subtitle-lg` is removed and the `title-*` and `subtitle-*` classes change size. `Card.Title` is now 16px (was 20px); Modal, Popup and StatusModal titles (`subtitle-sm`) shrink from 20px to 18px and the Sidepanel title (`subtitle-md`) from 24px to 20px. Avatar does not change. Migrate by role:

| Old class (size)                                     | New class (size)                                                                      |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `typography-subtitle-lg` (32)                        | `typography-title-md` (32): page heading, sign-in title                               |
| `typography-subtitle-md` (24), heading or key figure | `typography-title-sm` (24) for a heading; `typography-title-md` (32) for a KPI figure |
| `typography-subtitle-md` (24), side panel title      | `typography-subtitle-md` (20)                                                         |
| `typography-subtitle-sm` (20)                        | `typography-subtitle-sm` (18)                                                         |
| `typography-subtitle-xs` (18)                        | `typography-subtitle-xs` (16)                                                         |
| `typography-title-lg` / `-md` / `-sm` (72 / 56 / 48) | `typography-title-lg` (40) for the one figure a page is about                         |

```tsx
// Before
<h1 className="typography-subtitle-lg">Invoices</h1>
<p className="typography-subtitle-md tabular-nums">€12,480</p>
// After
<h1 className="typography-title-md">Invoices</h1>
<p className="typography-title-md tabular-nums">€12,480</p>
```

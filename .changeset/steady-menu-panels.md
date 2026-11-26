---
'@wideset/react': minor
---

Match DropdownMenu submenu and radio-item styling to the main menu, tighten separator spacing, let long menus scroll within the viewport with 10px of default edge padding, and portal submenus by default.

**Breaking:** `DropdownMenu.SubTrigger` and `DropdownMenu.RadioItem` now include a chevron and a checkmark, respectively. If you supply your own indicator, pass a single custom row through `asChild`.

Before

```tsx
<DropdownMenu.RadioItem value="asc">
  <DropdownMenu.ItemIndicator aria-hidden>✓</DropdownMenu.ItemIndicator>
  Ascending
</DropdownMenu.RadioItem>
```

After

```tsx
<DropdownMenu.RadioItem value="asc" asChild>
  <div>
    <DropdownMenu.ItemIndicator aria-hidden>✓</DropdownMenu.ItemIndicator>
    Ascending
  </div>
</DropdownMenu.RadioItem>
```

# DropdownMenu

## When to use

- "More" buttons, row actions, an account menu: several actions that do not deserve their own
  buttons.
- Each item does something immediately (rename, duplicate, delete, sign out).

## When not to use

- Choosing a form value → `Select`, `MultiSelect` or `ComboBox`.
- Primary navigation → `Sidebar` or `Tabs`.
- A main action with a few alternatives on one button → `SplitButton`.
- Content or a decision with text and buttons → `Popup`.
- Long or searchable lists → `ComboBox`.

## Do / Don't

```tsx
// Do: a Button or IconButton as the trigger
<DropdownMenu.Trigger asChild>
  <IconButton icon={RiMore2Line} aria-label="More actions" variant="secondary" preset="ghost" />
</DropdownMenu.Trigger>

// Don't: a bare icon is not focusable, so keyboard users cannot open the menu
<DropdownMenu.Trigger asChild>
  <RiMore2Line />
</DropdownMenu.Trigger>
```

- Don't use it to pick a value that stays displayed → `Select`.
- Don't put more than one `danger` item in a menu.

## Gotchas

- Group related actions in a submenu. Put `SubTrigger` and `SubContent` together inside `DropdownMenu.Sub`.
- Use `RadioGroup` and `RadioItem` for a single menu setting, such as sort order. The selected item
  includes a checkmark.
- `CheckboxItem` and `ItemIndicator` need custom styling.
- `DropdownMenu.Portal` is optional: Content already portals. Wrap only to set a different
  `container` or `forceMount`.
- Items are styled by `ListItem`; do not wrap their children in another `ListItem`.

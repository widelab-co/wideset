---
name: DropdownMenu
import: import { DropdownMenu, ListItem } from '@wideset/react'
group: overlays
status: stable
parts:
  [
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuGroup,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuCheckboxItem,
    DropdownMenuItemIndicator,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
  ]
related: [ListItem, Select, SplitButton, Popup]
docs: https://wideset.co/components/dropdown-menu
storybook: components-dropdownmenu--default
---

# DropdownMenu

> A short list of commands anchored to a trigger; picking an item runs it at once.

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

## Anatomy

```tsx
<DropdownMenu>
  <DropdownMenu.Trigger asChild>
    <Button variant="secondary" preset="border">
      Actions
      <Button.Icon icon={RiArrowDownSLine} />
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="start">
    <DropdownMenu.Label>File</DropdownMenu.Label>
    <DropdownMenu.Item onSelect={rename}>
      <ListItem.Prefix>
        <RiPencilLine className="size-ws-9" />
      </ListItem.Prefix>
      <ListItem.Content>
        <ListItem.Label>Rename</ListItem.Label>
      </ListItem.Content>
    </DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item variant="danger" onSelect={remove}>
      <ListItem.Prefix>
        <RiDeleteBinLine className="size-ws-9" />
      </ListItem.Prefix>
      <ListItem.Content>
        <ListItem.Label>Delete</ListItem.Label>
      </ListItem.Content>
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu>
```

An item's inside is a `ListItem` composition (`ListItem.Prefix`, `.Content`, `.Label`,
`.Description`, `.Suffix`). `DropdownMenu.Content` portals itself to `document.body`.

## Choosing props

| Prop                            | Value                                       | Use for                                                          |
| ------------------------------- | ------------------------------------------- | ---------------------------------------------------------------- |
| `variant`                       | on Item: `primary` (default)                | Every ordinary action.                                           |
|                                 | `danger`                                    | Destroy or sign out; one per menu, last, after a Separator.      |
| `disabled`                      | on Item                                     | Unavailable now, and the label says why; otherwise leave it out. |
| `inset`                         | on Label                                    | Align a label with item text in menus with leading icons.        |
| `side` / `align` / `sideOffset` | on Content (defaults `bottom`, `center`, 4) | Placement against the trigger. `align="start"` for text buttons. |
| `portalContainer`               | on Content                                  | Render into another node instead of `document.body`.             |

State: `open` + `onOpenChange` (controlled) or `defaultOpen`, on `DropdownMenu` (Radix Dropdown
Menu). Run actions in the item's `onSelect`; it fires for pointer and keyboard and then closes
the menu (call `event.preventDefault()` to keep it open).

## Content

- Item labels start with a verb, sentence case ("Download PDF", "Delete invoice").
- Icons on all items or none.
- Group with `DropdownMenu.Label` and `DropdownMenu.Separator` past about five items.

## Accessibility

- Radix gives the `menu` / `menuitem` roles, arrow keys, typeahead, Enter and Escape; disabled
  items are skipped.
- An icon-only trigger needs an `aria-label` (`IconButton` takes it).
- Focus returns to the trigger after keyboard use.

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

- `CheckboxItem`, `RadioGroup`, `RadioItem`, `ItemIndicator`, `Sub`, `SubTrigger` and
  `SubContent` are exported as plain Radix parts without Wideset styling. Avoid them; use a
  flat menu of `DropdownMenu.Item`, or a `Select` / `MultiSelect` for choices.
- `DropdownMenu.Portal` is optional: Content already portals. Wrap only to set a different
  `container` or `forceMount`.
- Items are styled by `ListItem`; do not wrap their children in another `ListItem`.

## API

Full props: `https://wideset.co/components/dropdown-menu.md` · Types:
`packages/design-system/src/components/dropdown/DropdownMenu.types.ts`

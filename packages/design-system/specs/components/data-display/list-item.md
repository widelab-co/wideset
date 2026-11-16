---
name: ListItem
import: import { ListItem } from '@wideset/react'
group: data-display
status: stable
parts:
  [ListItem, ListItemPrefix, ListItemContent, ListItemLabel, ListItemDescription, ListItemSuffix]
related: [DropdownMenu, Select, Table, ActionTile, Avatar]
docs: https://wideset.co/components/list-item
storybook: helper-components-listitem--default
---

# ListItem

> One compact row: a leading slot, a label with an optional description, a trailing slot.

## When to use

- The row look shared by `DropdownMenu`, `Select`, `MultiSelect` and `ComboBox`. Those menus
  render ListItem for you; reach for it directly only for a custom menu or list of the same kind.
- A short list in a panel or card where each item is one thing (a file, a person, a setting)
  with at most one fact or control beside it.

## When not to use

- Items with several attributes to compare → `Table`.
- A standalone entry point to a page or action → `ActionTile`.
- A choice the user selects, as cards → `Tile`.
- A plain, non-interactive list of facts → native `ul` / `dl` with `typography-*` classes;
  ListItem always looks clickable (hover tint, pointer).

## Anatomy

```tsx
<ListItem>
  <ListItem.Prefix>
    {/* icon, Avatar size="xs", Checkbox */}
    <RiFolderLine className="size-ws-9" />
  </ListItem.Prefix>
  <ListItem.Content>
    <ListItem.Label>Marketing assets</ListItem.Label>
    <ListItem.Description>24 files, edited today</ListItem.Description>
  </ListItem.Content>
  <ListItem.Suffix>2.4 MB</ListItem.Suffix>
  {/* fact, shortcut, Switch, chevron */}
</ListItem>
```

A label alone can sit directly in `ListItem` (no `Content`). Named exports (`ListItemLabel`, …)
are the same parts for Server Components.

## Choosing props

| Prop                     | Value                   | Use for                                                     |
| ------------------------ | ----------------------- | ----------------------------------------------------------- |
| `variant`                | `primary` (default)     | Every ordinary row.                                         |
|                          | `danger`                | A row whose action destroys something (Delete, Leave team). |
| `disabled`               | `true`                  | Unavailable row; sets `aria-disabled`, ignores hover/press. |
| `data-state`             | `checked` / `unchecked` | Selected row in a custom list; shows a trailing checkmark.  |
| `shouldDisplayCheckmark` | `false`                 | Keep the checked tint but drop the checkmark.               |

## States

- Hover, press and keyboard highlight are live. Inside Radix menus the menu sets `data-state`
  and `data-highlighted`; you don't.
- Disabled keeps the row readable to screen readers but inert to the pointer.

## Content

- Label: a noun or a verb phrase, sentence case, one line (it truncates first).
- Description: one short line of context (count, date, role). Not a sentence.
- One `danger` row per menu, placed last.

## Accessibility

- ListItem is a `div` with no role. Inside Wideset menus the menu supplies roles and keyboard
  handling. Standalone, give the list semantics yourself (`ul` > `li` > `ListItem`) and, if a
  row acts on click, a role, `tabIndex={0}` and Enter/Space handling — or use `ActionTile`,
  which renders a real `<a>` or `<button>`.
- A `Checkbox` or `Switch` in a slot needs its own `aria-label`.
- Icons in `Prefix` are decorative; the label names the row.

## Do / Don't

```tsx
// Do: destructive row marked as danger
<ListItem variant="danger">
  <ListItem.Prefix>
    <RiDeleteBinLine className="size-ws-9" />
  </ListItem.Prefix>
  <ListItem.Label>Delete project</ListItem.Label>
</ListItem>

// Don't: rebuild menu rows by hand inside DropdownMenu — use DropdownMenuItem
```

- Don't put two controls in one row; a row has one action.
- Don't use ListItem as a navigation list of pages → `Sidebar.Item` or `ActionTile`.

## Gotchas

- `disabled` and `data-disabled` both disable; Radix items set `data-disabled` for you.
- The checkmark appears only when `data-state="checked"`; there is no `selected` or `checked` prop.
- `ListItem.Description` throws outside `<ListItem>`; it reads `variant` and `disabled` from it.
- Animations follow `MotionProvider`; `defaultMotion={false}` turns them off for one row.

## API

Full props: `https://wideset.co/components/list-item.md` · Types:
`packages/design-system/src/components/list-item/ListItem.types.ts`

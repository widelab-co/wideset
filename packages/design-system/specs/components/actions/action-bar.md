---
name: ActionBar
import: import { ActionBar } from '@wideset/react'
group: actions
status: stable
parts: [ActionBar, ActionBarCount, ActionBarActions, ActionBarSelectAll]
related: [Button, IconButton, Checkbox, Tooltip, Table]
docs: https://wideset-docs.widelab.workers.dev/components/action-bar
storybook: components-actionbar--default
---

# ActionBar

> A floating bar with the selection count, Select all and the actions for the selected items.

## When to use

- Bulk actions on selected table rows, list items or files: Publish, Export, Delete.
- The bar appears while something is selected and goes away when the selection is cleared.

## When not to use

- Actions that are always available, without a selection → `Button` / `IconButton` in the page
  or table header.
- Feedback after the bulk action ran → `Toast`.
- One default action with alternatives → `SplitButton`.

## Anatomy

```tsx
<ActionBar isOpen={selected.length > 0}>
  <ActionBar.Count>{selected.length} rows selected</ActionBar.Count>
  <ActionBar.Actions>
    <ActionBar.SelectAll
      checked={selected.length === rows.length || 'indeterminate'}
      onCheckedChange={(checked) => setSelected(checked === true ? rows.map((row) => row.id) : [])}
    />
    <Button variant="secondary" size="sm">
      <Button.Icon icon={RiSendPlaneLine} />
      Publish
    </Button>
    <Tooltip size="sm" arrow={false}>
      <Tooltip.Trigger asChild>
        <IconButton
          variant="danger"
          preset="ghost"
          size="sm"
          icon={RiDeleteBin6Line}
          aria-label="Delete"
        />
      </Tooltip.Trigger>
      <Tooltip.Content>
        <Tooltip.Label>Delete</Tooltip.Label>
      </Tooltip.Content>
    </Tooltip>
  </ActionBar.Actions>
</ActionBar>
```

`ActionBar.Count` sits on the bar; `ActionBar.Actions` is the raised segment beside it, with
`ActionBar.SelectAll` first and the actions after it.

## Choosing props

| Prop                               | Value                      | Use for                                                        |
| ---------------------------------- | -------------------------- | -------------------------------------------------------------- |
| `isOpen`                           | `false` (default) / `true` | Visibility. Tie it to "selection is not empty".                |
| `position`                         | `bottom` (default)         | Stays clear of the table header and page title.                |
|                                    | `top`                      | Something already occupies the bottom (chat button, banner).   |
| `align`                            | `center` (default)         | A full-width table.                                            |
|                                    | `left` / `right`           | The selection lives in one column (list beside a detail pane). |
| `checked` on `ActionBar.SelectAll` | `'indeterminate'`          | Some items are selected; a click selects the rest.             |
|                                    | `true`                     | Every item is selected; a click clears the selection.          |
| `label` on `ActionBar.SelectAll`   | `'Select all'` (default)   | Translate it, or name the items ("Select all clients").        |

## States

- Open: fades and slides in. Closed: stays mounted, invisible, `aria-hidden` and `inert`, so it
  can animate out.
- While the bar is open Select all is never unchecked: `'indeterminate'` for some, `true` for all.

## Content

- The count says what is selected: "4 rows selected", "1 file selected". Write the plural
  yourself; the bar formats nothing.
- A few actions, all `size="sm"`: the main one a labelled `Button variant="secondary"`, the rest
  `IconButton variant="secondary"` with a `Tooltip`, a destructive one last with
  `variant="danger"`.
- More than four actions: put the rest behind a "More actions" `IconButton` (`RiMoreFill`) that
  opens a `DropdownMenu`.

## Accessibility

- `ActionBar.Count` is a polite live region (`role="status"`): a screen reader reads the count
  as it changes, without moving focus.
- Closed, the bar is `inert` and hidden from assistive tech; it cannot be tabbed into.
- Tab order is the visual order: Select all, then the actions.
- Icon-only actions need `aria-label`.
- An action that clears the selection closes the bar under the focused button: move focus back
  to the table, such as the first row's checkbox.

## Do / Don't

```tsx
// Do: keep it mounted and toggle isOpen, so it animates out
<ActionBar isOpen={selected.length > 0}>…</ActionBar>

// Don't: unmount it on close (no exit animation)
{selected.length > 0 && <ActionBar isOpen>…</ActionBar>}

// Don't: actions straight on the bar, outside ActionBar.Actions
<ActionBar isOpen><Button size="sm">Delete</Button></ActionBar>

// Don't: md / lg buttons inside
<ActionBar.Actions><Button>Delete</Button></ActionBar.Actions>   // use size="sm"
```

## Gotchas

- `isOpen` defaults to `false`; a bar without it renders invisible.
- The bar holds no selection: `ActionBar.SelectAll` is a `Checkbox`. Pass `checked`, and fill or
  clear the selection in `onCheckedChange`.
- There is no close button. The selection clears from Select all (a click once everything is
  selected) or from the rows.
- The bar is `position: fixed` to the viewport. A transformed ancestor becomes its containing
  block, which is how the docs keep it inside a preview box.
- Default copy is English ("Select all"); pass `label` to translate it.

## API

Full props: `https://wideset-docs.widelab.workers.dev/components/action-bar.md` · Types:
`packages/design-system/src/components/action-bar/ActionBar.types.ts`

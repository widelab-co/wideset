---
name: ActionBar
import: import { ActionBar } from '@wideset/react'
group: actions
status: stable
parts: [ActionBar]
related: [Button, IconButton, Table]
docs: https://wideset.co/components/action-bar
storybook: components-actionbar--default
---

# ActionBar

> A floating bar of actions for the items the user has selected.

## When to use

- Bulk actions on selected table rows, list items or files: Export, Download, Delete.
- The bar appears while something is selected and goes away when the selection is cleared.

## When not to use

- Actions that are always available, without a selection → `Button` / `IconButton` in the page
  or table header.
- Feedback after the bulk action ran → `Toast`.
- One default action with alternatives → `SplitButton`.

## Anatomy

```tsx
<ActionBar
  isOpen={selected.length > 0}
  amountSelected={selected.length}
  onClose={() => setSelected([])}
>
  <Button preset="border" variant="secondary" size="sm">
    <Button.Icon icon={RiDownloadLine} />
    Download
  </Button>
  <Button preset="border" variant="danger" size="sm">
    <Button.Icon icon={RiDeleteBinLine} />
    Delete
  </Button>
  <IconButton
    preset="border"
    variant="secondary"
    size="sm"
    icon={RiMoreFill}
    aria-label="More actions"
  />
</ActionBar>
```

Order inside: close button (from `onClose`), the count, then your children. Children are size
`sm` buttons or icon buttons.

## Choosing props

| Prop             | Value                       | Use for                                                        |
| ---------------- | --------------------------- | -------------------------------------------------------------- |
| `isOpen`         | `false` (default) / `true`  | Visibility. Tie it to "selection is not empty".                |
| `amountSelected` | number                      | Default label "`N` selected".                                  |
|                  | `[count, (n) => ReactNode]` | Own wording or translation ("12 rows").                        |
|                  | omitted                     | No count label.                                                |
| `onClose`        | function                    | Renders the close button; clear the selection in it.           |
|                  | omitted                     | No close button, when dismissal is handled elsewhere.          |
| `position`       | `bottom` (default)          | Stays clear of the table header and page title.                |
|                  | `top`                       | Something already occupies the bottom (chat button, banner).   |
| `align`          | `center` (default)          | A full-width table.                                            |
|                  | `left` / `right`            | The selection lives in one column (list beside a detail pane). |
| `closeAriaLabel` | string, `'Close'` default   | Name of the close button.                                      |

## States

- Open: fades and slides in. Closed: stays mounted, invisible, `aria-hidden` and `inert`, so it
  can animate out.

## Content

- A few actions; overflow goes behind a "More actions" `IconButton` (`RiMoreFill`).
- Destructive actions use `variant="danger"`.

## Accessibility

- Closed, the bar is `inert` and hidden from assistive tech; it cannot be tabbed into.
- Icon-only actions need `aria-label`. Set `closeAriaLabel` to say what closing does ("Clear
  selection") when "Close" is not enough.

## Do / Don't

```tsx
// Do: keep it mounted and toggle isOpen, so it animates out
<ActionBar isOpen={selected.length > 0} … />

// Don't: unmount it on close (no exit animation)
{selected.length > 0 && <ActionBar isOpen … />}

// Don't: md / lg buttons inside
<ActionBar isOpen><Button>Delete</Button></ActionBar>   // use size="sm"
```

## Gotchas

- `isOpen` defaults to `false`; a bar without it renders invisible.
- `onClose` does not change anything by itself. Clear the selection (and so `isOpen`) in it.
- The bar is `position: fixed` to the viewport. A transformed ancestor becomes its containing
  block, which is how the docs keep it inside a preview box.
- Default copy is English ("`N` selected"); use the tuple form to translate.
- `NaN` as `amountSelected` hides the label.

## API

Full props: `https://wideset.co/components/action-bar.md` · Types:
`packages/design-system/src/components/action-bar/ActionBar.types.ts`

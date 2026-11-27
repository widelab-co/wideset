# ActionBar

## When to use

- Bulk actions on selected table rows, list items or files: Publish, Export, Delete.
- The bar appears while something is selected and goes away when the selection is cleared.

## When not to use

- Actions that are always available, without a selection → `Button` / `IconButton` in the page
  or table header.
- Feedback after the bulk action ran → `Toast`.
- One default action with alternatives → `SplitButton`.

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
- Add a button inside `ActionBar.Actions` to clear a partial selection in one step.
- When migrating, move the formatted `amountSelected` into `ActionBar.Count`, wrap the actions
  in `ActionBar.Actions`, and use a labelled button for the legacy `onClose` action.
- The bar is `position: fixed` to the viewport, also for a table inside a card: it stays on
  screen while the user scrolls and selects. An ancestor with `transform`, `filter` or
  `contain` (an animated page wrapper, for one) becomes its containing block and pins it to
  that element instead; render the bar outside such a wrapper.
- Default copy is English ("Select all"); pass `label` to translate it.

# TreeView

## When to use

- Files and folders of a repository, a drive or an attachment set.
- Nested categories or a document outline the user browses and picks from.
- Any hierarchy deeper than two levels that the user folds to find one item.

## When not to use

- The app's own navigation between product areas → `Sidebar` (it nests one level).
- A few titled sections of content the user reads or expands → `Accordion`.
- Showing where the current page sits in a hierarchy → `Breadcrumbs`.
- A flat list of records with attributes → `Table`.

## Do / Don't

```tsx fragment
// Do: a leaf opens its document through onValueChange
<TreeView aria-label="Docs" value={page} onValueChange={setPage}>…</TreeView>

// Don't: a link or button inside a row; the row is the control
<TreeView.Item value="a"><TreeView.Label><a href="/a">a</a></TreeView.Label></TreeView.Item>
```

- Keep `value`s unique across the whole tree; paths (`src/main.tsx`) make that easy.
- Give every item an icon, or none, within one tree.

## Gotchas

- Render `TreeView.Group` as a direct child of `TreeView.Item`. Wrapping the group in another
  component makes the item behave as a leaf.
- A branch is never the selected `value`: clicking it only folds it. A tree where a folder is
  also a page is not supported yet.
- `value={undefined}` makes the tree uncontrolled again; pass `""` for "nothing selected".
- Filtering: keep the filter's open branches in their own state, so clearing the filter brings
  back the folders the user had open (Storybook: Components/TreeView → Composition).
- Animations follow `MotionProvider`; `defaultMotion={false}` on `TreeView` turns them off.

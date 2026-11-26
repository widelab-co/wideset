---
name: TreeView
import: import { TreeView } from '@wideset/react'
group: navigation
status: beta
parts: [TreeView, TreeViewItem, TreeViewIcon, TreeViewLabel, TreeViewSuffix, TreeViewGroup]
related: [Sidebar, Accordion, Breadcrumbs]
docs: https://wideset.co/components/tree-view
storybook: components-treeview--default
---

# TreeView

> Show a hierarchy whose levels fold open and shut, and pick one item from its leaves.

## When to use

- Files and folders of a repository, a drive or an attachment set.
- Nested categories or a document outline the user browses and picks from.
- Any hierarchy deeper than two levels that the user folds to find one item.

## When not to use

- The app's own navigation between product areas → `Sidebar` (it nests one level).
- A few titled sections of content the user reads or expands → `Accordion`.
- Showing where the current page sits in a hierarchy → `Breadcrumbs`.
- A flat list of records with attributes → `Table`.

## Anatomy

```tsx
<TreeView aria-label="Files" defaultExpanded={['src']} defaultValue="src/main.tsx">
  <TreeView.Item value="src">
    <TreeView.Icon icon={RiFolderLine} expandedIcon={RiFolderOpenLine} /> {/* optional */}
    <TreeView.Label>src</TreeView.Label>
    <TreeView.Suffix>2</TreeView.Suffix> {/* optional: a count, a letter, a dot */}
    <TreeView.Group>
      <TreeView.Item value="src/main.tsx">
        <TreeView.Icon icon={RiCodeSSlashLine} />
        <TreeView.Label>main.tsx</TreeView.Label>
      </TreeView.Item>
    </TreeView.Group>
  </TreeView.Item>
</TreeView>
```

An item with a `TreeView.Group` is a branch: it folds. An item without one is a leaf: it is
selected. Named exports (`TreeViewItem`, …) are the same parts for Server Components.

## Choosing props

| Prop                           | Value              | Use for                                                            |
| ------------------------------ | ------------------ | ------------------------------------------------------------------ |
| `value` / `defaultValue`       | a leaf's `value`   | The one selected leaf; `""` keeps a controlled tree unselected.    |
| `expanded` / `defaultExpanded` | branch `value`s    | Which branches are open; control it for Expand all / Collapse all. |
| `disabled`                     | on `TreeView.Item` | An item that exists but cannot be opened or picked now.            |
| `expandedIcon`                 | on `TreeView.Icon` | The open-folder glyph while the branch is open.                    |

## Accessibility

- Name the tree with `aria-label` or `aria-labelledby`.
- Every item needs a `TreeView.Label`: it is the item's accessible name and what type-ahead
  matches. The suffix is read after the name ("src, 2").
- A suffix that is only a letter or a dot needs visually hidden text that names it
  (`<span className="sr-only">modified</span>`).
- The keyboard follows the WAI-ARIA tree pattern (one tab stop, arrows, Home, End, type-ahead);
  do not add your own key handlers or make rows separate tab stops.

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

## API

Full props: `https://wideset.co/components/tree-view.md` · Types:
`packages/design-system/src/components/tree-view/TreeView.types.ts`

# Navigation

Components that move the user between places or tell them where they are: across the app
(Sidebar), up a hierarchy (Breadcrumbs), between sections of one page (Tabs), through pages of a
collection (Pagination), through the ordered steps of a flow (ProgressStepper) and down a
folding hierarchy of content (TreeView). None of them
changes data; for actions use `actions`, for choosing a value use `selection` or `inputs`.

## Pick the right one

- **Moving between product areas, always visible on the left** → [Sidebar](./sidebar.md)
- **Showing the path to the current page and stepping back up** → [Breadcrumbs](./breadcrumbs.md)
- **Switching between sibling sections of one page** → [Tabs](./tabs.md)
- **Paging through a long list or table** → [Pagination](./pagination.md)
- **Showing the current step of an ordered, titled flow** → [ProgressStepper](./progress-stepper.md)
- **Browsing a folding hierarchy (files, categories) and picking one item** → [TreeView](./tree-view.md)

Close calls:

- Tabs vs SegmentedControl: Tabs swap whole sections with their own panels; SegmentedControl
  picks a value (view mode, filter) for the same content.
- ProgressStepper vs Tabs: steps have an order and a status; tabs can be visited in any order.
- ProgressStepper vs ProgressTracker: the stepper names each step; the tracker is compact
  segments without titles.
- TreeView vs Sidebar: TreeView browses content of any depth inside a page; Sidebar is the
  app's navigation between areas.
- Sidebar vs Sidepanel: Sidebar is the permanent app navigation; Sidepanel is a temporary
  overlay (see `overlays`).

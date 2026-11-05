# Sidebar

## When to use

- The persistent left-hand navigation of an application shell, between product areas.
- When the layout needs both a labelled view and a compact icon-only view.

## When not to use

- Switching sections inside one page → `Tabs`.
- Showing the position in a hierarchy → `Breadcrumbs`.
- A temporary panel of filters or details over the page → `Sidepanel`.
- A menu of actions on one element → `DropdownMenu`.

## Do / Don't

```tsx
// Do: router link through asChild, no children besides the Link element
<Sidebar.Item asChild icon={RiFolder3Line} label="Projects" active={isProjects}>
  <Link to="/projects" />
</Sidebar.Item>

// Don't: children on a plain item (the type forbids it); use label
<Sidebar.Item href="/projects">Projects</Sidebar.Item>

// Do: a named group of items
<Sidebar.Group label="Core team">
  <Sidebar.Item href="/issues" icon={RiStackLine} label="Issues" />
</Sidebar.Group>

// Don't: a hand-made heading with its own icon; it falls out of line with the items
<div className="flex items-center gap-ws-3"><RiTeamLine /> Core team</div>

// Do: one level of children, indented by the item itself
<Sidebar.Item href="/pages/important" icon={RiFileTextLine} label="Important" nested />

// Don't: a hand-made tree with a guide line
<div className="ml-ws-9 border-l pl-ws-3"><Sidebar.Item … /></div>

// Do: a count on the row's edge
<Sidebar.Item href="/inbox" icon={RiInboxLine} label="Inbox" suffix={3} />

// Don't: an absolutely placed count over the row; it misses the shared right edge
<div className="relative"><Sidebar.Item … /><span className="absolute right-ws-5">3</span></div>
```

## Gotchas

- A row action (a "…" menu) is a button and cannot sit in `suffix`: the row is a link. Lay it
  over the row's right edge as a sibling, at the suffix's inset.

- `Sidebar.Section` renders nothing in a mode it has no `Sidebar.Expanded` / `Sidebar.Collapsed`
  child for. Content put straight into a Section without them disappears.
- The item's `icon` takes a component (`icon={RiFolder3Line}`), not an element.
- `onCollapsedChange` fires in both modes; with `collapsed` set, nothing changes until you update it.
- `Sidebar.Trigger` with `asChild` merges the toggle onto your own button.
- Every part except `Sidebar.Header` throws outside `<Sidebar>`.

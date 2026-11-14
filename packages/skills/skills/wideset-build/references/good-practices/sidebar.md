# Sidebar

## When to use

- The persistent left-hand navigation of an application shell, between product areas. Put it in
  an `AppShell`: the sidebar then takes the surface of the app's direction (white with a line,
  grey tint, or the bare grey frame) without any prop. `surface` overrides it.
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

// Do: a named group of items under a section header
<Sidebar.SectionHeader id="core-team">Core team</Sidebar.SectionHeader>
<div role="group" aria-labelledby="core-team" className="gap-ws-2 flex flex-col">
  <Sidebar.Item href="/issues" icon={RiStackLine} label="Issues" />
</div>

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

// Don't: the same navigation twice, once per mode (it remounts and drops focus on toggle)
<Sidebar.Section>
  <Sidebar.Expanded>{nav}</Sidebar.Expanded>
  <Sidebar.Collapsed>{nav}</Sidebar.Collapsed>
</Sidebar.Section>

// Do: one tree
<Sidebar.Section>{nav}</Sidebar.Section>

// Do: a section's one "+" ends the header row, a shortcut shows on hover
<div className="flex items-end">
  <Sidebar.SectionHeader id="shared" className="flex-1">Shared</Sidebar.SectionHeader>
  <IconButton size="xs" preset="ghost" variant="secondary" icon={RiAddLine} aria-label="Add a shared page" className="mr-ws-3" />
</div>
<div role="group" aria-labelledby="shared" className="gap-ws-2 flex flex-col">
  <Sidebar.Item href="/inbox" icon={RiInboxLine} label="Inbox" suffix="⌘1" suffixOnHover />
</div>

// Don't: a "+" laid over the header by hand; it lands off the suffixes' edge
<div className="relative">…<IconButton className="absolute right-ws-0 top-ws-0" … /></div>
```

## Gotchas

- A `Sidebar.Section` whose only children are `Sidebar.Expanded` / `Sidebar.Collapsed` renders
  nothing in a mode it has no content for; any other section stays in both modes.
- A `Sidebar.Trigger` inside `Sidebar.Expanded` or `Sidebar.Collapsed` unmounts on toggle and
  loses focus; keep one trigger outside them.
- A row action (a "…" menu) is a button and cannot sit in `suffix`: the row is a link. Lay it
  over the row's right edge as a sibling, at the suffix's inset.
- The item's `icon` takes a component (`icon={RiFolder3Line}`), not an element.
- `onCollapsedChange` fires in both modes; with `collapsed` set, nothing changes until you update it.
- `Sidebar.Trigger` with `asChild` merges the toggle onto your own button.
- Every part except `Sidebar.Header` throws outside `<Sidebar>`.
- Restyling the sidebar's fill or line through `className` fights the surface classes; set
  `AppShell direction` (or `surface`) instead.

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

// Don't: the same navigation twice, once per mode (it remounts and drops focus on toggle)
<Sidebar.Section>
  <Sidebar.Expanded>{nav}</Sidebar.Expanded>
  <Sidebar.Collapsed>{nav}</Sidebar.Collapsed>
</Sidebar.Section>

// Do: one tree
<Sidebar.Section>{nav}</Sidebar.Section>
```

## Gotchas

- A `Sidebar.Section` whose only children are `Sidebar.Expanded` / `Sidebar.Collapsed` renders
  nothing in a mode it has no content for; any other section stays in both modes.
- A `Sidebar.Trigger` inside `Sidebar.Expanded` or `Sidebar.Collapsed` unmounts on toggle and
  loses focus; keep one trigger outside them.
- The item's `icon` takes a component (`icon={RiFolder3Line}`), not an element.
- `onCollapsedChange` fires in both modes; with `collapsed` set, nothing changes until you update it.
- `Sidebar.Trigger` with `asChild` merges the toggle onto your own button.
- Every part except `Sidebar.Header` throws outside `<Sidebar>`.

---
'@wideset/react': minor
---

Sidebar: one tree serves both modes. `Sidebar.Section` keeps its content mounted when the sidebar collapses, so a `Sidebar.Trigger` and the `Sidebar.Item`s written once keep keyboard focus across a toggle. New part `Sidebar.SectionHeader` (`SidebarSectionHeader`, `data-slot="sidebar-section-header"`) titles a group of items; collapsed, it keeps its height and its text stays available to screen readers. `Sidebar.Expanded` and `Sidebar.Collapsed` stay for content that exists in one mode only (the product name, a promo card).

**Breaking:** a `Sidebar.Section` with content outside `Sidebar.Expanded` / `Sidebar.Collapsed` used to render nothing; it now renders in both modes. A section whose only children are those wrappers still disappears in a mode it has no content for. Navigation duplicated in both wrappers keeps working, but remounts on toggle and drops focus. Move to one tree:

```tsx
// before
<Sidebar.Header>
  <Sidebar.Expanded>
    <div className="gap-ws-7 py-ws-3 pl-ws-5 flex items-center justify-between">
      <span>Northwind</span>
      <Sidebar.Trigger />
    </div>
  </Sidebar.Expanded>
  <Sidebar.Collapsed>
    <div className="py-ws-3 flex items-center">
      <Sidebar.Trigger />
    </div>
  </Sidebar.Collapsed>
</Sidebar.Header>
<Sidebar.Section>
  <Sidebar.Expanded>{nav}</Sidebar.Expanded>
  <Sidebar.Collapsed>{nav}</Sidebar.Collapsed>
</Sidebar.Section>

// after
<Sidebar.Header>
  <div className="gap-ws-7 py-ws-3 flex items-center">
    <Sidebar.Expanded>
      <span className="pl-ws-5">Northwind</span>
    </Sidebar.Expanded>
    <Sidebar.Trigger />
  </div>
</Sidebar.Header>
<Sidebar.Section>{nav}</Sidebar.Section>
```

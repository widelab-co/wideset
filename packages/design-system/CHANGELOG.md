# @wideset/react

## 1.1.0

### Minor Changes

- 90cfff1: Sidebar: one tree serves both modes. `Sidebar.Section` keeps its content mounted when the sidebar collapses, so a `Sidebar.Trigger` and the `Sidebar.Item`s written once keep keyboard focus across a toggle. New part `Sidebar.SectionHeader` (`SidebarSectionHeader`, `data-slot="sidebar-section-header"`) titles a group of items; collapsed, it keeps its height and its text stays available to screen readers. `Sidebar.Expanded` and `Sidebar.Collapsed` stay for content that exists in one mode only (the product name, a promo card).

## 1.0.0

First public release.

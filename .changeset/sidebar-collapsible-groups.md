---
'@wideset/react': minor
'@wideset/skills': patch
---

`Sidebar` gains collapsible groups: `Sidebar.Group` (`SidebarGroup`; `open` / `defaultOpen` / `onOpenChange`) folds the rows in its `Sidebar.GroupContent` (`SidebarGroupContent`) under a head, either a `Sidebar.Item` with a `Sidebar.GroupTrigger` (`SidebarGroupTrigger`) chevron beside it or a `<Sidebar.SectionHeader collapsible>`. Both toggles are buttons with `aria-expanded`; collapsed, the rail hides an item group's chevron and rows and keeps a collapsible section's chevron.

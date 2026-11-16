---
'@wideset/react': minor
'@wideset/skills': patch
---

`AppShell` draws the page's top bar: `AppShell.TopBar` (`AppShellTopBar`) is the 48px bar that stays at the top of `AppShell.Main`, with `AppShell.SidebarTrigger` (`AppShellSidebarTrigger`) to collapse and expand the `Sidebar` from the page, your `Breadcrumbs`, and `AppShell.TopBarActions` (`AppShellTopBarActions`) for the page's small tools. The bar's line follows the `direction`, and loose text in it takes the crumbs' 12px style. The `Sidebar` keeps its collapsed state (`defaultCollapsed`, `collapsed`, `onCollapsedChange`), so existing shells work unchanged. The app-shell specs describe the bar and where the page title goes.

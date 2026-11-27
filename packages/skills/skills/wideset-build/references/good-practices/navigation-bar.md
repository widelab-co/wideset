# NavigationBar

## When to use

- The primary navigation of a product with a handful of top-level areas, across the top.
- A page below the top level: the bar shows `Breadcrumbs` in place of the links.
- Tools that apply on every page: search, a theme or view switch, settings, inbox, notifications.

## When not to use

- More areas than fit in one row, or a product people work in all day → `Sidebar`.
- Switching between sections of one page → `Tabs`.
- The title and actions of one page → a page header inside `AppShell.Main` (see the app shell
  pattern).
- A marketing or docs site → your own header: `NavigationBar` is app navigation.

## Do / Don't

```tsx
// Do: router links through asChild, active from the current path
<NavigationBar.Item asChild active={pathname === '/analytics'}>
  <Link to="/analytics">
    <NavigationBar.Icon icon={RiBarChartLine} />
    <NavigationBar.Label>Analytics</NavigationBar.Label>
  </Link>
</NavigationBar.Item>

// Don't: bare text in an item; wrap it in NavigationBar.Label so it truncates
<NavigationBar.Item href="/analytics">Analytics</NavigationBar.Item>
```

```tsx
// Do: on a nested page, the path instead of the links
<NavigationBar>
  <Breadcrumbs separator="arrow">
    <Breadcrumbs.Item>Analytics</Breadcrumbs.Item>
    <Breadcrumbs.Item>Reports</Breadcrumbs.Item>
  </Breadcrumbs>
</NavigationBar>

// Don't: Breadcrumbs inside NavigationBar.Nav, a nav inside a nav
<NavigationBar.Nav>
  <Breadcrumbs separator="arrow">…</Breadcrumbs>
</NavigationBar.Nav>
```

- Don't build top-bar links from `Button`s or `Tabs`; use `NavigationBar.Item` (it renders an `<a>`).
- Don't mark more than one item `active`.

## Gotchas

- `NavigationBar.Icon` takes a component (`icon={RiHome5Line}`), not an element, and works only
  inside `NavigationBar.Item`.
- `NavigationBar.Nav` takes the room that is left: on a narrow screen the links shrink and their
  labels truncate. Under `md`, hide it (`className="hidden md:flex"`) and open the links in a
  `Sidepanel` from the menu button.
- The bar has no background of its own: it shows the page behind it. In an `AppShell` without a
  `Sidebar` it is the first child of `AppShell.Main`.

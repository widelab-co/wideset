---
name: NavigationBar
import: import { NavigationBar } from '@wideset/react'
group: navigation
status: stable
parts:
  [
    NavigationBar,
    NavigationBarStart,
    NavigationBarNav,
    NavigationBarItem,
    NavigationBarIcon,
    NavigationBarLabel,
    NavigationBarEnd,
    NavigationBarActions,
  ]
related: [Sidebar, Breadcrumbs, Tabs, AppShell, IconButton, TextInput, SegmentedControl]
docs: https://wideset.co/components/navigation-bar
storybook: components-navigationbar--default
---

# NavigationBar

> The app's top bar: the menu button and logo, the page links or the path to the current page,
> and the tools every page shares.

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

## Anatomy

```tsx
<NavigationBar>
  <NavigationBar.Start>
    <IconButton
      variant="secondary"
      preset="ghost"
      size="sm"
      icon={RiMenuLine}
      aria-label="Open menu"
    />
    {logo}
  </NavigationBar.Start>
  <NavigationBar.Nav>
    <NavigationBar.Item href="/" active>
      <NavigationBar.Icon icon={RiHome5Line} />
      <NavigationBar.Label>Dashboard</NavigationBar.Label>
    </NavigationBar.Item>
    <NavigationBar.Item href="/analytics">
      <NavigationBar.Icon icon={RiBarChartLine} />
      <NavigationBar.Label>Analytics</NavigationBar.Label>
    </NavigationBar.Item>
  </NavigationBar.Nav>
  <NavigationBar.End>
    <TextInput size="sm" className="w-[10rem]">
      …
    </TextInput>
    <NavigationBar.Actions>
      <IconButton
        variant="secondary"
        preset="ghost"
        size="sm"
        icon={RiSettings3Line}
        aria-label="Settings"
      />
    </NavigationBar.Actions>
  </NavigationBar.End>
</NavigationBar>
```

The root is a `header` that spaces its groups; `NavigationBar.End` pushes itself to the end and
`NavigationBar.Actions` keeps its icon buttons close together. An item holds
`NavigationBar.Icon`, `NavigationBar.Label` and, after the label, an optional `Tag`; the icon
follows the item's state on its own. On a nested page, put `<Breadcrumbs separator="arrow">`
where `NavigationBar.Nav` would go. Every group is optional: leave out the menu button, search or
segmented control the product does not have. Controls in the bar are `size="sm"`; icon buttons
are `variant="secondary" preset="ghost"`.

## Choosing props

| Prop         | Value                   | Use for                                                                    |
| ------------ | ----------------------- | -------------------------------------------------------------------------- |
| `divider`    | `true` (default)        | The page starts right under the bar: a compact header, a toolbar, a table. |
|              | `false`                 | The page opens with a large title, or the bar sits on a grey page.         |
| `active`     | on `NavigationBar.Item` | The current page; one per bar.                                             |
| `disabled`   | on `NavigationBar.Item` | An area the user's plan or role does not include yet.                      |
| `asChild`    | on `NavigationBar.Item` | Render as a router `Link`, which then holds the icon and the label.        |
| `aria-label` | on `NavigationBar.Nav`  | Rename the landmark ("Main" by default) when another `nav` uses that name. |

## States

- Item: hover, pressed, focus, current (`aria-current="page"`), disabled (`aria-disabled`, out of
  the tab order, no `href`, click blocked before it reaches an `asChild` router `Link`; a `Tag` in
  it fades with it).

## Content

- Link labels are page names, one or two words, sentence case, the same as the page titles.
- About five links at most. More areas, or areas grouped in sections, need a `Sidebar`.
- An icon on every link or on none.
- Two or three icon actions; anything else belongs in a menu behind one of them.

## Accessibility

- At the top of the page the root `header` is the banner landmark: one bar per page.
- `NavigationBar.Nav` is a `nav` named "Main". With a `Sidebar` on the same page, give each
  `nav` its own name.
- `active` sets `aria-current="page"`, so the current page is announced.
- `NavigationBar.Icon` is hidden from screen readers; the label names the link, and a `Tag` after
  it becomes part of that name.
- The menu button, the icon actions and an icon-only segmented control need an `aria-label`.

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

## API

Full props: `https://wideset.co/components/navigation-bar.md` · Types:
`packages/design-system/src/components/navigation-bar/NavigationBar.types.ts`

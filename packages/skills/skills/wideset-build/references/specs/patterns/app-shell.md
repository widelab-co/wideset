# App shell

> The frame every screen sits in: collapsible navigation on the left, the page on the right.

## Problem

An app needs persistent navigation, a scrolling content area, one place for page-level alerts
and one place where toasts appear. [`AppShell`](../../good-practices/app-shell.md) is that frame:
a full-height row holding `Sidebar` and `AppShell.Main`. Its `direction` (`inset`, the default,
`flat`, `frame` or `canvas`) sets the window background, the sidebar's surface and the page's look
together, so pick it once for the whole app and do not restyle them by hand. [Visual directions](directions.md)
says which to pick and which starting screens go with each.

## Structure

```
ToastProvider                       — once, around the whole app
└ AppShell direction="…"           — full-height row; the direction's background
  ├ Sidebar                         — navigation; owns collapsed state; surface from AppShell
  │ ├ Sidebar.Header                — product name
  │ └ Sidebar.Section scrollable    — nav > Sidebar.Item, one tree for both modes
  └ AppShell.Main                   — <main>, the only scroll container for page content
    ├ AppShell.TopBar               — 48px, stays at the top of the page
    │ ├ AppShell.SidebarTrigger     — collapses and expands the Sidebar
    │ ├ Breadcrumbs                 — where you are
    │ └ AppShell.TopBarActions      — optional, the page's small tools
    ├ SystemAlert                   — optional, page-level notice, first
    ├ header                        — h1, summary, page actions
    └ page content                  — Cards, Table, forms …
```

## Example

```tsx
import { RiDashboardLine, RiFolder3Line, RiSettings3Line } from '@remixicon/react';
import { AppShell, Breadcrumbs, Button, Sidebar, ToastProvider } from '@wideset/react';
import type { ReactNode } from 'react';

const NAV = [
  { href: '/', label: 'Dashboard', icon: RiDashboardLine },
  { href: '/projects', label: 'Projects', icon: RiFolder3Line },
  { href: '/settings', label: 'Settings', icon: RiSettings3Line },
];

function Nav({ current }: { current: string }) {
  return (
    <nav aria-label="Main" className="gap-ws-2 flex flex-col">
      {NAV.map(({ href, label, icon }) => (
        <Sidebar.Item key={href} href={href} icon={icon} label={label} active={href === current} />
      ))}
    </nav>
  );
}

export function Shell({ current, children }: { current: string; children: ReactNode }) {
  return (
    <ToastProvider>
      <AppShell direction="inset">
        <Sidebar>
          <Sidebar.Header>
            <Sidebar.Expanded>
              <div className="typography-label-strong-sm text-ws-static-strong py-ws-3 pl-ws-5">
                Northwind
              </div>
            </Sidebar.Expanded>
          </Sidebar.Header>
          <Sidebar.Section scrollable>
            <Nav current={current} />
          </Sidebar.Section>
        </Sidebar>

        <AppShell.Main>
          <AppShell.TopBar>
            <AppShell.SidebarTrigger />
            <Breadcrumbs separator="arrow">
              <Breadcrumbs.Item>Projects</Breadcrumbs.Item>
            </Breadcrumbs>
          </AppShell.TopBar>
          <div className="gap-ws-12 px-ws-14 pt-ws-14 pb-ws-16 flex w-full flex-col">
            <header className="gap-ws-9 flex flex-wrap items-center justify-between">
              <h1 className="typography-title-md text-ws-static-strong">Projects</h1>
              <Button size="sm">New project</Button>
            </header>
            {children}
          </div>
        </AppShell.Main>
      </AppShell>
    </ToastProvider>
  );
}
```

## Variants

- **Direction.** `inset` (the default) for apps with navigation and several regions (a calendar,
  a document), `frame` for side-by-side panels (messages, mail), `flat` for simple, dense tools,
  `canvas` for pages made of separate modules (an overview, a wallet). One direction per app, on
  every screen, settings and empty states included. Ask the user before the first screen unless the
  prompt already says; without a way to ask, take `inset`.

- **Router links.** Wrap your router's link: `<Sidebar.Item asChild icon={…} label="Projects"
active={…}><Link to="/projects" /></Sidebar.Item>`. Icon and label are injected into the link.
- **Controlled collapse.** `collapsed` + `onCollapsedChange` on `Sidebar` when the state must
  persist (user setting) or follow the viewport; `defaultCollapsed` otherwise.
- **Nested pages.** The path goes in the top bar: `Breadcrumbs separator="arrow"` after
  `AppShell.SidebarTrigger`, the parents as links and the current page last. The `h1` stays in the
  page, under the bar.
- **No top bar.** A screen that opens with its own toolbar (a calendar, a board) leaves
  `AppShell.TopBar` out and keeps `Sidebar.Trigger` in `Sidebar.Header`, beside the product name.
- **Bar tools.** Small tools for the page (Share, an avatar group, a menu) go in
  `AppShell.TopBarActions`; the page's primary action stays beside the `h1`.
- **Page sections.** Inside `main`, group content in `Card`s on a `grid` (`grid
grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-ws-11`) or stack sections with `gap-ws-12`.
- **Page-level notice.** `SystemAlert` as the first child of the content column, above the
  header (see [page-feedback](page-feedback.md)).

## Rules

- One trigger per screen: `AppShell.SidebarTrigger` in the top bar, or `Sidebar.Trigger` in the
  sidebar's header when the screen has no bar. Both work the same `Sidebar`, whose
  `collapsed` / `onCollapsedChange` stay the place to keep the state.
- The top bar is the small text of the screen (12px crumbs); the title's size follows its room:
  `typography-title-md` for a whole page, `typography-title-sm` in a tight header or a narrow
  column. Do not put the `h1` in the bar.
- Write the navigation and the trigger once: one tree serves both modes and keeps focus across a
  toggle. `Sidebar.Expanded` / `Sidebar.Collapsed` wrap only what exists in one mode, as the
  product name does in the example.
- `AppShell.Main` is the only scroll container and already stops a wide table from pushing the
  layout out; do not add a second scrolling wrapper around the page.
- The direction lives on `AppShell` alone. Do not pass the sidebar a fill or a border through
  `className`, and do not give `AppShell.Main` its own background, radius or shadow.
- The page is white (in `inset`, a white card) and cards on it stay `Card` bordered on that
  white. Only `canvas` leaves the page grey: its content goes in white sections with no border.
- One active item, set by you from the current path.
- Keep the top level to about seven items; group the rest under `Sidebar.SectionHeader`s instead of nesting deeply.
- Hide pages the user will never reach. `disabled` is for something they could unlock.
- Wideset ships no router. Routing, data fetching, authentication and URL state belong to the app.
  In Next.js the shell is a client component; the layout that renders it can stay a Server
  Component.

## When a sidebar is wrong

| Product                                         | Shell                                                        |
| ----------------------------------------------- | ------------------------------------------------------------ |
| Two or three sections                           | Top [`Tabs`](../../good-practices/tabs.md) or a plain header |
| Marketing or docs                               | Your own header: `Sidebar` is app navigation                 |
| Focused single-task flow (checkout, onboarding) | No navigation; `ProgressStepper` and one column              |
| Editor or canvas                                | A toolbar, with panels that open on demand                   |
| Embedded widget                                 | No shell                                                     |

Do not add a sidebar to a one-page tool to make it look like an app. On small screens the shell
changes shape: see responsive.

## Accessibility

- Wrap the items in `<nav aria-label="…">`; `Sidebar` itself is a plain container, not a landmark.
- Exactly one `main` and one `h1` per page.
- `active` sets `aria-current="page"` on the current item.
- Collapsed, each item's `label` becomes its `aria-label`, so always pass `label`.
- `AppShell.SidebarTrigger` and `Sidebar.Trigger` announce Expand / Collapse and point at the
  sidebar with `aria-controls`; change the words with `expandLabel` / `collapseLabel`.

## Anti-patterns

- A hand-built bar (`h-ws-18 border-b` with an `IconButton` wired to your own `collapsed` state)
  instead of `AppShell.TopBar` and `AppShell.SidebarTrigger`.
- Wrapping the page in a `Card`, or the sidebar and page in one bordered box.
- Letting `body` scroll instead of `AppShell.Main`: the sidebar then scrolls away. Do not
  replace `AppShell`'s full height (`h-dvh`) with `min-h-screen`.
- Hand-writing a direction (`bg-ws-static-background` on a row, a rounded `main` with a shadow)
  instead of `<AppShell direction="inset">`.
- A grey page (`bg-ws-static-background`) on `AppShell.Main` beside the white sidebar: the work
  then looks like the background.
- A second `ToastProvider` per page: toasts then stack in two places.
- Building navigation from `Button`s or `ListItem`s; use `Sidebar.Item` (it renders an `<a>`).
- Plain Tailwind spacing (`p-6`, `gap-4`) or palette colours; use `p-ws-*`, `gap-ws-*`,
  `bg-ws-static-*`.

# App shell

> The frame every screen sits in: collapsible navigation on the left, the page on the right.

## Problem

An app needs persistent navigation, a scrolling content area, one place for page-level alerts
and one place where toasts appear. [`AppShell`](../components/layout/app-shell.md) is that frame:
a full-height row holding `Sidebar` and `AppShell.Main`. Its `direction` (`flat`, `frame` or
`inset`) sets the window background, the sidebar's surface and the page's look together, so
pick it once for the whole app and do not restyle them by hand.

## Structure

```
ToastProvider                       — once, around the whole app
└ AppShell direction="…"           — full-height row; the direction's background
  ├ Sidebar                         — navigation; owns collapsed state; surface from AppShell
  │ ├ Sidebar.Header                — product name + Sidebar.Trigger
  │ └ Sidebar.Section scrollable    — nav > Sidebar.Item, in Expanded and Collapsed
  └ AppShell.Main                   — <main>, the only scroll container for page content
    ├ SystemAlert                   — optional, page-level notice, first
    ├ header                        — Breadcrumbs (optional), h1, page actions
    └ page content                  — Cards, Table, forms …
```

## Example

```tsx
import { RiDashboardLine, RiFolder3Line, RiSettings3Line } from '@remixicon/react';
import { AppShell, Button, Sidebar, ToastProvider } from '@wideset/react';
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
              <div className="gap-ws-7 py-ws-3 pl-ws-5 flex items-center justify-between">
                <span className="typography-label-strong-sm text-ws-static-strong">Northwind</span>
                <Sidebar.Trigger />
              </div>
            </Sidebar.Expanded>
            <Sidebar.Collapsed>
              <div className="py-ws-3 flex items-center">
                <Sidebar.Trigger />
              </div>
            </Sidebar.Collapsed>
          </Sidebar.Header>
          <Sidebar.Section scrollable>
            <Sidebar.Expanded>
              <Nav current={current} />
            </Sidebar.Expanded>
            <Sidebar.Collapsed>
              <Nav current={current} />
            </Sidebar.Collapsed>
          </Sidebar.Section>
        </Sidebar>

        <AppShell.Main>
          <div className="gap-ws-12 p-ws-12 flex flex-col">
            <header className="gap-ws-9 flex flex-wrap items-center justify-between">
              <h1 className="typography-title-sm text-ws-static-strong">Projects</h1>
              <Button>New project</Button>
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

- **Direction.** `inset` for apps with a strong page edge and several regions (a calendar, a
  document), `frame` for side-by-side panels (messages, mail), `flat` (the default) for simple,
  dense tools. One direction per app, on every screen, settings and empty states included.

- **Router links.** Wrap your router's link: `<Sidebar.Item asChild icon={…} label="Projects"
active={…}><Link to="/projects" /></Sidebar.Item>`. Icon and label are injected into the link.
- **Controlled collapse.** `collapsed` + `onCollapsedChange` on `Sidebar` when the state must
  persist (user setting) or follow the viewport; `defaultCollapsed` otherwise.
- **Nested pages.** Put `Breadcrumbs` above the `h1` in the page header.
- **Page sections.** Inside `main`, group content in `Card`s on a `grid` (`grid
grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-ws-11`) or stack sections with `gap-ws-12`.
- **Page-level notice.** `SystemAlert` as the first child of the content column, above the
  header (see [page-feedback](page-feedback.md)).

## Rules

- A `Sidebar.Section` renders nothing in a mode where it has no matching `Sidebar.Expanded` or
  `Sidebar.Collapsed` child, so give it both, as the example does.
- `AppShell.Main` is the only scroll container and already stops a wide table from pushing the
  layout out; do not add a second scrolling wrapper around the page.
- The direction lives on `AppShell` alone. Do not pass the sidebar a fill or a border through
  `className`, and do not give `AppShell.Main` its own background, radius or shadow.
- One active item, set by you from the current path.
- Keep the top level to about seven items; group the rest in sections instead of nesting deeply.
- Hide pages the user will never reach. `disabled` is for something they could unlock.
- Wideset ships no router. Routing, data fetching, authentication and URL state belong to the app.
  In Next.js the shell is a client component; the layout that renders it can stay a Server
  Component.

## When a sidebar is wrong

| Product                                         | Shell                                                            |
| ----------------------------------------------- | ---------------------------------------------------------------- |
| Two or three sections                           | Top [`Tabs`](../components/navigation/tabs.md) or a plain header |
| Marketing or docs                               | Your own header: `Sidebar` is app navigation                     |
| Focused single-task flow (checkout, onboarding) | No navigation; `ProgressStepper` and one column                  |
| Editor or canvas                                | A toolbar, with panels that open on demand                       |
| Embedded widget                                 | No shell                                                         |

Do not add a sidebar to a one-page tool to make it look like an app. On small screens the shell
changes shape: see [responsive](../foundations/responsive.md).

## Accessibility

- Wrap the items in `<nav aria-label="…">`; `Sidebar` itself is a plain container, not a landmark.
- Exactly one `main` and one `h1` per page.
- `active` sets `aria-current="page"` on the current item.
- Collapsed, each item's `label` becomes its `aria-label`, so always pass `label`.
- `Sidebar.Trigger` announces Expand / Collapse and points at the sidebar with `aria-controls`;
  change the words with `expandLabel` / `collapseLabel`.

## Anti-patterns

- Wrapping the page in a `Card`, or the sidebar and page in one bordered box.
- Letting `body` scroll instead of `AppShell.Main`: the sidebar then scrolls away. Do not
  replace `AppShell`'s full height (`h-dvh`) with `min-h-screen`.
- Hand-writing a direction (`bg-ws-static-background` on a row, a rounded `main` with a shadow)
  instead of `<AppShell direction="inset">`.
- A second `ToastProvider` per page: toasts then stack in two places.
- Building navigation from `Button`s or `ListItem`s; use `Sidebar.Item` (it renders an `<a>`).
- Plain Tailwind spacing (`p-6`, `gap-4`) or palette colours; use `p-ws-*`, `gap-ws-*`,
  `bg-ws-static-*`.

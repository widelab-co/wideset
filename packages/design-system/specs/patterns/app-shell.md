# App shell

> The frame every screen sits in: collapsible navigation on the left, the page on the right.

## Problem

An app needs persistent navigation, a scrolling content area, one place for page-level alerts
and one place where toasts appear. The frame is plain markup: a full-height row holding `Sidebar`
and one `main`. The app's direction (`inset`, the default, `flat`, `frame` or `canvas`) gives the
row's ground, the `main`'s look and the sidebar's `surface`, with the exact classes in
[Visual directions](directions.md), which also says which to pick. Pick it once for the whole app.
The blocks write the frame this way. [`AppShell`](../components/layout/app-shell.md) renders the
same row and `main` from one `direction` prop, if you prefer it.

## Structure

```
ToastProvider                       — once, around the whole app
└ div.flex.h-dvh                    — full-height row; the direction's ground
  ├ Sidebar surface="…"             — navigation; owns collapsed state; the direction's surface
  │ ├ Sidebar.Header                — product name + Sidebar.Trigger
  │ └ Sidebar.Section scrollable    — nav > Sidebar.Item, one tree for both modes
  └ main                            — the only scroll container for page content
    ├ SystemAlert                   — optional, page-level notice, first
    ├ header                        — Breadcrumbs (optional), h1, page actions
    └ page content                  — Cards, Table, forms …
```

## Example

```tsx
import { RiDashboardLine, RiFolder3Line, RiSettings3Line } from '@remixicon/react';
import { Button, Sidebar, ToastProvider } from '@wideset/react';
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
      {/* Inset: the grey frame, the page a raised white card (directions.md). */}
      <div className="bg-ws-static-background flex h-dvh">
        <Sidebar surface="frame">
          <Sidebar.Header>
            <div className="gap-ws-7 py-ws-3 flex items-center">
              <Sidebar.Expanded>
                <span className="typography-label-strong-sm text-ws-static-strong pl-ws-5">
                  Northwind
                </span>
              </Sidebar.Expanded>
              <Sidebar.Trigger />
            </div>
          </Sidebar.Header>
          <Sidebar.Section scrollable>
            <Nav current={current} />
          </Sidebar.Section>
        </Sidebar>

        <main className="bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 relative flex min-w-0 flex-1 flex-col overflow-y-auto">
          <div className="gap-ws-12 p-ws-12 flex flex-col">
            <header className="gap-ws-9 flex flex-wrap items-center justify-between">
              <h1 className="typography-title-md text-ws-static-strong">Projects</h1>
              <Button size="sm">New project</Button>
            </header>
            {children}
          </div>
        </main>
      </div>
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
- **Nested pages.** Put `Breadcrumbs` above the `h1` in the page header.
- **Page sections.** Inside `main`, group content in `Card`s on a `grid` (`grid
grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-ws-11`) or stack sections with `gap-ws-12`.
- **Page-level notice.** `SystemAlert` as the first child of the content column, above the
  header (see [page-feedback](page-feedback.md)).

## Rules

- Write the navigation and the trigger once: one tree serves both modes and keeps focus across a
  toggle. `Sidebar.Expanded` / `Sidebar.Collapsed` wrap only what exists in one mode, as the
  product name does in the example.
- `main` is the only scroll container, and its `min-w-0` stops a wide table from pushing the
  layout out; do not add a second scrolling wrapper around the page.
- The direction lives in the surround and nowhere else: the row's ground, the `main`'s classes and
  the `Sidebar`'s `surface`, exactly as [Visual directions](directions.md) gives them. Do not pass
  the sidebar a fill or a border through `className`, and do not give `main` a background,
  radius or shadow its direction does not have.
- The page is white (in `inset`, a white card) and cards on it stay `Card` bordered on that
  white. Only `canvas` leaves the page grey: its content goes in white sections with no border.
- One active item, set by you from the current path.
- Keep the top level to about seven items; group the rest under `Sidebar.SectionHeader`s instead of nesting deeply.
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
- Letting `body` scroll instead of `main`: the sidebar then scrolls away. Do not replace the
  row's full height (`h-dvh`) with `min-h-screen`.
- A surround that belongs to no direction: a `main` with its own radius or margin, a shadow on a
  Flat page, a `Sidebar` whose `surface` does not match the row.
- A grey page (`bg-ws-static-background`) on `main` beside the white sidebar: the work then looks
  like the background.
- A second `ToastProvider` per page: toasts then stack in two places.
- Building navigation from `Button`s or `ListItem`s; use `Sidebar.Item` (it renders an `<a>`).
- Plain Tailwind spacing (`p-6`, `gap-4`) or palette colours; use `p-ws-*`, `gap-ws-*`,
  `bg-ws-static-*`.

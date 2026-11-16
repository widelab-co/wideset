---
name: AppShell
import: import { AppShell } from '@wideset/react'
group: layout
status: beta
parts: [AppShell, AppShellMain, AppShellTopBar, AppShellTopBarActions, AppShellSidebarTrigger]
related: [Sidebar, Breadcrumbs, Card, ToastProvider]
docs: https://wideset.co/components/app-shell
storybook: components-appshell--default
---

# AppShell

> The full-height frame every screen sits in: the navigation and the page, in the app's visual
> direction.

## When to use

- The root of every screen in an app with persistent navigation: `Sidebar` beside the page.
- To give the whole app one visual direction (`inset`, `flat`, `frame`, `canvas`) with one prop,
  instead of hand-written backgrounds, margins and shadows.

## When not to use

- Screens before the app (sign in, sign up) or a marketing page → your own layout, no `AppShell`.
- A framed section inside a page → `Card`.
- Record detail over the page → `Sidepanel`.

## Anatomy

```tsx
<AppShell direction="inset">
  <Sidebar>
    <Sidebar.Header>…</Sidebar.Header>
    <Sidebar.Section scrollable>…</Sidebar.Section>
  </Sidebar>
  <AppShell.Main>
    <AppShell.TopBar>
      <AppShell.SidebarTrigger />
      <Breadcrumbs separator="arrow">
        <Breadcrumbs.Item asChild>
          <a href="/workspace">Workspace</a>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>Projects</Breadcrumbs.Item>
      </Breadcrumbs>
      <AppShell.TopBarActions>…</AppShell.TopBarActions>
    </AppShell.TopBar>
    <div className="gap-ws-12 px-ws-14 pt-ws-14 pb-ws-16 flex w-full flex-col">
      <header className="gap-ws-2 flex flex-col">
        <h1 className="typography-title-md text-ws-static-strong">Projects</h1>
      </header>
      …
    </div>
  </AppShell.Main>
</AppShell>
```

`AppShell.Main` (`AppShellMain` in a Server Component) renders `<main>` and is the page's only
scroll container. Put your padding on a wrapper inside it. The full composition, with
`ToastProvider` and the nav, is in `patterns/app-shell.md`.

## The page's top bar

`AppShell.TopBar` is the slim bar across the top of the page, as the starting points draw it:
48px, edge to edge, a line under it, and it stays put while the page scrolls under it. It is the
first child of `AppShell.Main` and holds, in order:

| Part                      | What it is                                                                             |
| ------------------------- | -------------------------------------------------------------------------------------- |
| `AppShell.SidebarTrigger` | The button that collapses and expands the `Sidebar`; its glyph sits 20px from the edge |
| `Breadcrumbs`             | Where you are (`separator="arrow"`); one crumb on a top-level page                     |
| `AppShell.TopBarActions`  | The page's small tools at the far end: `sm` buttons and icon buttons, an avatar group  |

- The trigger works the `Sidebar` in the same shell from outside it. The `Sidebar` still owns the
  state: `defaultCollapsed`, or `collapsed` + `onCollapsedChange`, go on `Sidebar` as before. With
  the trigger in the bar, leave `Sidebar.Trigger` out of the sidebar's header.
- Text sizes. The bar is the small text of the screen: `Breadcrumbs` are 12px, and loose text in
  the bar (a status, "Edited 2 hours ago") takes the same 12px subtle style on its own. The page's
  title is not in the bar; it sits below, in the page, at the size its room asks for:
  `typography-title-md` (32px) for a whole page, `typography-title-sm` (24px) in a tight header,
  a record header or a narrow column.
- The line follows the direction: `inset` draws the base line on the raised page, `flat` and
  `frame` the subtle one, `canvas` none (the bar sits on the grey).
- Under the bar the page starts 32px in: `px-ws-14 pt-ws-14 pb-ws-16` on the content wrapper.
- Leave the bar out on a screen that opens with its own toolbar (a calendar, a board with its
  header): keep `Sidebar.Trigger` in the sidebar there.
- It is not the app's navigation. An app with a top bar _instead of_ a `Sidebar` (see below) puts
  its brand, links and account in its own `header`.

## Choosing props

| Prop        | Value    | Use for                                                                                            |
| ----------- | -------- | -------------------------------------------------------------------------------------------------- |
| `direction` | `inset`  | Default. Apps with navigation and several regions (a calendar, a document): the page a raised card |
| `direction` | `flat`   | Simple, dense tools (tables, boards, editors): one white surface, a line splits sidebar and page   |
| `direction` | `frame`  | Apps with side-by-side panels (messages, mail): the sidebar on a grey tint, the page full-bleed    |
| `direction` | `canvas` | Pages made of separate modules (an overview, a wallet): a grey page, the content in white sections |

A `Sidebar` inside `AppShell` takes the matching surface on its own: the bare grey frame with its
nav centred in the column (inset, canvas), white with a line (flat), grey tint (frame). Pass
nothing to it. Choose by the product, not by taste, and keep one direction for every screen of the
app. Ask the user which direction they want before the first screen, unless the prompt already
says; without a way to ask, take `inset`.

With a top bar instead of a `Sidebar`, the bar is the first child of `AppShell.Main` and scrolls
with the page. In `canvas` it has no fill and no line: it sits on the grey, and the white sections
below are `bg-ws-static-foreground rounded-ws-container-md`, with no border and no shadow.

## Accessibility

- `AppShell.Main` is the page's `main` landmark: one per page, with one `h1` inside.
- `AppShell.TopBar` is a `header` inside `main`, so it is not a second banner. `Breadcrumbs` in it
  is a `nav` landmark of its own.
- `AppShell.SidebarTrigger` is a button named by what it will do ("Collapse sidebar" /
  "Expand sidebar"; change the words with `collapseLabel` / `expandLabel`), with `aria-expanded`
  and `aria-controls` pointing at the `Sidebar`.
- Wrap the sidebar's items in `<nav aria-label="…">`; neither `AppShell` nor `Sidebar` is a
  landmark.

## Do / Don't

```tsx
// Do
<AppShell direction="frame">
  <Sidebar>…</Sidebar>
  <AppShell.Main>…</AppShell.Main>
</AppShell>
```

```tsx
// Don't: a direction written by hand drifts from Figma and from the other screens
<div className="bg-ws-static-background flex h-dvh">
  <Sidebar className="bg-transparent">…</Sidebar>
  <main className="rounded-ws-container-lg shadow-ws-low m-ws-7 flex-1">…</main>
</div>
```

- Don't give `AppShell.Main` a background, radius, shadow or margin: the direction owns them.
- Don't pick a direction per screen; users notice before they can say why.
- Don't nest a second scroll container around the page content.

## Gotchas

- `AppShell` fills the window (`h-dvh`). Inside a bounded preview, pass a height through
  `className` (`h-[24rem]`).
- `AppShell.Main`, `AppShell.TopBar` and `AppShell.SidebarTrigger` throw outside an `AppShell`.
- `AppShell.SidebarTrigger` needs a `Sidebar` in the same `AppShell`; without one it does nothing.
- `AppShell.TopBar` sticks to the top of `AppShell.Main`. When the content under it scrolls by
  itself (`min-h-0 flex-1` with its own overflow), the bar simply stays above it.
- On narrow screens the trigger still collapses the `Sidebar` to its rail; `Sidebar` has no drawer
  mode (see `foundations/responsive.md`).
- In `inset` the page scrolls inside the card, so its corners stay put; a calendar or board that
  manages its own scroll fills it with `min-h-0 flex-1`.
- `canvas` leaves the page grey. Put the content in white sections; a bordered `Card` on the grey
  belongs to no direction.

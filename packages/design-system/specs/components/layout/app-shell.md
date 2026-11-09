---
name: AppShell
import: import { AppShell } from '@wideset/react'
group: layout
status: beta
parts: [AppShell, AppShellMain]
related: [Sidebar, Card, ToastProvider]
docs: https://wideset-docs.widelab.workers.dev/components/app-shell
storybook: components-appshell--default
---

# AppShell

> The full-height frame every screen sits in: the navigation and the page, in the app's visual
> direction.

## When to use

- The root of every screen in an app with persistent navigation: `Sidebar` beside the page.
- To give the whole app one visual direction (`flat`, `frame`, `inset`) with one prop, instead of
  hand-written backgrounds, margins and shadows.

## When not to use

- Screens before the app (sign in, sign up) or a marketing page → your own layout, no `AppShell`
  (see `patterns/directions.md`).
- A framed section inside a page → `Card`.
- A top bar instead of a sidebar → your own `header` above the page; `AppShell` is built for a
  `Sidebar` on the left.
- Record detail over the page → `Sidepanel`.

## Anatomy

```tsx
<AppShell direction="inset">
  <Sidebar>
    <Sidebar.Header>…</Sidebar.Header>
    <Sidebar.Section scrollable>…</Sidebar.Section>
  </Sidebar>
  <AppShell.Main>
    <div className="gap-ws-12 p-ws-12 flex flex-col">
      <header className="gap-ws-9 flex items-center justify-between">
        <h1 className="typography-title-sm text-ws-static-strong">Projects</h1>
      </header>
      …
    </div>
  </AppShell.Main>
</AppShell>
```

`AppShell.Main` (`AppShellMain` in a Server Component) renders `<main>` and is the page's only
scroll container. Put your padding on a wrapper inside it. The full composition, with
`ToastProvider` and the nav, is in `patterns/app-shell.md`.

## Choosing props

| Prop        | Value   | Use for                                                                                               |
| ----------- | ------- | ----------------------------------------------------------------------------------------------------- |
| `direction` | `flat`  | Default. Simple, dense tools (tables, boards, editors): one white surface, a line splits sidebar/page |
| `direction` | `frame` | Apps with side-by-side panels (messages, mail): the sidebar on a grey tint, the page full-bleed       |
| `direction` | `inset` | Apps with a strong page edge and several regions (a calendar, a document): the page a raised card     |

A `Sidebar` inside `AppShell` takes the matching surface on its own: white with a line (flat),
grey tint (frame), the bare grey frame with its nav centred in the column (inset). Pass nothing to
it. Choose by the product, not by taste, and keep one direction for every screen of the app.

## Accessibility

- `AppShell.Main` is the page's `main` landmark: one per page, with one `h1` inside.
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
- `AppShell.Main` throws outside an `AppShell`.
- In `inset` the page scrolls inside the card, so its corners stay put; a calendar or board that
  manages its own scroll fills it with `min-h-0 flex-1`.

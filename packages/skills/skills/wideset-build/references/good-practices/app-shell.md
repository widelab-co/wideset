# AppShell

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

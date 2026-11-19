# AppShell

## When to use

- Optional: the root of a screen with persistent navigation, when you want the app's visual
  direction (`inset`, `flat`, `frame`, `canvas`) from one prop. It renders the same row and `main`
  that [Visual directions](../specs/patterns/directions.md) gives as plain markup, and sets the
  `Sidebar`'s surface. The blocks write that markup instead; either is right, as long as every
  screen uses the same direction.

## When not to use

- Screens before the app (sign in, sign up) or a marketing page → your own layout, no `AppShell`.
- A framed section inside a page → `Card`.
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
// Don't: a surround in no direction's classes drifts from Figma and from the other screens
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
- `canvas` leaves the page grey. Put the content in white sections; a bordered `Card` on the grey
  belongs to no direction.

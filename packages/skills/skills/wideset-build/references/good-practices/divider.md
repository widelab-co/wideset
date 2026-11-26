# Divider

## When to use

- Between sections of a form or a page that have no frame of their own.
- "or" between two alternative actions (sign in with email / with SSO).
- A quiet label over a group of fields (`text` + `textAlign="left"`).

## When not to use

- Between card header, content and footer → `Card` with `divider`.
- Under a `Sidepanel` header or above its footer → their `divider` prop.
- Between table rows → `Table` draws row lines; `separated` adds column lines.
- Between accordion sections → `Accordion` draws them.
- A vertical separator (toolbar, inline items) → not supported; use spacing (`gap-ws-*`) or a
  border class on the container (`border-l border-ws-static-base`).
- As the only heading of a section → a real heading element; the label inside a separator may
  be skipped by screen readers.

## Do / Don't

```tsx
// Do: spacing around the divider comes from the parent layout
<div className="gap-ws-11 flex flex-col">
  <FormField …>…</FormField>
  <Divider text="Optional" textAlign="left" lineStyle="dashed" />
  <FormField …>…</FormField>
</div>

// Don't: Divider as the section heading
<Divider text="Payment details" textAlign="left" />   // add an <h2> instead, or as well
```

- Don't stack a Divider against a bordered `Card` edge; the border already separates.

## Gotchas

- Horizontal only; there is no `orientation` prop.
- The prop is `lineStyle`, not `variant` or `style`; `weight` values are `thin` / `default` /
  `bold`, not sizes.
- Divider has no margin; space it with the parent's `gap-ws-*`.
- It spans the width of its container.

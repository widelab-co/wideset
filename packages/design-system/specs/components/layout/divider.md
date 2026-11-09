---
name: Divider
import: import { Divider } from '@wideset/react'
group: layout
status: stable
parts: [Divider]
related: [Card, Accordion, Table]
docs: https://wideset-docs.widelab.workers.dev/components/divider
storybook: components-divider--default
---

# Divider

> A horizontal line that separates two blocks of content, optionally with a short label.

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

## Anatomy

```tsx
<Divider />
<Divider text="or" />
<Divider text="Billing" textAlign="left" />
```

A single element; no parts.

## Choosing props

| Prop        | Value                                 | Use for                                                                        |
| ----------- | ------------------------------------- | ------------------------------------------------------------------------------ |
| `weight`    | `default` (default)                   | Most section breaks.                                                           |
|             | `thin`                                | Separators inside a section, between list rows.                                |
|             | `bold`                                | A major break, such as the end of a form's main part.                          |
| `emphasis`  | `base` (default)                      | Most lines.                                                                    |
|             | `subtle`                              | Lines that organise without being noticed.                                     |
|             | `strong`                              | A break the user must not miss.                                                |
| `lineStyle` | `solid` (default) / `dashed`          | Dashed suggests the parts still belong together (optional fields).             |
| `text`      | `string`                              | A one- or two-word label in the line.                                          |
| `textAlign` | `center` (default) / `left` / `right` | Centre joins alternatives; left titles what follows; right is a trailing note. |

Use the lightest `weight` and `emphasis` that does the job.

## Content

- `text` is one or two words, sentence case ("or", "Billing", "Optional"). Long text is cut with
  an ellipsis, never wrapped.

## Accessibility

- Renders `role="separator"`. Screen readers may skip it and its text, so never put information
  only in the divider label.
- Decorative lines between visually grouped content need nothing more.

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

## API

Full props: `https://wideset-docs.widelab.workers.dev/components/divider.md` · Types:
`packages/design-system/src/components/divider/Divider.types.ts`

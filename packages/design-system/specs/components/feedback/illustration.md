---
name: Illustration
import: import { Illustration } from '@wideset/react'
group: feedback
status: stable
parts: [Illustration]
related: [Button, InlineAlert]
docs: https://wideset-docs.widelab.workers.dev/components/illustration
storybook: components-illustration--default
---

# Illustration

> A line drawing that gives an empty state, a first run or an announcement something to look at.

## When to use

- An empty state the user can fix: nothing scheduled yet (calendar), no files yet (folder).
- A first-run or onboarding screen, before there is any content.
- An announcement card about something new (computer), next to its title and one action.

## When not to use

- Inside a data view that has content: a table, a board or a form never carries a drawing.
- To explain an error or a state the user must act on → `InlineAlert` or `SystemAlert`.
- As an icon in a control or a row → a Remix icon.
- Decoration for its own sake: an empty state without a drawing is better than one with a
  drawing that says nothing.

## Anatomy

```tsx
<Illustration illustration="folder" size="sm" />
```

One `svg`: lines in the text colour (`text-ws-static-strong`, so dark mode follows), one accent
in the primary fill (so a rebrand follows). Each size is its own drawing.

## Choosing props

| Prop           | Value                                 | Use for                                                        |
| -------------- | ------------------------------------- | -------------------------------------------------------------- |
| `illustration` | `calendar`, `computer`, `folder`      | Pick the one that names what is missing or new.                |
| `size`         | `lg` (240px, default) or `sm` (140px) | `lg` for a whole empty page; `sm` in a card, panel or popover. |
| `title`        | string                                | Only when the drawing says something the text does not.        |

## Content

- Pair it with a short heading, one sentence and one action, centred under it (the empty-state
  scaffold in `wideset-craft`).
- One illustration per view.

## Accessibility

- Decorative by default: `aria-hidden`, so a screen reader reads only the text beside it.
- With `title` it becomes `role="img"` named by its title.

## Do / Don't

```tsx
// Do: an empty state with the drawing, a heading, one sentence and one action
<div className="gap-ws-9 flex flex-col items-center text-center">
  <Illustration illustration="folder" size="sm" />
  <h2 className="typography-subtitle-xs text-ws-static-strong">No files yet</h2>
  <p className="typography-body-md text-ws-static-subtle">Files you upload appear here.</p>
  <Button>Upload a file</Button>
</div>

// Don't: scale a size into the other; its lines get too thin or too heavy
<Illustration illustration="folder" size="sm" className="size-[15rem]" />
```

## Gotchas

- `className` may change the colour of the lines (`text-ws-static-base`) and the layout, never
  the size: pick `size` instead.

## API

Full props: `https://wideset-docs.widelab.workers.dev/components/illustration.md` · Types:
`packages/design-system/src/components/illustration/Illustration.types.ts`

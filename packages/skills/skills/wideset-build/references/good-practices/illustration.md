# Illustration

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

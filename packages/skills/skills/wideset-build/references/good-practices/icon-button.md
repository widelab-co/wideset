# IconButton

## When to use

- Compact toolbars, table rows, card corners, utility controls (Settings, More, Close, Refresh).
- Many actions side by side that should stay quiet until hovered.

## When not to use

- The action needs a visible label to be understood → `Button`.
- Text-style navigation to another page → `LinkButton`.
- A default action plus a menu → `SplitButton`.

## Do / Don't

```tsx
// Do: quiet, labelled toolbar actions
<IconButton preset="ghost" variant="secondary" icon={RiEditLine} aria-label="Edit" />

// Don't: no accessible name
<IconButton icon={RiEditLine} />

// Don't: icon as a child
<IconButton aria-label="Edit"><RiEditLine /></IconButton>
```

## Gotchas

- `type` defaults to `button`; set `submit` explicitly inside forms.
- Default is `filled` + `primary`. Toolbars almost always want `preset="ghost"` and
  `variant="secondary"`.

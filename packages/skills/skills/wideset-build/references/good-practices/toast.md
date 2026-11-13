# Toast

## When to use

- Confirmations and results of an action: "Invoice #1042 sent", "Profile updated" with Undo.
- Errors from a background task that should not interrupt the current work, with Retry.
- A running task the user can leave alone (`expanded` with a progress bar).

## When not to use

- Feedback that belongs to one section and must stay → `InlineAlert`.
- A product-wide condition at the top of the page → `SystemAlert`.
- The user must respond before continuing → `Modal`.

## Do / Don't

```tsx
// Do: wire the action
showToast({
  content: 'Message archived',
  action: <Toast.Action onClick={undo}>Undo</Toast.Action>,
});

// Don't: a string action has no click handler
showToast({ content: 'Message archived', action: 'Undo' });

// Don't: description on a basic toast (not rendered)
<Toast>
  <Toast.Message>Saved</Toast.Message>
  <Toast.Description>…</Toast.Description>
</Toast>;
```

## Gotchas

- `useToast()` throws outside `ToastProvider`.
- `Toast.Description`, `footer` and `progress` render only in `variant="expanded"`.
- A basic toast shows only the first `Toast.Action` (a console warning flags the rest); an
  expanded toast shows every action in its actions row.
- `Toast.Action` defaults to `variant="inverse"` for the dark basic toast. On an expanded toast
  (light surface) set `variant="secondary"` yourself. `Toast.IconAction` adapts by itself.
- `showToast` wraps a string `content` in `Toast.Message` and a string `action` in
  `Toast.Action` without `onClick`.
- Status names are `neutral / info / success / error`; there is no `warning`.

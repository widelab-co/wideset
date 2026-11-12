---
name: Toast
import: import { Toast, ToastProvider, useToast } from '@wideset/react'
group: feedback
status: stable
parts: [Toast, ToastMessage, ToastDescription, ToastAction, ToastIconAction]
related: [InlineAlert, SystemAlert, Modal]
docs: https://wideset.co/components/toast
storybook: components-toast--default
---

# Toast

> Brief, non-blocking feedback about something the user just did or the system just finished.

## When to use

- Confirmations and results of an action: "Invoice #1042 sent", "Profile updated" with Undo.
- Errors from a background task that should not interrupt the current work, with Retry.
- A running task the user can leave alone (`expanded` with a progress bar).

## When not to use

- Feedback that belongs to one section and must stay → `InlineAlert`.
- A product-wide condition at the top of the page → `SystemAlert`.
- The user must respond before continuing → `Modal`.

## Anatomy

In an app, show toasts imperatively. Mount the provider once, high in the tree:

```tsx
<ToastProvider position="bottom-right">{app}</ToastProvider>;

const { showToast, dismissToast } = useToast();
const id = showToast({
  content: 'Settings saved',
  status: 'success',
  action: <Toast.Action onClick={undo}>Undo</Toast.Action>,
});
```

The provider stacks the toasts, adds the dismiss button and closes each one after `duration`.
Render `Toast` directly only for static previews or your own container:

```tsx
<Toast
  status="info"
  variant="expanded"
  progress={64}
  footer="Closes in 5 seconds"
  onDismiss={close}
>
  <Toast.Message>Import is still running</Toast.Message>
  <Toast.Description>You can keep working while files are processed.</Toast.Description>
  <Toast.IconAction icon={RiMoreLine} aria-label="More options" /> {/* optional, before the X */}
  <Toast.Action variant="secondary">View details</Toast.Action>
</Toast>
```

## Choosing props

| Prop / option         | Value                                         | Use for                                              |
| --------------------- | --------------------------------------------- | ---------------------------------------------------- |
| `status`              | `neutral` (default)                           | General updates; no icon.                            |
|                       | `info`                                        | Something new from the system.                       |
|                       | `success`                                     | A finished action.                                   |
|                       | `error`                                       | What failed, with a retry.                           |
| `variant`             | `basic` (default)                             | One line and an optional action.                     |
|                       | `expanded`                                    | A sentence of description, a footer, a progress bar. |
| `duration`            | ms, `5000` default (`showToast`)              | Auto-close time. `0` keeps it until dismissed.       |
| `footer`              | node or `(remainingMs) => node`               | Expanded only. Countdown or extra context.           |
| `position` (provider) | `bottom-right` (default), `top-*`, `bottom-*` | Screen corner or edge for the stack.                 |

## States

- Through `showToast`: auto-dismisses after `duration`; an expanded toast with a `duration`
  shows a progress bar that fills until it closes. `dismissToast(id)` closes one early.
- Rendered directly: the dismiss button appears only with `onDismiss`, and nothing closes it
  for you.

## Content

- Message: what happened, short, sentence case. Description (expanded): one sentence more.
- One action, a verb: "Undo", "Retry", "Open".
- Never rely on colour alone; the message says what happened.

## Accessibility

- `error` renders `role="alert"` (announced at once); other statuses render `role="status"`.
- Icon actions need `aria-label`. `dismissAriaLabel` and `progressAriaLabel` name the dismiss
  button and progress bar.

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
- `Toast.Action` defaults to `variant="inverse"` for the dark basic toast. On an expanded toast
  (light surface) set `variant="secondary"` yourself. `Toast.IconAction` adapts by itself.
- `showToast` wraps a string `content` in `Toast.Message` and a string `action` in
  `Toast.Action` without `onClick`.
- Status names are `neutral / info / success / error`; there is no `warning`.

## API

Full props: `https://wideset.co/components/toast.md` · Types:
`packages/design-system/src/components/toast/Toast.types.ts`

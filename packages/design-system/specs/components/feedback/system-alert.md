---
name: SystemAlert
import: import { SystemAlert } from '@wideset/react'
group: feedback
status: stable
parts: [SystemAlert, SystemAlertMessage, SystemAlertAction]
related: [InlineAlert, Toast]
docs: https://wideset.co/components/system-alert
storybook: components-systemalert--default
---

# SystemAlert

> A full-width banner that speaks for the whole product, at the top of the page.

## When to use

- Product- or account-wide conditions: the workspace is back online, a payment failed,
  maintenance tonight, a new version is ready, you are viewing a shared copy.
- It sits at the top of the page, above everything else.

## When not to use

- Feedback about one section or form → `InlineAlert`.
- A short reaction to something the user just did → `Toast`.

## Anatomy

```tsx
<SystemAlert status="negative" emphasis="high" message="Payment failed for your plan">
  <SystemAlert.Action onClick={openBilling}>Update card</SystemAlert.Action>
</SystemAlert>

// With custom message markup
<SystemAlert status="info">
  <SystemAlert.Message>
    A new version is ready. <strong>Reload</strong> to update.
  </SystemAlert.Message>
  <SystemAlert.Action>Reload</SystemAlert.Action>
</SystemAlert>
```

`SystemAlert.Action` is a `Button` that defaults to `preset="border"` and `size="xs"`; its
`variant` follows the alert unless you set one.

## Choosing props

| Prop                      | Value                | Use for                                             |
| ------------------------- | -------------------- | --------------------------------------------------- |
| `status`                  | `positive` (default) | Something recovered or completed.                   |
|                           | `negative`           | Something failed and needs action.                  |
|                           | `notice`             | Something to plan around (maintenance).             |
|                           | `info`               | News (a new version).                               |
|                           | `neutral`            | Context with no tone (shared copy); no icon.        |
| `emphasis`                | `low` (default)      | News the user can read later.                       |
|                           | `high`               | A problem that blocks work. Keep it rare.           |
| `dismissible`             | `true` (default)     | Shows the dismiss button; `false` removes it.       |
| `dismissed` + `onDismiss` | controlled           | Keep dismissal in your state (e.g. across reloads). |

## States

- Dismissible by default; uncontrolled, it hides itself on dismiss. Controlled, it hides when
  `dismissed` is `true`.
- On `emphasis="high"`, actions and the dismiss button switch to the on-colour style by themselves,
  except on `notice`.

## Content

- One short sentence: "Payment failed for your plan". Long messages wrap, but keep them concise.
- Action labels are verbs: "Update card", "View status".

## Accessibility

- `negative` renders `role="alert"` (read at once); every other status renders `role="status"`.
- The icon is decorative; the message carries the meaning.
- `dismissAriaLabel` names the dismiss button (default `'Dismiss'`).

## Do / Don't

```tsx
// Do: let the action pick its colour from the alert
<SystemAlert status="negative" emphasis="high" message="Payment failed for your plan">
  <SystemAlert.Action>Update card</SystemAlert.Action>
</SystemAlert>

// Don't: force a variant on a high alert (loses the on-colour styling)
<SystemAlert.Action variant="primary">Update card</SystemAlert.Action>

// Don't: InlineAlert status names
<SystemAlert status="error" />   // → status="negative"
```

## Gotchas

- Status names differ from InlineAlert and Toast: `negative / notice / positive / info / neutral`.
- The default status is `positive`; always set `status` explicitly.
- Any child that is not `SystemAlert.Message` is rendered as an action.
- `SystemAlert.Message` takes only `children`; it overrides the `message` prop.
- `SystemAlert.Action` throws outside a `SystemAlert`.
- Dismissal is `dismissible={false}` here, `persistent` on InlineAlert.

## API

Full props: `https://wideset.co/components/system-alert.md` · Types:
`packages/design-system/src/components/system-alert/SystemAlert.types.ts`

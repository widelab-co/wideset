---
name: InlineAlert
import: import { InlineAlert, useInlineAlert } from '@wideset/react'
group: feedback
status: stable
parts: [InlineAlert, InlineAlertTitle, InlineAlertMessage, InlineAlertAction, InlineAlertOutlet]
related: [SystemAlert, Toast, StatusModal]
docs: https://wideset.co/components/inline-alert
storybook: components-inlinealert--default
---

# InlineAlert

> Feedback that stays attached to the section or workflow it is about.

## When to use

- Something in this part of the page needs fixing, attention or acknowledgement: a declined
  card in the billing section, a warning before a risky step in a form.
- The message should remain visible while the user works in that section.

## When not to use

- Brief feedback on an action that floats above the page and goes away → `Toast`.
- A message for the whole product, above everything (outage, failed payment) → `SystemAlert`.
- The user must respond before continuing → `StatusModal` or `Modal`.
- An error on one field → `errorText` on its `FormField`.

## Anatomy

```tsx
<InlineAlert status="warning" orientation="horizontal">
  <InlineAlert.Title>Review before publishing</InlineAlert.Title>     {/* optional */}
  <InlineAlert.Message>This update affects 12 records.</InlineAlert.Message>
  <InlineAlert.Action onClick={review}>Review</InlineAlert.Action>    {/* optional, repeatable */}
</InlineAlert>

// Same, with props
<InlineAlert status="warning" title="Review before publishing" message="This update affects 12 records.">
  <InlineAlert.Action onClick={review}>Review</InlineAlert.Action>
</InlineAlert>
```

Imperative, when a feature raises alerts without rendering them:

```tsx fragment
const { ref, showInlineAlert, dismissInlineAlert, dismissAllInlineAlerts } = useInlineAlert();

<InlineAlert.Outlet ref={ref} />   {/* where the alerts appear */}

showInlineAlert({ status: 'error', title: 'Publishing failed', message: '…',
  action: <InlineAlert.Action>Retry</InlineAlert.Action> });   // returns the id
```

## Choosing props

| Prop                      | Value                  | Use for                                                        |
| ------------------------- | ---------------------- | -------------------------------------------------------------- |
| `status`                  | `info` (default)       | Neutral guidance.                                              |
|                           | `success`              | Confirm a finished task.                                       |
|                           | `warning`              | Before a risky step.                                           |
|                           | `error`                | Something must be fixed.                                       |
| `orientation`             | `horizontal` (default) | Short message and one action in a wide section.                |
|                           | `vertical`             | Long copy, several actions, or a narrow column (side panel).   |
| `persistent`              | `true`                 | No dismiss button; the condition still holds (failed payment). |
| `dismissed` + `onDismiss` | controlled             | Dismissal must survive a reload or live in your state.         |
| `alertId` / `messageId`   | string                 | Uncontrolled: a new id brings a dismissed alert back.          |

`InlineAlert.Action` is a `Button` that defaults to `preset="border"`, `variant="secondary"`,
`size="sm"` and takes the alert's text colour; override any Button prop.

## States

- Dismissible by default. Uncontrolled, it hides itself and stays hidden until `alertId` or
  `messageId` changes. Controlled, it hides when `dismissed` is `true`.

## Content

- Title: what happened, a few words. Message: what it means and what to do, one or two
  sentences.
- Action labels are verbs: "Retry", "Review", "Update card".
- Place the alert next to the section it is about, not at the top of the page.

## Accessibility

- `error` renders `role="alert"` (read at once); the other statuses render `role="status"`
  (read when idle).
- The icon is decorative; the text must carry the meaning, not the colour.
- `dismissAriaLabel` names the close button (default `'Dismiss'`).

## Do / Don't

```tsx
// Do: persistent while the problem exists
<InlineAlert status="error" persistent message="Your card was declined.">
  <InlineAlert.Action>Update card</InlineAlert.Action>
</InlineAlert>

// Don't: a page-wide outage inside a form section → SystemAlert
// Don't: "Saved!" after a click → Toast
```

## Gotchas

- Any child that is not `InlineAlert.Title` or `InlineAlert.Message` is rendered as an action.
  Plain text children land in the action area, not the message.
- `InlineAlert.Title` and `InlineAlert.Message` take only `children` (no `className`); a slot
  overrides the matching `title` / `message` prop.
- `InlineAlert.Outlet` renders nothing until an alert is shown. Alerts shown through it are always
  dismissible.
- The outlet's `ref` comes from `useInlineAlert()`; the show functions do nothing before the
  outlet mounts.
- Status names are `error / warning / success / info`, not SystemAlert's
  `negative / notice / positive`.

## API

Full props: `https://wideset.co/components/inline-alert.md` · Types:
`packages/design-system/src/components/inline-alert/InlineAlert.types.ts`

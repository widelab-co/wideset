---
name: StatusModal
import: import { StatusModal } from '@wideset/react'
group: overlays
status: stable
parts:
  [
    StatusModal,
    StatusModalTrigger,
    StatusModalContent,
    StatusModalTitle,
    StatusModalBody,
    StatusModalFooter,
    StatusModalClose,
    StatusModalOverlay,
  ]
related: [Modal, InlineAlert, Toast, SystemAlert]
docs: https://wideset.co/components/status-modal
storybook: components-modal-statusmodal--default
---

# StatusModal

> A blocking dialog whose message is a status: success, warning, information or failure.

## When to use

- An outcome the user must acknowledge before going on (payment succeeded, import failed).
- A warning before it is too late (session expiring), or a destructive confirmation that
  deserves a strong signal.

## When not to use

- A dialog with a form, a list or several sections → `Modal`.
- Feedback that can stay in the page next to its cause → `InlineAlert`.
- A passing confirmation that should not block the user → `Toast`.
- A product-wide notice (maintenance, outage) → `SystemAlert`.

## Anatomy

```tsx
<StatusModal status="error">
  <StatusModal.Trigger asChild>
    <Button>Save</Button>
  </StatusModal.Trigger>
  <StatusModal.Content>
    <StatusModal.Title>Failed to save</StatusModal.Title> {/* icon added for you */}
    <StatusModal.Body>
      Your changes could not be saved. Check your connection and try again.
    </StatusModal.Body>
    <StatusModal.Footer>
      <StatusModal.Close asChild>
        <Button size="sm" variant="secondary" preset="border">
          Cancel
        </Button>
      </StatusModal.Close>
      <Button size="sm" onClick={retry}>
        Retry
      </Button>
    </StatusModal.Footer>
  </StatusModal.Content>
</StatusModal>
```

`StatusModal.Content` portals itself, draws the overlay and the close (X) button, and traps focus.
There is no Header part: the Title carries the status icon.

## Choosing props

Set these once on `StatusModal`; every part reads them. `Content` (and `Title`, `Body`, `Footer`
for `orientation`) can override, but rarely should.

| Prop              | Value                    | Use for                                                            |
| ----------------- | ------------------------ | ------------------------------------------------------------------ |
| `status`          | `neutral` (default)      | An ordinary confirmation; no icon.                                 |
|                   | `positive`               | Something finished successfully.                                   |
|                   | `notice`                 | A warning before it is too late.                                   |
|                   | `information`            | Something new to know.                                             |
|                   | `error`                  | What failed and how to retry.                                      |
| `orientation`     | `horizontal` (default)   | Compact: left-aligned text, actions right-aligned under a divider. |
|                   | `vertical`               | Centred icon, text and actions for a moment with more weight.      |
| `showCloseButton` | default `true`           | Hide the X only when the footer has a clear way out.               |
| `persistent`      | on `StatusModal.Content` | Ignore outside clicks and Escape.                                  |
| `closeAriaLabel`  | on `StatusModal.Content` | Translate the X's label (default "Close status modal").            |

State: `open` + `onOpenChange` (controlled) or `defaultOpen`, on `StatusModal` (Radix Dialog).

## Content

- Title states the outcome in plain words ("Payment successful", "Failed to save").
- Body: one or two sentences; for errors, what to do next.
- Primary button names the next action ("Retry", "Get started"), not "OK".

## Accessibility

- The status icon is hidden from screen readers; the title must carry the meaning on its own.
- `StatusModal.Title` is the dialog's name and `StatusModal.Body` its description; render both.
- With `persistent`, keep a visible way out.

## Do / Don't

- Do pick the status by meaning, not by colour preference.
- Do use `vertical` sparingly, for moments that deserve weight.
- Don't put inputs or long content in it → `Modal`.
- Don't use `error` for a destructive confirmation; that is `neutral` (or `notice` if the user
  could lose work).

## Gotchas

- Passing your own `onEscapeKeyDown`, `onPointerDownOutside` or `onOpenAutoFocus` to
  `StatusModal.Content` replaces the built-in handlers, so `persistent` and `autoFocusOnOpen`
  stop working. Call `event.preventDefault()` yourself if you need both.
- There is no `StatusModal.Icon` or `StatusModal.Description`; the icon comes from `status`, the
  description is `StatusModal.Body`.
- `StatusModal.Close` is unstyled (Radix pass-through): always use it with `asChild` and a
  `Button`.

## API

Full props: `https://wideset.co/components/status-modal.md` · Types:
`packages/design-system/src/components/status-modal/StatusModal.types.ts`

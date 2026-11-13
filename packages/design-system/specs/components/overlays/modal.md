---
name: Modal
import: import { Modal } from '@wideset/react'
group: overlays
status: stable
parts:
  [
    Modal,
    ModalTrigger,
    ModalContent,
    ModalHeader,
    ModalTitle,
    ModalDescription,
    ModalBody,
    ModalFooter,
    ModalClose,
    ModalOverlay,
  ]
related: [StatusModal, Sidepanel, Popup]
docs: https://wideset.co/components/modal
storybook: components-modal-modal--default
---

# Modal

> Interrupt the page for a focused task or decision that must be finished or dismissed first.

## When to use

- Confirming a consequential action (archive, discard changes).
- A short form or detail view that only makes sense on its own (rename, invite people).

## When not to use

- The message is a status (success, warning, error) that needs a strong signal → `StatusModal`.
- Editing or reading detail next to the list it came from, or long forms → `Sidepanel`.
- Light content or a quick choice anchored to a button → `Popup`.
- A list of actions → `DropdownMenu`.
- Feedback that should not block the page → `Toast` or `InlineAlert`.

## Anatomy

```tsx
<Modal>
  <Modal.Trigger asChild>
    <Button variant="secondary" preset="border">
      Archive project
    </Button>
  </Modal.Trigger>
  <Modal.Content>
    <Modal.Header>
      <Modal.Title>Archive “Website redesign”?</Modal.Title>
      <Modal.Description>Your team will lose edit access.</Modal.Description>
    </Modal.Header>
    <Modal.Body>Archived projects are read-only…</Modal.Body>
    <Modal.Footer>
      <Modal.Close asChild>
        <Button variant="secondary" preset="border">
          Cancel
        </Button>
      </Modal.Close>
      <Button onClick={archive}>Archive</Button>
    </Modal.Footer>
  </Modal.Content>
</Modal>
```

`Modal.Content` portals itself, draws the overlay and the close (X) button, and traps focus.
Header, Body and Footer are each optional.

## Choosing props

| Prop              | Value                              | Use for                                                                        |
| ----------------- | ---------------------------------- | ------------------------------------------------------------------------------ |
| `persistent`      | on `Modal.Content`                 | Ignore outside clicks and Escape: unsaved work, a required answer.             |
| `showCloseButton` | on `Modal.Content`, default `true` | Hide the X only when the footer has a clear way out.                           |
| `closeAriaLabel`  | on `Modal.Content`                 | Translate the X's label (default "Close modal").                               |
| `autoFocusOnOpen` | on `Modal.Content`, default `true` | `false` keeps focus off the first field.                                       |
| `variant`         | on `Modal.Footer`: `default`       | Right-aligned actions under a divider: confirm / cancel.                       |
|                   | `extension`                        | Tinted band with actions at both ends: a secondary action or note on the left. |

State: `open` + `onOpenChange` (controlled) or `defaultOpen`, on `Modal` (Radix Dialog).

## States

- Closed / open; enter and exit animate unless `defaultMotion={false}` or `MotionProvider` off.

## Content

- Title: the question or task, sentence case ("Archive “Website redesign”?").
- Description: the consequence, one sentence.
- Buttons: verbs that repeat the title's action ("Archive"), not "OK" / "Yes". Cancel on the left,
  the primary action last.

## Accessibility

- Always render `Modal.Title`; it is the dialog's accessible name.
- `Modal.Description` becomes the dialog's description; without one, pass
  `aria-describedby={undefined}` to `Modal.Content`.
- Focus moves inside on open and returns to the trigger on close.
- With `persistent`, keep a visible way out (Cancel or the X).

## Do / Don't

```tsx
// Do: close after an async action from your own state
<Modal open={open} onOpenChange={setOpen}>…
  <Button onClick={async () => { await save(); setOpen(false); }}>Save</Button>

// Don't: an extra overlay; Content already draws one
<Modal.Content><Modal.Overlay />…</Modal.Content>
```

- Don't stack a Modal on a Modal; finish or replace the first.

## Gotchas

- `Modal.Close` used bare renders the styled X icon button; wrap your own button with `asChild`.
- `persistent`, `showCloseButton` and `autoFocusOnOpen` live on `Modal.Content`, not on `Modal`.
- `Modal.Close asChild` closes immediately; for actions that may fail, control `open` instead.
- Menus, selects and tooltips inside a Modal portal to `document.body` and stack above it; no
  `z-index` work needed.
- In a Server Component use the named parts (`ModalContent`, `ModalHeader`, …), not
  `Modal.Content`.

## API

Full props: `https://wideset.co/components/modal.md` · Types:
`packages/design-system/src/components/modal/Modal.types.ts`

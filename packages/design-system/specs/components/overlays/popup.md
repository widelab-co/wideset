---
name: Popup
import: import { Popup } from '@wideset/react'
group: overlays
status: stable
parts:
  [
    Popup,
    PopupTrigger,
    PopupContainer,
    PopupHeader,
    PopupTitle,
    PopupContent,
    PopupDescription,
    PopupFooter,
    PopupClose,
  ]
related: [Modal, Tooltip, DropdownMenu]
docs: https://wideset.co/components/popup
storybook: components-popup--default
---

# Popup

> A small panel anchored to its trigger, for content or a quick decision that keeps the page in view.

## When to use

- Short interactive content tied to one control: share settings, a quick confirm, a sync status
  with a link.
- When the user should still see the page around the trigger.

## When not to use

- The decision must block the page, or needs a backdrop → `Modal`.
- Read-only hint on hover or focus, no interaction inside → `Tooltip`.
- A list of commands → `DropdownMenu`.
- Choosing a form value → `Select` or `ComboBox`.
- Long forms or detail views → `Sidepanel`.

## Anatomy

```tsx
<Popup>
  <Popup.Trigger asChild>
    <Button variant="secondary" preset="border">
      Share
    </Button>
  </Popup.Trigger>
  <Popup.Container>
    {' '}
    {/* the floating surface */}
    <Popup.Header>
      <div className="gap-ws-5 flex items-center justify-between">
        <Popup.Title>Share this report</Popup.Title>
        <Popup.Close asChild>
          <IconButton
            aria-label="Close"
            icon={RiCloseLine}
            preset="border"
            variant="secondary"
            size="sm"
          />
        </Popup.Close>
      </div>
    </Popup.Header>
    <Popup.Content>
      {' '}
      {/* the scrolling body */}
      <Popup.Description>Anyone with the link can view this report.</Popup.Description>
    </Popup.Content>
    <Popup.Footer>
      <Popup.Close asChild>
        <Button variant="secondary" preset="border" size="sm">
          Cancel
        </Button>
      </Popup.Close>
      <Button size="sm" onClick={copyLink}>
        Copy link
      </Button>
    </Popup.Footer>
  </Popup.Container>
</Popup>
```

Header, Content and Footer are each optional. `Popup.Container` portals itself to
`document.body`.

## Choosing props

| Prop              | Value                                                      | Use for                                                            |
| ----------------- | ---------------------------------------------------------- | ------------------------------------------------------------------ |
| `side`            | on Container: `bottom` (preferred), `top`, `left`, `right` | Edge of the trigger it opens against; flips when there is no room. |
| `align`           | on Container: `start` (default), `center`, `end`           | Alignment along that edge.                                         |
| `sideOffset`      | on Container, default 8                                    | Gap to the trigger.                                                |
| `persistent`      | on Container                                               | Ignore outside clicks and Escape; close only from inside.          |
| `portalContainer` | on Container                                               | Render into another node instead of `document.body`.               |
| `modal`           | on `Popup`                                                 | Trap focus and block the page while open (off by default).         |

State: `open` + `onOpenChange` (controlled) or `defaultOpen`, on `Popup` (Radix Popover).

## Content

- Title: what the popup is about, short, sentence case.
- Add a Footer only when the popup asks for a decision; drop it when it only informs or applies
  changes as the user makes them.
- Keep one `side` for every popup of the same kind.

## Accessibility

- `Popup.Title` and `Popup.Description` are linked to the container automatically. Without a
  title, give `Popup.Container` an `aria-label`.
- There is no built-in close button: add `Popup.Close` around an `IconButton` with an
  `aria-label`, or a Cancel button.
- Not modal by default: focus moves in on open and back to the trigger on close, but is not
  trapped.

## Do / Don't

```tsx
// Do: Container is the surface, Content the body
<Popup.Container side="bottom"><Popup.Content>…</Popup.Content></Popup.Container>

// Don't: Content as the floating surface (that is Modal's naming, not Popup's)
<Popup><Popup.Trigger /><Popup.Content>…</Popup.Content></Popup>
```

- Don't nest a Popup in a Popup; use a `Modal` or `Sidepanel` for deeper flows.

## Gotchas

- Names differ from Modal: `Popup.Container` = surface (`Modal.Content`), `Popup.Content` =
  scrolling body (`Modal.Body`).
- `Popup.Close` is unstyled (Radix pass-through): use it with `asChild`.
- Passing your own `onEscapeKeyDown` or `onPointerDownOutside` to `Popup.Container` replaces the
  built-in handlers, so `persistent` stops working; call `event.preventDefault()` yourself.
- On `Popup.Content`, `className` styles the scroll wrapper; use `contentClassName` for the
  padded inner box.

## API

Full props: `https://wideset.co/components/popup.md` · Types:
`packages/design-system/src/components/popup/Popup.types.ts`

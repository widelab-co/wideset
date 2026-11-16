---
name: Sidepanel
import: import { Sidepanel } from '@wideset/react'
group: overlays
status: stable
parts:
  [
    Sidepanel,
    SidepanelTrigger,
    SidepanelPanel,
    SidepanelActions,
    SidepanelHeader,
    SidepanelTitle,
    SidepanelDescription,
    SidepanelContent,
    SidepanelFooter,
    SidepanelClose,
  ]
related: [Modal, Popup, Sidebar]
docs: https://wideset.co/components/sidepanel
storybook: components-sidepanel--default
---

# Sidepanel

> A full-height panel over the page edge for details, long forms or filters, without leaving the page.

## When to use

- Details of a row or card, opened beside the list it came from (order details).
- Edit forms longer than a Modal comfortably holds.
- Filters that read before the content (left side).

## When not to use

- A short confirmation or a single decision → `Modal`.
- A status the user must acknowledge → `StatusModal`.
- Small content anchored to a trigger → `Popup`.
- Permanent app navigation → `Sidebar`.

## Anatomy

```tsx
<Sidepanel>
  <Sidepanel.Trigger asChild>
    <Button variant="secondary" preset="border">
      View order details
    </Button>
  </Sidepanel.Trigger>
  <Sidepanel.Panel side="right" size="sm">
    <Sidepanel.Actions>
      <Sidepanel.Close asChild>
        <IconButton
          aria-label="Close"
          icon={RiCloseLine}
          preset="border"
          variant="secondary"
          size="sm"
        />
      </Sidepanel.Close>
    </Sidepanel.Actions>
    <Sidepanel.Header>
      <Sidepanel.Title>Order #4821</Sidepanel.Title>
      <Sidepanel.Description>Awaiting shipment</Sidepanel.Description>
    </Sidepanel.Header>
    <Sidepanel.Content>…</Sidepanel.Content>
    <Sidepanel.Footer>
      <Button onClick={ship}>Mark as shipped</Button>
      <Sidepanel.Close asChild>
        <Button variant="secondary" preset="border">
          Cancel
        </Button>
      </Sidepanel.Close>
    </Sidepanel.Footer>
  </Sidepanel.Panel>
</Sidepanel>
```

`Sidepanel.Panel` portals itself, draws the overlay and traps focus. `Sidepanel.Content` is the
scrolling body; Header and Footer stay fixed.

## Choosing props

| Prop      | Value                              | Use for                                                    |
| --------- | ---------------------------------- | ---------------------------------------------------------- |
| `side`    | on Panel: `right` (default)        | Details and edit forms, next to the content they describe. |
|           | `left`                             | Navigation or filters that read before the content.        |
| `size`    | on Panel: `sm`                     | Details and short forms.                                   |
|           | `md` (default)                     | Longer forms.                                              |
|           | `lg`                               | Tables or side-by-side content.                            |
| `divider` | on Header / Footer, default `true` | `false` when the content already separates itself.         |

Pick the smallest `size` that fits; on narrow screens every size takes the full width.
State: `open` + `onOpenChange` (controlled) or `defaultOpen`, on `Sidepanel` (Radix Dialog).

## States

- Closed / open; slides in from its side unless motion is off (`defaultMotion` on Panel or
  `MotionProvider`).

## Content

- Title names the object or task ("Order #4821", "Filters"); description is one short status
  or hint line.
- Footer: the primary action plus Cancel or Close.

## Accessibility

- Always render `Sidepanel.Title`; it names the dialog. Without `Sidepanel.Description`, pass
  `aria-describedby={undefined}` to `Sidepanel.Panel`.
- There is no built-in close button: put `Sidepanel.Close asChild` around an `IconButton` with an
  `aria-label` in `Sidepanel.Actions`, or a Close button in the footer.
- Focus moves inside on open and returns to the trigger on close; Escape and an outside click close it.

## Do / Don't

- Do keep the list behind the panel in place, so closing returns the user to where they were.
- Do keep one side per kind of panel across the product.
- Don't open a Sidepanel from a Sidepanel; replace the content instead.
- Don't use it as the app navigation → `Sidebar`.

## Gotchas

- There is no `persistent` prop. To block outside clicks and Escape, call
  `event.preventDefault()` in `onPointerDownOutside` and `onEscapeKeyDown` on `Sidepanel.Panel`.
- `Sidepanel.Actions` sits over the header's top-right corner; keep the title short or it can
  run under the actions.
- On `Sidepanel.Content`, `className` styles the padded inner box and `wrapperClassName` the
  scroll wrapper (the opposite of `Popup.Content`).
- The surface part is `Sidepanel.Panel`, not `Sidepanel.Content`.
- `Sidepanel.Close` and `Sidepanel.Trigger` are unstyled (Radix pass-through): use `asChild`.

## API

Full props: `https://wideset.co/components/sidepanel.md` · Types:
`packages/design-system/src/components/sidepanel/Sidepanel.types.ts`

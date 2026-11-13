---
name: IconButton
import: import { IconButton } from '@wideset/react'
group: actions
status: stable
parts: [IconButton, IconButtonIcon]
related: [Button, LinkButton, SplitButton]
docs: https://wideset.co/components/icon-button
storybook: components-button-iconbutton--default
---

# IconButton

> An icon-only action where a text label would add weight and the icon is unambiguous.

## When to use

- Compact toolbars, table rows, card corners, utility controls (Settings, More, Close, Refresh).
- Many actions side by side that should stay quiet until hovered.

## When not to use

- The action needs a visible label to be understood → `Button`.
- Text-style navigation to another page → `LinkButton`.
- A default action plus a menu → `SplitButton`.

## Anatomy

```tsx
<IconButton icon={RiSettings3Line} aria-label="Settings" />
```

The icon is a prop, not a child. `IconButtonIcon` / `IconButton.Icon` is `Button.Icon` re-exported;
you do not need it for a plain icon button.

## Choosing props

`variant`, `preset` and `size` follow the same rules and values as [Button](./button.md).
What differs for icon-only use:

| Prop            | Value                    | Use for                                                  |
| --------------- | ------------------------ | -------------------------------------------------------- |
| `icon`          | a Remix icon component   | Required. The whole visible content.                     |
| `preset`        | `filled` (default)       | An icon action that stands alone and is the main action. |
|                 | `border`                 | Visible, less weight; floating bars, alert actions.      |
|                 | `ghost`                  | Toolbars and table rows with many icon actions.          |
| `variant`       | `secondary`              | Quiet utilities in a toolbar.                            |
| `size`          | match the buttons nearby | `xs`–`lg`, `md` default.                                 |
| `iconClassName` | string                   | Extra classes on the rendered icon.                      |
| `asChild`       | `true`                   | Icon-button styling on your own element, e.g. an `<a>`.  |

## States

- Hover, press and focus are built in.
- A disabled icon button cannot be focused, so keyboard and screen reader users may not find it.
  Disable only while the action is temporarily unavailable; keep the toolbar layout the same.

## Content

- Use the Remix icon that is conventional for the action (`RiDeleteBinLine` for delete,
  `RiMore2Line` for more).
- `aria-label` is a verb phrase, sentence case: "Delete file", "Add member".

## Accessibility

- The icon is hidden from screen readers. Every `IconButton` needs `aria-label` (or
  `aria-labelledby`); the component does not supply one.
- With `asChild` on an `<a>`, keep the accessible name on the link (`aria-label` or an `sr-only`
  span inside it).

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

## API

Full props: `https://wideset.co/components/icon-button.md` · Types:
`packages/design-system/src/components/button/IconButton.types.ts`

---
name: SplitButton
import: import { SplitButton, DropdownMenu, ListItem } from '@wideset/react'
group: actions
status: stable
parts: [SplitButton, SplitButtonIcon, SplitButtonTruncatedText]
related: [Button, DropdownMenu, IconButton]
docs: https://wideset.co/components/split-button
storybook: components-button-splitbutton--default
---

# SplitButton

> One default action on the label, related alternatives behind a chevron menu, in one control.

## When to use

- There is a clear most-common action and a few variations of it: Publish / Save as draft /
  Schedule for later; Save / Save as template.

## When not to use

- No default action, only a list of equal choices → `DropdownMenu` with a `Button` trigger.
- A single action → `Button`.
- Actions for selected rows → `ActionBar`.

## Anatomy

```tsx
<SplitButton
  icon={RiArrowDownSLine}
  onClick={publish}
  menuContent={
    <>
      <DropdownMenu.Item onSelect={saveDraft}>
        <ListItem.Content>
          <ListItem.Label>Save as draft</ListItem.Label>
        </ListItem.Content>
      </DropdownMenu.Item>
      <DropdownMenu.Separator />
      <DropdownMenu.Item variant="danger">
        <ListItem.Content>
          <ListItem.Label>Discard</ListItem.Label>
        </ListItem.Content>
      </DropdownMenu.Item>
    </>
  }
>
  <SplitButton.Icon icon={RiSendPlaneLine} /> {/* optional, in the main half */}
  Publish
</SplitButton>
```

Two buttons: the main half runs `onClick`; the chevron half opens the menu. The menu is managed
inside; pass only its items in `menuContent` (`DropdownMenu.Item`, `DropdownMenu.Label`,
`DropdownMenu.Separator`).

## Choosing props

`variant` and `size` follow [Button](./button.md).

| Prop                     | Value                       | Use for                                               |
| ------------------------ | --------------------------- | ----------------------------------------------------- |
| `icon`                   | `RiArrowDownSLine`          | Required. The chevron in the menu half.               |
| `preset`                 | `filled` (default)          | The split action is the view's main action.           |
|                          | `border`                    | Next to a filled button, less weight.                 |
| `disabled`               | `true`                      | Main action off; the menu still opens.                |
| `iconDisabled`           | `true`                      | Menu off; the main action still works.                |
| `open` / `onOpenChange`  | controlled                  | Drive the menu from outside; `defaultOpen` otherwise. |
| `menuSide` / `menuAlign` | `bottom` / `end` (defaults) | Where the menu opens relative to the chevron.         |
| `iconAriaLabel`          | `'More options'` (default)  | Name of the chevron button.                           |

## States

- Each half has its own hover, press and focus.
- Disable the halves independently; set `disabled` and `iconDisabled` together when nothing can
  be done right now.

## Content

- The label is the default action as a verb: "Publish", "Save".
- Menu items are variations of that action, not unrelated commands.

## Accessibility

- The chevron is a separate button; its name comes from `iconAriaLabel`. Change it when "More
  options" does not describe the menu ("More publish options").
- Menu keyboard behaviour comes from `DropdownMenu`.

## Do / Don't

```tsx
// Do: border split next to a filled primary
<Button>Continue</Button>
<SplitButton preset="border" icon={RiArrowDownSLine} menuContent={items}>Save</SplitButton>

// Don't: ghost preset (not supported; the halves would not read as one control)
<SplitButton preset="ghost" … />

// Don't: pass the leading icon as `icon`; it replaces the chevron
<SplitButton icon={RiSendPlaneLine}>Publish</SplitButton>
```

## Gotchas

- `icon` is required and is the menu-trigger icon, not a leading icon. A leading icon goes in
  children as `SplitButton.Icon`.
- `className` lands on the outer wrapper; `ref` and other native props (`aria-*`, `data-*`,
  `type`) land on the main button.
- No `menuContent` means no menu: the chevron renders but opens nothing.
- `preset` is only `filled` or `border`.

## API

Full props: `https://wideset.co/components/split-button.md` · Types:
`packages/design-system/src/components/button/SplitButton.types.ts`

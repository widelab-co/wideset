---
name: Button
import: import { Button } from '@wideset/react'
group: actions
status: stable
parts: [Button, ButtonIcon, ButtonTruncatedText]
related: [IconButton, LinkButton, SplitButton]
docs: https://wideset.co/components/button
storybook: components-button-button--default
---

# Button

> Trigger an action, submit a form or confirm a decision, with a visible text label.

## When to use

- The action happens here: save, submit, delete, approve, open a dialog.
- A filled call to action that navigates, with link semantics: `Button asChild` around an `<a>`
  or a router link.

## When not to use

- A text-style link to another page → `LinkButton`.
- The icon alone says what the control does (toolbars, table rows) → `IconButton`.
- One default action plus a menu of related alternatives → `SplitButton`.
- A tile-shaped entry point with a title and description → `ActionTile`.
- Narrowing a list by predefined values → `FilterButton`.

## Anatomy

```tsx
<Button variant="primary" preset="filled" size="md">
  <Button.Icon icon={RiDownloadLine} /> {/* optional, before or after the label */}
  Download invoice
</Button>

<Button className="w-[20rem]">
  <Button.TruncatedText>A label that may be longer than the button</Button.TruncatedText>
</Button>
```

Named exports `ButtonIcon` and `ButtonTruncatedText` are the same parts for Server Components.

## Choosing props

`variant` is meaning (colour), `preset` is emphasis. Choose them independently.

| Prop      | Value               | Use for                                                            |
| --------- | ------------------- | ------------------------------------------------------------------ |
| `preset`  | `filled` (default)  | The one action the view is for. Once per view.                     |
|           | `border`            | A real alternative the user may take instead.                      |
|           | `ghost`             | The way out (Cancel, Back, Dismiss) and quiet actions in dense UI. |
| `variant` | `primary` (default) | The action the view is for.                                        |
|           | `secondary`         | A supporting action next to it.                                    |
|           | `danger`            | Actions that destroy something.                                    |
|           | `success`           | A confirmation that completes a flow.                              |
|           | `inverse`           | Only on dark or coloured surfaces.                                 |
| `size`    | `md` (default)      | Forms, dialogs, page actions.                                      |
|           | `xs` / `sm`         | Toolbars, table rows, compact layouts.                             |
|           | `lg`                | A page's main call to action.                                      |
| `type`    | `button` (default)  | Set `submit` for the form's submit button.                         |
| `asChild` | `true`              | Put the button styling on your own element (`<a>`, router link).   |

## States

- Hover, press and keyboard focus are built in.
- `disabled` blocks focus and click and gives no reason. Disable only while the action is
  temporarily unavailable and the user can tell what enables it (an empty required field).

## Content

- Label is a verb or verb + noun, sentence case: "Save changes", "Delete project".
- Icon before the label reinforces the action; icon after it suggests direction or a next step.
- Buttons side by side share one `size`.

## Accessibility

- `Button.Icon` is hidden from screen readers; the label names the button. A button with no
  label is an `IconButton` and needs `aria-label`.
- With `asChild`, the child element carries the semantics: use `<a href>` for navigation.

## Do / Don't

```tsx
// Do: one filled action, alternatives in border / ghost
<Button preset="ghost">Cancel</Button>
<Button preset="border">Save draft</Button>
<Button>Publish</Button>

// Do: stretch inside a padded container
<Button variant="danger" className="w-full">Delete workspace</Button>

// Don't: icon via a lower-case prop, or a raw svg child
<Button icon={RiDownloadLine}>Download</Button>
<Button><RiDownloadLine /> Download</Button>
```

- Don't show two `filled` primary buttons in one view; the second one is `border` or `ghost`.
- Don't put `inverse` on a light surface.

## Gotchas

- `Button` itself has no `icon` prop; put the icon in a `Button.Icon` part.
- `type` defaults to `button`, so a form needs `type="submit"` set explicitly.
- `Button.Icon` reads size from the parent and throws outside `Button`, `IconButton` or
  `SplitButton`; it does not work inside `LinkButton`.
- With `asChild` the child must be exactly one element.
- Animations follow `MotionProvider`; `defaultMotion={false}` turns them off for one button.

## API

Full props: `https://wideset.co/components/button.md` · Types:
`packages/design-system/src/components/button/Button.types.ts`

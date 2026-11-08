---
name: LinkButton
import: import { LinkButton } from '@wideset/react'
group: actions
status: stable
parts: [LinkButton, LinkButtonTruncatedText]
related: [Button, IconButton]
docs: https://wideset-docs.widelab.workers.dev/components/link-button
storybook: components-button-linkbutton--default
---

# LinkButton

> Navigate somewhere, with real link semantics and a text-style, button-sized hit area.

## When to use

- Activation goes to another page or URL: "View invoices", "Billing settings".
- A standalone route under a form or in a card, or a link inside a sentence (`underlined`).

## When not to use

- The control does something here (save, submit, open a dialog) → `Button`.
- A filled call to action that navigates → `Button asChild` around an `<a>`.
- Beside other buttons (a form or card footer, a header) → `Button preset="ghost"`, with
  `asChild` around an `<a>` when it navigates. A row of buttons shares one height and a hover
  fill; `LinkButton` has neither.
- Icon-only navigation → `IconButton asChild` around an `<a>`.
- A tile-shaped destination with title and description → `ActionTile` with `href`.

## Anatomy

```tsx
<LinkButton href="/invoices">View invoices</LinkButton>

<LinkButton href="/release-notes" className="w-[20rem]">
  <LinkButton.TruncatedText>Open the release notes for this iteration</LinkButton.TruncatedText>
</LinkButton>

<LinkButton asChild>
  <a href="/settings">Settings</a> {/* or your router's link element */}
</LinkButton>
```

Renders an `<a>`. `LinkButtonTruncatedText` is `Button.TruncatedText` re-exported.

## Choosing props

| Prop         | Value               | Use for                                                         |
| ------------ | ------------------- | --------------------------------------------------------------- |
| `variant`    | `primary` (default) | The main route out of a view.                                   |
|              | `secondary`         | A supporting route.                                             |
|              | `danger`            | A destination that is risky (account deletion).                 |
|              | `success`           | The next step after a win.                                      |
|              | `inverse`           | Dark or coloured surfaces only.                                 |
| `size`       | `sm` (default)      | Body text, cards, table rows.                                   |
|              | `lg`                | A standalone route that needs presence, e.g. under a form.      |
| `underlined` | `false` (default)   | Turn on inside a sentence, where colour alone does not mark it. |
| `asChild`    | `true`              | Router links: styling goes on your link element.                |

## States

- Hover, press and focus are built in.
- `disabled` sets `aria-disabled`, removes the link from the tab order and cancels the click.
  Use it only while the destination is temporarily unavailable; otherwise hide the link.

## Content

- Name the destination, not the gesture: "View invoices", not "Click here".

## Accessibility

- It is a link: it can be opened in a new tab and shows its address like any link. Do not use it with
  only `onClick` and no `href`.
- Disabled is announced through `aria-disabled`; there is no native disabled on `<a>`.

## Do / Don't

```tsx
// Do
<p>Payments moved. <LinkButton href="/billing" underlined>See billing</LinkButton></p>

// Don't: a link that performs an action
<LinkButton onClick={deleteProject}>Delete project</LinkButton>   // → Button variant="danger"

// Don't: Button.Icon inside LinkButton (throws, no Button context)
<LinkButton href="/x"><Button.Icon icon={RiArrowRightLine} />Next</LinkButton>
```

## Gotchas

- Only `sm` and `lg` sizes exist; there is no `xs`, `md` or `preset`.
- No icon part: `Button.Icon` throws outside `Button`, `IconButton` and `SplitButton`.
- `ref` points at the `<a>` (`HTMLAnchorElement`), and `onClick` receives an anchor event.
- Animations follow `MotionProvider`; `defaultMotion={false}` turns them off here.

## API

Full props: `https://wideset-docs.widelab.workers.dev/components/link-button.md` · Types:
`packages/design-system/src/components/button/LinkButton.types.ts`

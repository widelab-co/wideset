---
name: TextLink
import: import { TextLink } from '@wideset/react'
group: actions
status: stable
parts: [TextLink]
related: [LinkButton, Button]
docs: https://wideset-docs.widelab.workers.dev/components/text-link
storybook: components-textlink--default
---

# TextLink

> A link inside a sentence: the sentence's own type, in the primary colour, underlined.

## When to use

- A link inside running text: the help line under a sign-in form ("reset your password"), helper
  text, a note, a legal line ("Terms of service").

## When not to use

- A standalone route, such as the link under a form or in a card → `LinkButton`.
- The text does something here (resend a code, open a dialog) → `Button`.
- A whole row or tile is the destination → `ActionTile` with `href`.

## Anatomy

```tsx
<p className="typography-body-md text-ws-static-subtle">
  Trouble with signing in? Request a magic <TextLink href="/magic-link">sign-in link</TextLink> or{' '}
  <TextLink href="/reset-password">reset your password</TextLink>.
</p>

<TextLink asChild>
  <a href="/terms">Terms of service</a> {/* or your router's link element */}
</TextLink>
```

Renders an `<a>` with no type of its own: size, weight and line height come from the text around
it. It adds the primary colour and an underline.

## States

- Hover and press darken the colour; keyboard focus draws the focus ring. The underline stays.
- There is no visited and no disabled state: a link that cannot be followed is plain text.

## Content

- The link text names the destination and reads as part of the sentence: "reset your password",
  not "click here".
- A few words, not the whole sentence.

## Accessibility

- The underline is what tells a link from the words around it; do not remove it with `className`.
- A link that opens a new tab says so in its text ("opens in a new tab").

## Do / Don't

```tsx
// Do: the link is part of the sentence and takes its type
<p className="typography-body-sm text-ws-static-subtle">
  By creating an account you agree to the <TextLink href="/terms">Terms of service</TextLink>.
</p>

// Don't: a LinkButton inside a sentence; its padding and label weight break the line
<p>Payments moved. <LinkButton href="/billing" underlined>See billing</LinkButton></p>

// Don't: a link that runs an action
<TextLink onClick={resendCode}>Resend the code</TextLink>   // → Button
```

## Gotchas

- Put it inside the text element. Outside a paragraph it takes whatever type its parent has.
- It adds no `target` or `rel`: for a new tab, set `target="_blank"` and `rel="noreferrer"`.
- `ref` points at the `<a>` (`HTMLAnchorElement`).

## API

Full props: `https://wideset-docs.widelab.workers.dev/components/text-link.md` · Types:
`packages/design-system/src/components/text-link/TextLink.types.ts`

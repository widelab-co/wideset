# TextLink

## When to use

- A link inside running text: the help line under a sign-in form ("reset your password"), helper
  text, a note, a legal line ("Terms of service").

## When not to use

- A standalone route, such as the link under a form or in a card → `LinkButton`.
- The text does something here (resend a code, open a dialog) → `Button`.
- A whole row or tile is the destination → `ActionTile` with `href`.

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

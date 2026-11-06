# LinkButton

## When to use

- Activation goes to another page or URL: "View invoices", "Billing settings".
- A standalone route under a form or in a card.

## When not to use

- A link inside a sentence → `TextLink`; it keeps the sentence's type.
- The control does something here (save, submit, open a dialog) → `Button`.
- A filled call to action that navigates → `Button asChild` around an `<a>`.
- Icon-only navigation → `IconButton asChild` around an `<a>`.
- A tile-shaped destination with title and description → `ActionTile` with `href`.

## Do / Don't

```tsx
// Do: a standalone route
<LinkButton href="/billing" size="lg">See billing</LinkButton>

// Don't: inside a sentence (button padding and label weight); use TextLink
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

# Button

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

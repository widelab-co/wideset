# Shortcut

## When to use

- At the end of a menu row, for an action that has a keyboard shortcut (Bold, ⌘B).
- In a sentence that teaches a shortcut: "Press ⌘K to search".
- On a keyboard shortcuts sheet, one per action.

## When not to use

- A category or a state → `Tag` / `StatusBadge`.
- A key the user clicks or taps → `Button`; Shortcut is not interactive.
- Code, a command or a file name in running text → a native `code` element.

## Do / Don't

```tsx
// Do: one key per Shortcut.Key
<Shortcut>
  <Shortcut.Key>⌘</Shortcut.Key>
  <Shortcut.Key>K</Shortcut.Key>
</Shortcut>

// Don't: the keys as one string; no key widths, and ⌘ is read by its Unicode name
<Shortcut>⌘K</Shortcut>
```

- Don't mix `strong` and `weak` in one list.
- Don't give a Shortcut an `onClick`; the action belongs to the row or a `Button`.

## Gotchas

- A key gets its spoken name only when its child is exactly one of `⌘ ⇧ ⌥ ⌃`.
- The default Inter subsets of Fontsource and Google Fonts leave out `⌘ ⇧ ⌥ ⌃`, so the browser
  draws them from a fallback font. Load those four glyphs as well, for example a Google Fonts
  request with `&text=⌘⇧⌥⌃`.
- Shortcut is drawn for the theme's own surfaces (page, card, menu). On the default `Tooltip`,
  which is inverted, the cap's stroke disappears and the keys lose contrast; there is no inverted
  Shortcut yet.

---
name: Shortcut
import: import { Shortcut } from '@wideset/react'
group: data-display
status: stable
parts: [Shortcut, ShortcutKey]
related: [DropdownMenu, ListItem, Tag, StatusBadge]
docs: https://wideset-docs.widelab.workers.dev/components/shortcut
storybook: components-shortcut--default
---

# Shortcut

> The keys that run an action, shown where the action is offered. It only displays them.

## When to use

- At the end of a menu row, for an action that has a keyboard shortcut (Bold, ⌘B).
- In a sentence that teaches a shortcut: "Press ⌘K to search".
- On a keyboard shortcuts sheet, one per action.

## When not to use

- A category or a state → `Tag` / `StatusBadge`.
- A key the user clicks or taps → `Button`; Shortcut is not interactive.
- Code, a command or a file name in running text → a native `code` element.

## Anatomy

```tsx
<Shortcut>
  <Shortcut.Key>⇧</Shortcut.Key>
  <Shortcut.Key>⌘</Shortcut.Key>
  <Shortcut.Key>8</Shortcut.Key>
</Shortcut>
```

One `Shortcut.Key` per key, in the order they are pressed. `ShortcutKey` is the named export of
`Shortcut.Key`. In a menu the Shortcut goes in `ListItem.Suffix`, so it lines up at the row's end:

```tsx
<DropdownMenu.Item>
  <ListItem.Label>Bold</ListItem.Label>
  <ListItem.Suffix>
    <Shortcut>
      <Shortcut.Key>⌘</Shortcut.Key>
      <Shortcut.Key>B</Shortcut.Key>
    </Shortcut>
  </ListItem.Suffix>
</DropdownMenu.Item>
```

## Choosing props

| Prop       | Value              | Use for                                                                  |
| ---------- | ------------------ | ------------------------------------------------------------------------ |
| `emphasis` | `strong` (default) | Menu and sidebar rows: the bordered cap sets the keys apart from labels. |
|            | `weak`             | Inside a line of text: the bare keys, at the height of body text.        |

## Content

- Write each key as a Mac keyboard prints it: the glyphs `⌃ ⌥ ⇧ ⌘`, capital letters (`K`),
  named keys as words (`Esc`, `Tab`, `Enter`).
- Modifiers first, in the order macOS prints them (⌃ ⌥ ⇧ ⌘), then the key: `⇧⌘8`, not `⌘⇧8`.
  No `+` between keys.
- The component does not detect the platform. On Windows and Linux write `Ctrl`, `Alt` and
  `Shift` as words.

## Accessibility

- Shortcut renders nested `<kbd>` elements: text, with no role, never focusable.
- `⌘ ⇧ ⌥ ⌃` are read as Command, Shift, Option and Control; letters and named keys as written.
  Other glyphs (⏎, ⌫, arrows) are read by their Unicode names, so write those keys as words.
- The keys belong to the row's text: a menu item reads "Bold, Command B".
- Showing a shortcut does not register it. Listen for the keys in your app, and keep every action
  reachable without them.

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

## API

Full props: `https://wideset-docs.widelab.workers.dev/components/shortcut.md` · Types:
`packages/design-system/src/components/shortcut/Shortcut.types.ts`

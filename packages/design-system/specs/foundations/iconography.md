# Iconography

Wideset ships no icons: every icon is a component from Remix Icon (`@remixicon/react`), the set
the Figma library uses, passed to Wideset as a component reference. Icons are `1em` square and
`currentColor`, so they follow the font size and text colour around them.

Docs: `https://wideset.co/docs/icons` · Sizing rule:
`packages/design-system/src/styles/utilities/overrides.css`

## Finding an icon

Search remixicon.com and convert the name to PascalCase with an `Ri` prefix:
`arrow-right-line` → `RiArrowRightLine`. Most icons come in `-line` and `-fill`; components use
`-fill` mainly for status glyphs (`RiCheckboxCircleFill`, `RiErrorWarningFill`,
`RiInformationFill`).

```bash
npm install @remixicon/react
```

## Passing icons to components

Pass the component itself, never an element.

Every icon prop is called `icon`, on icon parts (`Button.Icon`, `Tag.Icon`, `Chip.Icon`,
`StatusBadge.Icon`, `Tabs.Icon`, `SegmentedControl.Icon` and `.Item`, `TextInput.Icon`, `Tile.Icon`,
`ActionTile.Icon`, `Accordion.Icon`) and on components or items that hold one icon (`IconButton`,
`SplitButton`, `Tile`, `ActionTile`, `Sidebar.Item`, `TextInput.ClearButton`):

- `<Button.Icon icon={RiArrowRightLine} />`
- `<IconButton icon={RiMoreLine} aria-label="More actions" />`

```tsx
import { RiArrowRightLine, RiMoreLine } from '@remixicon/react';
import { Button, IconButton } from '@wideset/react';

<Button>
  Continue
  <Button.Icon icon={RiArrowRightLine} />
</Button>

<IconButton icon={RiMoreLine} aria-label="More actions" />
```

Order in the children decides the side: an icon part before the label is leading, after it is
trailing.

## Size and colour

Inside a component, the icon is sized and coloured for you; do not add classes to change it.
On its own, an icon is `1em` and `currentColor` (Wideset resets Remix's fixed 24px attributes to
`1em`):

```tsx
<RiCheckLine className="text-ws-500 text-ws-semantic-positive" />
<span className="typography-body-md text-ws-static-subtle inline-flex items-center gap-ws-3">
  <RiTimeLine aria-hidden="true" />
  Updated 2 min ago
</span>
```

- Size with the font-size tokens (`text-ws-400` = 1rem, `text-ws-500` = 1.25rem,
  `text-ws-600` = 1.5rem) or let it inherit from the text it sits in.
- For a fixed box, `size-ws-control-md` (1.25rem) and the other `size-ws-control-*` steps
  override the `1em` reset.
- Colour with `text-ws-*` classes; never `fill` or `color` props with raw values.

## Accessibility

- Icons inside Wideset parts are rendered with `aria-hidden`; the visible label names the
  control.
- An icon-only control needs a name: `aria-label` on `IconButton`; an icon-only
  `SegmentedControl.Item` (`icon` and no children) requires `aria-label` or `aria-labelledby`
  by type. Pair it with a Tooltip when the meaning is not obvious.
- A standalone decorative icon gets `aria-hidden="true"`. A standalone icon that carries meaning
  (a status with no text) gets `role="img"` and `aria-label`, or visible text next to it.
- Colour alone never carries meaning; pair a coloured icon with text or a label.

## Common choices

Prefer the `Line` style; use `Fill` to show a selected or active state, one style per surface. An
icon repeats meaning, it does not replace it: if a row of icons needs tooltips to be understood,
use labels.

| Meaning                       | Icon                                                                             |
| ----------------------------- | -------------------------------------------------------------------------------- |
| Add                           | `RiAddLine`                                                                      |
| Edit                          | `RiPencilLine`                                                                   |
| Delete                        | `RiDeleteBinLine`                                                                |
| Close, dismiss                | `RiCloseLine`                                                                    |
| Search                        | `RiSearchLine`                                                                   |
| Filter                        | `RiFilter3Line`                                                                  |
| More actions                  | `RiMoreLine`                                                                     |
| Settings                      | `RiSettings3Line`                                                                |
| Open externally               | `RiExternalLinkLine`                                                             |
| Download, upload              | `RiDownloadLine`, `RiUploadLine`                                                 |
| Success, warning, error, info | `RiCheckboxCircleLine`, `RiAlertLine`, `RiErrorWarningLine`, `RiInformationLine` |

## Banned

- Inline `<svg>` or icon files for something Remix has; other icon libraries.
- `icon={<RiCheckLine />}` (an element) instead of `icon={RiCheckLine}`; the exception is `Avatar`, whose `icon` takes an element.
- `width`/`height` attributes or Tailwind size classes (`w-5`, `h-5`, `text-xl`) on icons.

## Light and dark

Icons follow `currentColor`, so they flip with the text colour classes under `.dark`.

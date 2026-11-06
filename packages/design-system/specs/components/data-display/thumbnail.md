---
name: Thumbnail
import: import { Thumbnail } from '@wideset/react'
group: data-display
status: stable
parts: [Thumbnail, ThumbnailIcon, ThumbnailImage]
related: [Avatar, FileItem, Table, ListItem]
docs: https://wideset-docs.widelab.workers.dev/components/thumbnail
storybook: components-thumbnail--default
---

# Thumbnail

> A small square tile that stands for a thing next to its name: a file, a project, an integration.

## When to use

- Before a file's name in a table, list or menu: the file kind (`pdf`, `spreadsheet`, …) in its
  own glyph and hue.
- A project, space or section without a picture: a glyph (`icon`) or a letter (`text`).
- An integration or app: its logo (`type="logo"`), on a white tile that reads on any surface.
- A small preview of a product or an image file (`src`).

## When not to use

- A person, a team, a company or a workspace account → `Avatar` (`shape="square"` for anything
  that is not a person).
- A file row in an upload list → `FileItem` with `FileItem.Thumbnail`, which reads the kind off
  the file name.
- A large preview that is the subject of a card → `Card.Media`.
- A plain icon before a label, with no tile → the Remix icon in `ListItem.Prefix`.
- A state or a category → `StatusBadge` or `Tag`.

## Anatomy

```tsx
<Thumbnail icon={RiFlashlightFill} />              {/* a glyph on the purple tile; a bar chart by default */}
<Thumbnail src={product.photoUrl} alt="" />         {/* a picture cropped to fill the tile */}
<Thumbnail type="logo" src={app.logoUrl} alt="" />  {/* a logo at glyph size on a white tile */}
<Thumbnail text="M" />                              {/* a letter or two */}
<Thumbnail type="pdf" />                            {/* a file kind: fixed glyph and hue */}
```

The content follows the prop you pass; you don't compose the parts for that. Compose
`Thumbnail.Image` or `Thumbnail.Icon` only when the picture or glyph needs props of its own:

```tsx
<Thumbnail size="lg">
  <Thumbnail.Image src={product.photoUrl} alt="" loading="lazy" />
</Thumbnail>
```

Named exports (`ThumbnailIcon`, `ThumbnailImage`) are the same parts for Server Components.

## Choosing props

| Prop   | Value                                                    | Use for                                                    |
| ------ | -------------------------------------------------------- | ---------------------------------------------------------- |
| `type` | left out                                                 | Follows the content prop: `src` → image, `text` → letters. |
|        | `logo`                                                   | A logo from `src`, glyph-sized on a white bordered tile.   |
|        | `pdf` / `spreadsheet` / `document` / `video` / `picture` | A file kind; anything else (archive, audio) is `document`. |
| `size` | `sm`                                                     | Menu items and sidebar items.                              |
|        | `md` (default)                                           | A small `Table`; lists.                                    |
|        | `lg`                                                     | A medium or large `Table`; file rows.                      |
|        | `xs` / `xl`                                              | Denser or roomier layouts of your own.                     |

## Content

- `text` is an initial or two, never a word. Keep one case across a list.
- One content kind per list: every row a file kind, or every row a logo. Don't mix a letter
  tile into a list of pictures.
- Use the file kinds as they are; their hue tells the kinds apart, so don't recolour a tile.

## Accessibility

- The tile is decorative next to a name: give `src` an empty `alt`, and the glyph is hidden from
  screen readers already.
- When the thumbnail stands alone, name it: `alt` on a picture or logo, or `role="img"` and
  `aria-label` on the tile.

## Do / Don't

```tsx
// Do: the kind leads the file name, decorative
<div className="gap-ws-7 flex items-center">
  <Thumbnail type="spreadsheet" />
  Budget 2027.xlsx
</div>

// Don't: a Thumbnail inside FileItem; FileItem only recognises its own part
<FileItem>
  <Thumbnail type="pdf" />
  <FileItem.Title>q3-report.pdf</FileItem.Title>
</FileItem>
```

- Don't recolour the tile with `className`; `className` is for layout.
- Don't use a Thumbnail for a person's photo; that is an `Avatar`.

## Gotchas

- `type` is required for `logo` and the file kinds; `src` alone is a picture that fills the tile.
- The content props are a discriminated union: `src` with `icon`, or `text` with a file kind, is
  a type error.
- Inside `FileItem` use `FileItem.Thumbnail`: a plain `Thumbnail` there lands under the row.

## API

Full props: `https://wideset-docs.widelab.workers.dev/components/thumbnail.md` · Types:
`packages/design-system/src/components/thumbnail/Thumbnail.types.ts`

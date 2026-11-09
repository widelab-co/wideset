# Thumbnail

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

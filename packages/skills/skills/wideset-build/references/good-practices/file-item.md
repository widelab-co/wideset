# FileItem

## When to use

- Under a `FileUpload`, one row per picked file.
- A list of attached files on a record, with a remove action.

## When not to use

- Adding files → `FileUpload` (FileItem only shows them).
- A gallery of image previews with no file metadata → a plain image grid, not FileItem rows.
- A file the user downloads from a table or a message → `LinkButton` with the file name.

## Do / Don't

```tsx
// Do: parts as direct children
<FileItem isLoading>
  <FileItem.Thumbnail name="demo.mp4" />
  <FileItem.Title>demo.mp4</FileItem.Title>
</FileItem>

// Don't: parts wrapped in your own component; they land in the message area
<FileItem>
  <MyFileInfo name="demo.mp4" />
</FileItem>
```

- Keep one `variant` per list.

## Gotchas

- FileItem sorts its children by part type. A part wrapped in another component, or a
  `<div>` around Title and Description, is no longer recognised and renders under the row.
  So is a plain `Thumbnail`: inside FileItem use `FileItem.Thumbnail`, which takes the same
  content props plus `name` and `mimeType`.
- `error` implies `hasError`; you don't need both.
- `onRemove` only fires; removing the row from your state is your job.

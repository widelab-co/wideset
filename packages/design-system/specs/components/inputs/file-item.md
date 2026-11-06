---
name: FileItem
import: import { FileItem } from '@wideset/react'
group: inputs
status: stable
parts: [FileItem, FileItemThumbnail, FileItemTitle, FileItemDescription, FileItemLoading]
related: [FileUpload, FormField, Thumbnail]
docs: https://wideset-docs.widelab.workers.dev/components/file-item
storybook: form-fileupload-fileitem--default
---

# FileItem

> One file as a row: what it is, how big, and whether its upload is running, done or failed.

## When to use

- Under a `FileUpload`, one row per picked file.
- A list of attached files on a record, with a remove action.

## When not to use

- Adding files → `FileUpload` (FileItem only shows them).
- A gallery of image previews with no file metadata → a plain image grid, not FileItem rows.
- A file the user downloads from a table or a message → `LinkButton` with the file name.

## Anatomy

```tsx
<FileItem error={error} onRemove={() => remove(file.id)}>
  <FileItem.Thumbnail name="q3-report.pdf" />
  <FileItem.Title>q3-report.pdf</FileItem.Title>
  <FileItem.Description>
    1.2 MB
    {'2 seconds left'}
  </FileItem.Description>
  <span className="typography-body-md text-ws-static-base">Split the archive and try again.</span>
</FileItem>
```

- `FileItem.Thumbnail`: the file kind, read from `name` (or `mimeType`); `src` for a real preview.
- `FileItem.Title`: the file name. `FileItem.Description`: size and, while uploading, time left;
  several children are split by a thin divider.
- `FileItem.Loading`: the spinner; `isLoading` places it for you.
- Any other child renders under the row, in the message area: the fix for an error.
- The remove button and the error icon belong to the row; set `onRemove` / `error`, don't add
  them.

## Choosing props

| Prop          | Value                 | Use for                                                           |
| ------------- | --------------------- | ----------------------------------------------------------------- |
| `variant`     | `contained` (default) | Rows standing on their own in a form or on a busy surface.        |
|               | `uncontained`         | Rows inside a card or side panel that already frames them.        |
| `isLoading`   | boolean               | Upload in flight: a spinner replaces the remove button.           |
| `error`       | ReactNode             | Failed upload: headline under the row, danger tint, warning icon. |
| `hasError`    | boolean               | Error look without a headline.                                    |
| `onRemove`    | function              | Shows the remove button (hidden while loading).                   |
| `removeLabel` | string                | Accessible name of the remove button; default "Remove <title>".   |

## States

- Uploading (`isLoading`): spinner, no remove button.
- Done: remove button when `onRemove` is set.
- Failed (`error` or `hasError`): warning icon and tint; the remove button stays so the user can
  drop the file. Error wins over `isLoading`.

## Content

- Title is the real file name, extension included.
- Description: size first ("1.2 MB"), then time left while uploading. No progress percentage.
- `error` is a short headline ("File too large"); the next child says how to fix it ("Maximum
  file size is 10 MB.").

## Accessibility

- The remove button is named "Remove <title>" when `FileItem.Title` holds plain text; pass
  `removeLabel` otherwise, and to translate.
- The spinner and the error icon are hidden from screen readers, and nothing is announced when a
  row changes state. Announce finished or failed uploads yourself.
- Give a `src` preview an empty `alt`; the title already names the file.

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

## API

Full props: `https://wideset-docs.widelab.workers.dev/components/file-item.md` · Types:
`packages/design-system/src/components/file-upload/FileItem.types.ts`

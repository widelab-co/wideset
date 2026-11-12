---
name: FileUpload
import: import { FileUpload } from '@wideset/react'
group: inputs
status: stable
parts: [FileUpload, FileUploadDropzone, FileUploadTrigger]
related: [FileItem, FormField]
docs: https://wideset.co/components/file-upload
storybook: form-fileupload-fileupload--default
---

# FileUpload

> The place a user drops or picks files: a dropzone or a compact button. Presentational: your
> file library owns the files.

## When to use

- The user attaches files to a form or a record: documents, images, imports.
- With `FileItem` rows beneath it for the picked files and their upload state.

## When not to use

- Showing files that are already attached, with no way to add more → `FileItem` rows alone.
- A button that starts an upload flow elsewhere (a modal, another page) → `Button`.

## Anatomy

FileUpload pairs with a file library such as react-dropzone (not bundled; install your own):

```tsx
const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
  onDrop,
  noClick: true, // activation belongs to FileUpload
  noKeyboard: true,
});

<div className="gap-ws-7 flex flex-col">
  <FileUpload
    browse
    zoneProps={getRootProps()}
    inputProps={getInputProps()}
    isDragActive={isDragActive}
    onBrowse={open}
  />
  <div className="gap-ws-5 flex flex-col">
    {files.map((file) => (
      <FileItem key={file.id} onRemove={() => remove(file.id)}>
        <FileItem.Thumbnail name={file.name} />
        <FileItem.Title>{file.name}</FileItem.Title>
        <FileItem.Description>{file.size}</FileItem.Description>
      </FileItem>
    ))}
  </div>
</div>;
```

`FileUpload.Dropzone` and `FileUpload.Trigger` are the two looks on their own, for a layout where
the hidden input lives elsewhere; normally set `type` on `FileUpload` instead.

## Choosing props

| Prop           | Value                | Use for                                                                                                                      |
| -------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `type`         | `dropzone` (default) | A form section where files are a main input.                                                                                 |
|                | `button`             | Tight spaces: a toolbar, a table row, a chat composer. No drop area.                                                         |
| `browse`       | omitted (default)    | The whole zone is the control: click, Enter or Space opens the picker.                                                       |
|                | `true`               | A Browse button inside the zone opens the picker; the zone only takes drops. Use it when the zone sits among other controls. |
| `onBrowse`     | required             | Your library's `open()`.                                                                                                     |
| `inputProps`   | library input props  | Renders the hidden `<input type="file">`.                                                                                    |
| `zoneProps`    | library root props   | Drag and drop on the zone (drag handlers only are kept).                                                                     |
| `isDragActive` | boolean              | From your library while a file is held over the zone.                                                                        |
| `labels`       | `FileUploadLabels`   | Translations: `dropzone`, `dropzoneActive`, `dropzoneBrowse`, `browse`, `upload`.                                            |

## States

- Drag active: the label changes to "Drop files here" and the Browse button steps aside.
- Disabled: out of the tab order, ignores the pointer and drops; the hidden input is disabled too.
- No error state on FileUpload itself. A rejected or failed file is a `FileItem` with `error`; a
  rule for the whole field ("attach at least one file") goes in `FormField`'s `errorText`.

## Content

- Say the accepted types and the size limit next to the zone (`FormField` `helperText`):
  "PDF, PNG or JPG, up to 10 MB."
- Keep the default labels short if you translate them; they are instructions, not titles.

## Accessibility

- The plain dropzone has the button role and is named by its label text; with `browse`, the
  Browse button is the control.
- The hidden file input is out of the tab order on purpose; do not give it focus.
- Announce rejected files and finished uploads yourself; rows appearing are not announced.

## Do / Don't

```tsx
// Do: the picker opens through onBrowse
<FileUpload zoneProps={getRootProps()} inputProps={getInputProps()} onBrowse={open} />

// Don't: a click handler in zoneProps; it is dropped and nothing opens
<FileUpload zoneProps={{ onClick: open }} onBrowse={() => {}} />
```

- Don't put the file list inside the zone; `FileItem` rows go beneath it.

## Gotchas

- FileUpload holds no files, validation or upload progress; it only draws the trigger. Keep files
  in your state and render a `FileItem` for each.
- `zoneProps` keeps only drag props: `onClick`, `onKeyDown`, `onKeyUp`, `tabIndex` and `role` are
  dropped. Opening the picker always goes through `onBrowse`.
- Without `inputProps` there is no file input at all; `onBrowse` must open a picker some other way.
- With react-dropzone, `useFsAccessApi: false` keeps `open()` working inside iframes.

## API

Full props: `https://wideset.co/components/file-upload.md` · Types:
`packages/design-system/src/components/file-upload/FileUpload.types.ts`

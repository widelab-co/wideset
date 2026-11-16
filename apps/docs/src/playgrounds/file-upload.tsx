import { FileItem, FileUpload } from '@wideset/react';

import { playground } from '../lib/playground-kit';

/**
 * FileUpload is presentational: `onBrowse` is a file library's `open()` (react-dropzone's,
 * for one). The stage has no library behind it, so browsing does nothing here.
 */
const browseNothing = () => {};

/** Props that only the dropzone reads; the button trigger ignores them. */
const DROPZONE_ONLY = ['browse', 'isDragActive'];

export default playground({
  from: 'FileUploadProps',
  labels: { browse: 'Browse button', isDragActive: 'Drag over' },
  group: { isDragActive: 'State' },
  content: [{ key: 'files', label: 'File list', type: 'switch', default: false }],
  render: (v, { props }) => {
    const all = props();
    const shown =
      v.type === 'button'
        ? Object.fromEntries(Object.entries(all).filter(([key]) => !DROPZONE_ONLY.includes(key)))
        : all;
    const upload = (
      <FileUpload
        className={v.type === 'dropzone' ? 'w-[26rem] max-w-full' : undefined}
        {...shown}
        onBrowse={browseNothing}
      />
    );
    if (!v.files) return upload;
    return (
      <div className="flex w-[26rem] max-w-full flex-col gap-ws-7">
        {upload}
        <FileItem onRemove={browseNothing}>
          <FileItem.Thumbnail name="q3-report.pdf" />
          <FileItem.Title>q3-report.pdf</FileItem.Title>
          <FileItem.Description>1.2 MB</FileItem.Description>
        </FileItem>
      </div>
    );
  },
  code: (v, { attrs }) => {
    const shown =
      v.type === 'button'
        ? attrs()
            .split(' ')
            .filter((attr) => attr && !DROPZONE_ONLY.includes(attr))
            .map((attr) => ` ${attr}`)
            .join('')
        : attrs();
    const upload = `<FileUpload${shown} onBrowse={open} />`;
    if (!v.files) return upload;
    return [
      '<div className="flex flex-col gap-ws-7">',
      `  ${upload}`,
      '  <FileItem onRemove={() => remove(file)}>',
      '    <FileItem.Thumbnail name="q3-report.pdf" />',
      '    <FileItem.Title>q3-report.pdf</FileItem.Title>',
      '    <FileItem.Description>1.2 MB</FileItem.Description>',
      '  </FileItem>',
      '</div>',
    ].join('\n');
  },
  // The dropzone takes no props of its own; `zoneProps` is the way onto it. The button
  // trigger (`FileUpload.Trigger`) is the other type and cannot be shown at the same time.
  // Both types: the dropzone, and the button type that renders `FileUpload.Trigger`.
  anatomy: () => (
    <div className="flex flex-col items-center gap-ws-11">
      <FileUpload className="w-[20rem] max-w-full" browse onBrowse={browseNothing} />
      <FileUpload type="button" onBrowse={browseNothing} />
    </div>
  ),
});

import { FileItem } from '@wideset/react';

import { playground } from '../lib/playground-kit';

const FILES: Record<string, { size: string; left: string }> = {
  'q3-report.pdf': { size: '1.2 MB', left: '2 seconds left' },
  'team-photo.jpg': { size: '3.4 MB', left: '5 seconds left' },
  'product-demo.mp4': { size: '48 MB', left: '1 minute left' },
};

const ERROR = 'File exceeds the 25 MB limit';
const remove = () => {};

/**
 * Variant, uploading and failed come from `FileItemProps`. A failed row on the stage also
 * carries its headline, so `hasError` is printed as `error="…"`, which implies it.
 */
export default playground({
  from: 'FileItemProps',
  labels: { isLoading: 'Uploading', hasError: 'Failed' },
  content: [
    {
      key: 'file',
      label: 'File',
      type: 'select',
      options: [
        { label: 'PDF', value: 'q3-report.pdf' },
        { label: 'Image', value: 'team-photo.jpg' },
        { label: 'Video', value: 'product-demo.mp4' },
      ],
      default: 'q3-report.pdf',
    },
    { key: 'removable', label: 'Remove button', type: 'switch', default: true },
  ],
  render: (v, { props }) => {
    const { hasError, ...rest } = props();
    const name = String(v.file);
    const { size, left } = FILES[name];
    return (
      <FileItem
        className="w-[22rem] max-w-full"
        {...rest}
        error={hasError ? ERROR : undefined}
        onRemove={v.removable ? remove : undefined}
      >
        <FileItem.Thumbnail name={name} />
        <FileItem.Title>{name}</FileItem.Title>
        <FileItem.Description>
          {size}
          {v.isLoading && !hasError && left}
        </FileItem.Description>
      </FileItem>
    );
  },
  code: (v, { attrs }) => {
    const name = String(v.file);
    const { size, left } = FILES[name];
    const open = `<FileItem${attrs().replace(' hasError', ` error="${ERROR}"`)}${
      v.removable ? ' onRemove={() => remove(file)}' : ''
    }>`;
    const description =
      v.isLoading && !v.hasError
        ? `  <FileItem.Description>\n    ${size}\n    {'${left}'}\n  </FileItem.Description>`
        : `  <FileItem.Description>${size}</FileItem.Description>`;
    return [
      open,
      `  <FileItem.Thumbnail name="${name}" />`,
      `  <FileItem.Title>${name}</FileItem.Title>`,
      description,
      '</FileItem>',
    ].join('\n');
  },
  // Placing FileItem.Loading puts the row in its uploading state, so every part shows.
  anatomy: () => (
    <FileItem className="w-[20rem] max-w-full">
      <FileItem.Thumbnail name="product-demo.mp4" />
      <FileItem.Title>product-demo.mp4</FileItem.Title>
      <FileItem.Description>48 MB{'1 minute left'}</FileItem.Description>
      <FileItem.Loading />
    </FileItem>
  ),
});

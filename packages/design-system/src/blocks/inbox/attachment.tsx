// TODO(custom): a file sent with a message, with its download; FileItem is an upload row (a grey fill or no frame, a remove button, no slot for another action).
import { RiDownloadLine } from '@remixicon/react';
import { FileItem, IconButton } from '@wideset/react';

import type { Attachment as AttachmentData } from './data';

/**
 * A file under a message: Wideset's file row for what it is and how big, its type in the
 * thumbnail's colour, in a bordered frame like every box on the white page, with the one thing to
 * do with it beside it.
 */
export function Attachment({ file }: { file: AttachmentData }) {
  return (
    <div className="border-ws-static-base rounded-ws-container-sm gap-ws-5 py-ws-5 pr-ws-5 pl-ws-7 flex w-[20rem] max-w-full items-center border">
      <FileItem variant="uncontained" className="min-w-0 flex-1">
        <FileItem.Thumbnail name={file.name} />
        <FileItem.Title>{file.name}</FileItem.Title>
        <FileItem.Description>{file.size}</FileItem.Description>
      </FileItem>
      <IconButton
        icon={RiDownloadLine}
        variant="secondary"
        preset="ghost"
        size="sm"
        aria-label={`Download ${file.name}`}
      />
    </div>
  );
}

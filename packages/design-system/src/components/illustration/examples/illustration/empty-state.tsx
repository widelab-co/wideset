/**
 * An empty state: the drawing, a short heading, one sentence on what appears here and one
 * action, centred in the region that is empty. The text carries the meaning, so the drawing stays
 * decorative.
 */
import { RiUpload2Line } from '@remixicon/react';
import { Button, Illustration } from '@wideset/react';

export default function IllustrationEmptyState() {
  return (
    <div className="gap-ws-9 flex w-[24rem] max-w-full flex-col items-center text-center">
      <Illustration illustration="folder" size="sm" />
      <div className="gap-ws-3 flex flex-col">
        <h2 className="typography-subtitle-xs text-ws-static-strong">No files yet</h2>
        <p className="typography-body-md text-ws-static-subtle">
          Files you upload to this project appear here, newest first.
        </p>
      </div>
      <Button>
        <Button.Icon icon={RiUpload2Line} />
        Upload a file
      </Button>
    </div>
  );
}

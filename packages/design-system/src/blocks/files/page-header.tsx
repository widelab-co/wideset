// TODO(custom): page header (title, a line of description, the one filled button on the right); no PageHeader in Wideset.
import { RiUpload2Line } from '@remixicon/react';
import { Button } from '@wideset/react';

import { workspace } from './data';

/**
 * The page's title, what it holds, and Upload: the screen's one filled button. It opens the file
 * picker; dropping files on the list does the same without it. While a dialog holds the filled
 * button, Upload steps back to a bordered one (`quiet`), so the screen keeps one.
 */
export function PageHeader({ onUpload, quiet }: { onUpload: () => void; quiet?: boolean }) {
  return (
    <header className="gap-ws-12 flex flex-wrap items-center justify-between">
      <div className="gap-ws-2 flex min-w-0 flex-col">
        <h1 className="typography-subtitle-md text-ws-static-strong">Files</h1>
        <p className="typography-body-md text-ws-static-subtle">
          Proposals, contracts, decks and call recordings, shared across {workspace.name}.
        </p>
      </div>
      <Button
        size="sm"
        variant={quiet ? 'secondary' : 'primary'}
        preset={quiet ? 'border' : 'filled'}
        onClick={onUpload}
      >
        <Button.Icon icon={RiUpload2Line} />
        Upload
      </Button>
    </header>
  );
}

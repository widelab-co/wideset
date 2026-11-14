// TODO(custom): page header (title, a line of description, the actions on the right); no PageHeader in Wideset.
import { RiUpload2Line } from '@remixicon/react';
import { Button } from '@wideset/react';

import { FOLDER } from './data';

/**
 * The folder's name, what it holds, and Upload. Copied from the Files block, so the folder reads
 * as the same page; Upload is a secondary button here, since the viewer over the page carries the
 * screen's one filled button (Share).
 */
export function PageHeader() {
  return (
    <header className="gap-ws-12 flex flex-wrap items-center justify-between">
      <div className="gap-ws-2 flex min-w-0 flex-col">
        <h1 className="typography-title-md text-ws-static-strong">{FOLDER.name}</h1>
        <p className="typography-body-md text-ws-static-subtle">
          Proposals, pitch decks and pipeline charts for the deals closing this quarter.
        </p>
      </div>
      <Button size="sm" variant="secondary" preset="border">
        <Button.Icon icon={RiUpload2Line} />
        Upload
      </Button>
    </header>
  );
}

// TODO(custom): page header (title, a line of description, the actions on the right); no PageHeader in Wideset.
import { RiUpload2Line } from '@remixicon/react';
import { Button } from '@wideset/react';

import { workspace } from './data';

/**
 * The open folder's name, what the files are for, and Upload. Upload is a secondary button here:
 * the dialog over the page carries the screen's one filled button.
 */
export function PageHeader({ title }: { title: string }) {
  return (
    <header className="gap-ws-12 flex flex-wrap items-center justify-between">
      <div className="gap-ws-2 flex min-w-0 flex-col">
        <h1 className="typography-subtitle-md text-ws-static-strong">{title}</h1>
        <p className="typography-body-md text-ws-static-subtle">
          Shared with everyone in {workspace.name}.
        </p>
      </div>
      <Button size="sm" variant="secondary" preset="border">
        <Button.Icon icon={RiUpload2Line} />
        Upload
      </Button>
    </header>
  );
}

// TODO(custom): page header (title, a line of description, the actions on the right); no PageHeader in Wideset.
import { RiAddLine } from '@remixicon/react';
import { Button } from '@wideset/react';

import { workspace } from './data';

/** The page's title, one line saying what the list holds, and New report: its one filled button. */
export function PageHeader() {
  return (
    <header className="gap-ws-12 flex flex-wrap items-center justify-between">
      <div className="gap-ws-2 flex min-w-0 flex-col">
        <h1 className="typography-subtitle-md text-ws-static-strong">Reports</h1>
        <p className="typography-body-md text-ws-static-subtle">
          Saved reports and the folders that hold them, shared across {workspace.name}.
        </p>
      </div>
      <Button size="sm">
        <Button.Icon icon={RiAddLine} />
        New report
      </Button>
    </header>
  );
}

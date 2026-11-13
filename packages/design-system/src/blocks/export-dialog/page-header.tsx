// TODO(custom): page header (title, a line of description, the actions on the right); no PageHeader in Wideset.
import { RiAddLine, RiDownload2Line } from '@remixicon/react';
import { Button } from '@wideset/react';

import { workspace } from './data';

/**
 * The page's title, what the list holds, and its actions. Export opens the dialog; both buttons
 * are secondary, since the dialog over the page carries the screen's one filled button.
 */
export function PageHeader({ onExport }: { onExport: () => void }) {
  return (
    <header className="gap-ws-12 flex flex-wrap items-center justify-between">
      <div className="gap-ws-2 flex min-w-0 flex-col">
        <h1 className="typography-title-md text-ws-static-strong">Customers</h1>
        <p className="typography-body-md text-ws-static-subtle">
          The companies {workspace.name} sells to, who owns each one and how it is doing.
        </p>
      </div>
      <div className="gap-ws-5 flex items-center">
        <Button size="sm" variant="secondary" preset="border" onClick={onExport}>
          <Button.Icon icon={RiDownload2Line} />
          Export
        </Button>
        <Button size="sm" variant="secondary" preset="border">
          <Button.Icon icon={RiAddLine} />
          Add customer
        </Button>
      </div>
    </header>
  );
}

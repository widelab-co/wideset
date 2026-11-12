// TODO(custom): page header (title, a line of description, the actions on the right); no PageHeader in Wideset.
import { RiDownload2Line } from '@remixicon/react';
import { Button } from '@wideset/react';

import { workspace } from './data';

/**
 * The page's title, one line saying what the list holds, and its one action. Export is a
 * secondary button: a history is read, so the page has no filled button at all.
 */
export function PageHeader({ onExport }: { onExport: () => void }) {
  return (
    <header className="gap-ws-12 flex flex-wrap items-center justify-between">
      <div className="gap-ws-2 flex min-w-0 flex-col">
        <h1 className="typography-subtitle-md text-ws-static-strong">Orders</h1>
        <p className="typography-body-md text-ws-static-subtle">
          Hardware, onboarding and licences customers bought through {workspace.name}.
        </p>
      </div>
      <Button size="sm" variant="secondary" preset="border" onClick={onExport}>
        <Button.Icon icon={RiDownload2Line} />
        Export
      </Button>
    </header>
  );
}

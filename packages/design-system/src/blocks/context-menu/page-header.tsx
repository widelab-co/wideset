// TODO(custom): page header (title, a line of description, the actions on the right); no PageHeader in Wideset.
import { RiAddLine } from '@remixicon/react';
import { Button } from '@wideset/react';

import { workspace } from './data';

/**
 * The page's title, one line saying what the list holds, and its action. Add customer is a
 * secondary button here: with the menu open, the menu is the thing to read, and a filled button
 * would be heavier than it.
 */
export function PageHeader() {
  return (
    <header className="gap-ws-12 flex flex-wrap items-center justify-between">
      <div className="gap-ws-2 flex min-w-0 flex-col">
        <h1 className="typography-subtitle-md text-ws-static-strong">Customers</h1>
        <p className="typography-body-md text-ws-static-subtle">
          The companies {workspace.name} sells to, who owns each one and how it is doing.
        </p>
      </div>
      <Button size="sm" variant="secondary" preset="border">
        <Button.Icon icon={RiAddLine} />
        Add customer
      </Button>
    </header>
  );
}

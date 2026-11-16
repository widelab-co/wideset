// TODO(custom): page header (title, a line of description, the actions on the right); no PageHeader in Wideset.
import { RiAddLine } from '@remixicon/react';
import { Button } from '@wideset/react';

import { customer } from './data';

/**
 * The page's header: the customer's name, one line saying what the page holds, and the screen's
 * one filled button on the right.
 */
export function PageHeader() {
  return (
    <header className="gap-ws-12 flex flex-wrap items-center justify-between">
      <div className="gap-ws-2 flex min-w-0 flex-col">
        <h1 className="typography-title-md text-ws-static-strong">{customer.name}</h1>
        <p className="typography-body-md text-ws-static-subtle">
          Open deals, invoices, notes and support tickets for this customer.
        </p>
      </div>
      <Button size="sm">
        <Button.Icon icon={RiAddLine} />
        New deal
      </Button>
    </header>
  );
}

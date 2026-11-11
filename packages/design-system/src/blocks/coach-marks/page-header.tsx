// TODO(custom): page header (title, a line of description, the actions on the right); no PageHeader in Wideset.
import { RiAddLine } from '@remixicon/react';
import { Button } from '@wideset/react';

import { TourSpot } from './tour-spot';

/**
 * The page's title, one line saying what the list is for, and its actions: Import and Export
 * secondary, Add customer the page's one filled button and the tour's last stop.
 */
export function PageHeader() {
  return (
    <header className="gap-ws-12 flex flex-wrap items-center justify-between">
      <div className="gap-ws-2 flex min-w-0 flex-col">
        <h1 className="typography-subtitle-md text-ws-static-strong">Customers</h1>
        <p className="typography-body-md text-ws-static-subtle">
          Everyone Lumen Studio sells to, with their plan, health and owner.
        </p>
      </div>
      <div className="gap-ws-5 flex items-center">
        <Button variant="secondary" preset="border" size="sm">
          Import
        </Button>
        <Button variant="secondary" preset="border" size="sm">
          Export
        </Button>
        <TourSpot id="add">
          <Button size="sm">
            <Button.Icon icon={RiAddLine} />
            Add customer
          </Button>
        </TourSpot>
      </div>
    </header>
  );
}

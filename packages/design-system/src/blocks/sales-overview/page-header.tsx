import { RiAddLine, RiDownload2Line } from '@remixicon/react';
import { Button } from '@wideset/react';

import { QUARTER, TODAY } from './data';
import { daysBetween } from './format';

/** The page's title on the canvas, the quarter it measures, and its actions. */
export function PageHeader() {
  const daysLeft = daysBetween(TODAY, QUARTER.to);

  return (
    <header className="gap-ws-9 flex items-end justify-between">
      <div className="gap-ws-3 flex flex-col">
        <h1 className="typography-subtitle-lg text-ws-static-strong">Sales</h1>
        <p className="typography-body-md text-ws-static-subtle">
          {QUARTER.label} · {daysLeft} days left in the quarter
        </p>
      </div>
      <div className="gap-ws-5 flex items-center">
        <Button size="sm" variant="secondary" preset="border">
          <Button.Icon icon={RiDownload2Line} />
          Export
        </Button>
        <Button size="sm">
          <Button.Icon icon={RiAddLine} />
          New deal
        </Button>
      </div>
    </header>
  );
}

import { Fragment } from 'react';

import { LATEST_DATA, TOTALS } from './data';

/** Figma's status bar under the grid: the table's totals, and when its data last came in. */
export function StatusBar() {
  return (
    <footer className="bg-ws-static-alpha-subtle typography-body-sm px-ws-11 py-ws-3 flex shrink-0 items-center justify-between">
      <div className="gap-ws-2 flex items-center">
        {TOTALS.map(({ label, value }, index) => (
          <Fragment key={`${label}-${value}`}>
            {index > 0 && <span aria-hidden className="border-ws-static-base h-ws-12 border-l" />}
            <p className="h-ws-14 px-ws-5 gap-ws-6 flex items-center">
              <span className="text-ws-static-subtle">{label}</span>
              <span className="text-ws-static-base">{value}</span>
            </p>
          </Fragment>
        ))}
      </div>
      <p className="h-ws-14 px-ws-5 gap-ws-3 flex items-center">
        <span className="text-ws-static-subtle">Latest Data</span>
        <span className="text-ws-static-base">{LATEST_DATA}</span>
      </p>
    </footer>
  );
}

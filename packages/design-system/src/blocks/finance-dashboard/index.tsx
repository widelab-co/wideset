import { RiAddLine } from '@remixicon/react';
import { Button } from '@wideset/react';
import { useState } from 'react';

import { Change } from './Change';
import { KEY_FIGURES } from './data';
import { formatCount } from './format';
import { PaymentsTable } from './PaymentsTable';
import { TopBar } from './TopBar';
import { VolumeChart } from './VolumeChart';
import { VolumePanel } from './VolumePanel';

/** Finance dashboard, Flat direction: one white surface, a top bar over the page, a side panel. */
export default function FinanceDashboard() {
  const [panelOpen, setPanelOpen] = useState(true);

  return (
    <div className="bg-ws-static-foreground flex h-dvh">
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="px-ws-18 min-h-0 flex-1 overflow-y-auto">
          <div className="gap-ws-16 py-ws-16 mx-auto flex w-full max-w-[80rem] flex-col">
            <div className="gap-ws-13 flex items-center justify-between">
              <h1 className="typography-title-md text-ws-static-strong">Overview</h1>
              <Button size="sm">
                <Button.Icon icon={RiAddLine} />
                New payment
              </Button>
            </div>

            <div className="gap-ws-7 grid grid-cols-4">
              {KEY_FIGURES.map((figure) => (
                <div
                  key={figure.label}
                  className="bg-ws-static-alpha-subtle rounded-ws-container-md gap-ws-3 px-ws-11 py-ws-9 flex flex-col"
                >
                  <p className="typography-label-sm text-ws-static-subtle">{figure.label}</p>
                  <p className="gap-ws-5 flex items-baseline">
                    <span className="typography-title-md text-ws-static-strong tabular-nums">
                      {formatCount(figure.value)}
                    </span>
                    <Change value={figure.change} />
                  </p>
                </div>
              ))}
            </div>

            <VolumeChart />
            <PaymentsTable />
          </div>
        </main>
      </div>
      {panelOpen && <VolumePanel onClose={() => setPanelOpen(false)} />}
    </div>
  );
}

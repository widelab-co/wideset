import { cn } from '@wideset/react';
import { useId, useRef, useState } from 'react';

import { PreviewConsole } from './preview-console';
import {
  exportLog,
  HOME,
  MESSAGES,
  notFoundError,
  type Viewport,
  ZONE_WARNING,
} from './preview-data';
import { PreviewPage } from './preview-page';
import { PreviewToolbar } from './preview-toolbar';

/**
 * The width each viewport gives the page. Desktop is the pane itself; the others are narrower
 * than it and never wider, so in a pane narrower than a tablet the two look the same.
 */
const WIDTH: Record<Viewport, string> = {
  desktop: 'w-full',
  tablet: 'w-[30rem] max-w-full',
  phone: 'w-[24.375rem] max-w-full',
};

/** An address as typed, without the scheme or a trailing slash. */
const tidy = (typed: string) =>
  typed
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/+$/, '');

/**
 * The Preview pane: the dev server's page in a small browser. The bar on top goes back, forward
 * and reloads, takes an address, switches the viewport and opens the console; under it the page,
 * centred on the frame's grey when its viewport is narrower than the pane; at the foot the
 * console's drawer, open on load with what the page logged. A load starts the page and its
 * console over; Export CSV in the page adds its line to the console.
 */
export function PreviewPane() {
  const consoleId = useId();
  const [history, setHistory] = useState({ entries: [HOME], index: 0 });
  const [address, setAddress] = useState(HOME);
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [messages, setMessages] = useState(MESSAGES);
  const [consoleOpen, setConsoleOpen] = useState(true);
  // Counts the loads, to start the page over, and the lines the export logged, to tell them apart.
  const [loads, setLoads] = useState(0);
  const logged = useRef(0);

  const { entries, index } = history;
  const current = entries[index];

  const load = (to: string[], at: number) => {
    setHistory({ entries: to, index: at });
    setAddress(to[at]);
    setLoads(loads + 1);
    setMessages(to[at] === HOME ? [ZONE_WARNING] : [notFoundError(to[at])]);
  };

  const go = (typed: string) => {
    const next = tidy(typed) || current;
    // The same address again is a reload; a new one drops whatever was ahead.
    if (next === current) load(entries, index);
    else load([...entries.slice(0, index + 1), next], index + 1);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PreviewToolbar
        address={address}
        onAddressChange={setAddress}
        onGo={() => go(address)}
        current={current}
        onBack={index > 0 ? () => load(entries, index - 1) : undefined}
        onForward={index < entries.length - 1 ? () => load(entries, index + 1) : undefined}
        onReload={() => load(entries, index)}
        viewport={viewport}
        onViewportChange={setViewport}
        console={{
          id: consoleId,
          open: consoleOpen,
          count: messages.length,
          onToggle: () => setConsoleOpen(!consoleOpen),
        }}
      />

      <div className="bg-ws-static-background flex min-h-0 flex-1 justify-center overflow-hidden">
        <PreviewPage
          key={loads}
          address={current}
          className={cn('h-full', WIDTH[viewport])}
          onExport={(rows) =>
            setMessages((all) => [...all, exportLog(`export-${(logged.current += 1)}`, rows)])
          }
          onHome={() => go(HOME)}
        />
      </div>

      {consoleOpen && (
        <PreviewConsole
          id={consoleId}
          messages={messages}
          onClear={() => setMessages([])}
          onClose={() => setConsoleOpen(false)}
        />
      )}
    </div>
  );
}

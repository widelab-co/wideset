// Harness for the pane builders: the frame, a placeholder for the session card and the pane card
// with its tabs. The Code-mode shell replaces this file once the transcript kit lands.
import { Tabs } from '@wideset/react';
import { useState } from 'react';

import { ChangesPane } from './changes-pane';
import { ChecksPane } from './checks-pane';
import { FilesPane } from './files-pane';
import { PreviewPane } from './preview-pane';
import { TasksPane } from './tasks-pane';
import { TerminalPane } from './terminal-pane';

export type Pane = 'changes' | 'terminal' | 'preview' | 'files' | 'tasks' | 'checks';

const PANES: { id: Pane; label: string }[] = [
  { id: 'changes', label: 'Changes' },
  { id: 'terminal', label: 'Terminal' },
  { id: 'preview', label: 'Preview' },
  { id: 'files', label: 'Files' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'checks', label: 'Checks' },
];

/**
 * Code mode: the session beside one pane, in one raised card split by a line. `pane` picks the
 * pane open on load; its tabs switch it.
 */
export default function AgentCode({ pane: initial = 'changes' }: { pane?: Pane }) {
  const [pane, setPane] = useState<Pane>(initial);
  return (
    <div className="bg-ws-static-background flex h-dvh">
      <div className="w-[16.75rem] shrink-0" />
      <main className="bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 flex min-w-0 flex-1 overflow-hidden">
        <section className="typography-body-md text-ws-static-subtle grid min-w-0 flex-1 place-items-center">
          Session transcript: in progress
        </section>
        <aside
          aria-label="Pane"
          className="border-ws-static-base flex w-[38rem] shrink-0 flex-col border-l"
        >
          <div className="h-ws-18 border-ws-static-base px-ws-11 flex shrink-0 items-end border-b">
            {/* The bar draws the one line; the tabs sit on it, the open tab’s mark over it. */}
            <Tabs
              value={pane}
              onValueChange={(value) => setPane(value as Pane)}
              divider={false}
              className="-mb-px"
            >
              <Tabs.List aria-label="Panes">
                {PANES.map(({ id, label }) => (
                  <Tabs.Item key={id} value={id}>
                    <Tabs.Label>{label}</Tabs.Label>
                  </Tabs.Item>
                ))}
              </Tabs.List>
            </Tabs>
          </div>
          {pane === 'changes' && <ChangesPane />}
          {pane === 'terminal' && <TerminalPane />}
          {pane === 'preview' && <PreviewPane />}
          {pane === 'files' && <FilesPane />}
          {pane === 'tasks' && <TasksPane />}
          {pane === 'checks' && <ChecksPane />}
        </aside>
      </main>
    </div>
  );
}

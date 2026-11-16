import { Tabs } from '@wideset/react';
import { useState } from 'react';

import { THREADS } from './changes-data';
import { ChangesPane, type Reveal } from './changes-pane';
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

type CodePaneProps = {
  id: string;
  pane: Pane;
  onPaneChange: (pane: Pane) => void;
  /** A line to bring into view in Changes. */
  reveal?: Reveal;
  /** Puts a request (Fix with Tandem, Ask Tandem to fix) in the session's composer. */
  onAsk: (text: string) => void;
};

/**
 * The session's pane: the right part of the session's own card, behind one vertical line, as
 * wide as the chat's document pane so the line stays put between the modes. Its bar is as high
 * as the session's and holds the six panes as tabs: words alone, since six one-word names fit
 * with room to spare and an icon each would only crowd them, and underlined, so the quiet ghost
 * tabs are left to the Terminal's shells one level down. The bar draws the one line; the tabs
 * sit on it with the open tab's mark over it.
 */
export function CodePane({ id, pane, onPaneChange, reveal, onAsk }: CodePaneProps) {
  const [visited, setVisited] = useState<Pane[]>([pane]);
  if (!visited.includes(pane)) setVisited([...visited, pane]);
  // The review threads live here: answered in Changes, counted in Checks.
  const [threads, setThreads] = useState(THREADS);

  return (
    <aside
      id={id}
      aria-label="Pane"
      className="border-ws-static-base flex w-[32rem] shrink-0 flex-col border-l"
    >
      <div className="h-ws-18 border-ws-static-base px-ws-11 flex shrink-0 items-end border-b">
        <Tabs
          value={pane}
          onValueChange={(value) => onPaneChange(value as Pane)}
          divider={false}
          className="-mb-px"
        >
          <Tabs.List aria-label="Panes">
            {PANES.map(({ id: value, label }) => (
              <Tabs.Item key={value} value={value} className="h-ws-18 py-ws-0">
                <Tabs.Label>{label}</Tabs.Label>
              </Tabs.Item>
            ))}
          </Tabs.List>
        </Tabs>
      </div>
      {/* A pane opened once stays mounted, hidden when another is shown, so what was done in it
          (a reply, a Viewed tick, a stopped server, a shell's history) is there on return. */}
      {PANES.filter(({ id: value }) => visited.includes(value)).map(({ id: value }) => (
        <div key={value} hidden={value !== pane} className="flex min-h-0 flex-1 flex-col">
          {value === 'changes' && (
            <ChangesPane
              reveal={reveal}
              threads={threads}
              onThreadsChange={setThreads}
              onAsk={onAsk}
            />
          )}
          {value === 'terminal' && <TerminalPane />}
          {value === 'preview' && <PreviewPane />}
          {value === 'files' && <FilesPane />}
          {value === 'tasks' && <TasksPane />}
          {value === 'checks' && <ChecksPane threads={threads} onFix={onAsk} />}
        </div>
      ))}
    </aside>
  );
}

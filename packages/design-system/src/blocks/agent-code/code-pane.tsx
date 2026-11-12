import { Tabs } from '@wideset/react';

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
      {pane === 'changes' && <ChangesPane reveal={reveal} onAsk={onAsk} />}
      {pane === 'terminal' && <TerminalPane />}
      {pane === 'preview' && <PreviewPane />}
      {pane === 'files' && <FilesPane />}
      {pane === 'tasks' && <TasksPane />}
      {pane === 'checks' && <ChecksPane onFix={onAsk} />}
    </aside>
  );
}

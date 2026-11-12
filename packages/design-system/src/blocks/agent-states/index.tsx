import { RiRestartLine } from '@remixicon/react';
import { Select } from '@wideset/react';
import { useId, useState } from 'react';

import { account, chatGroups, product, workspace } from './canon';
import { codeGroups, OPEN_SESSION, type SceneId, scenes } from './data';
import { IconAction } from './icon-action';
import type { Mode, ThreadState, TranscriptView } from './model';
import { AgentSidebar } from './sidebar';
import { StateSession } from './state-session';
import { ThreadMenu } from './thread-menu';
import { TopBar } from './top-bar';

/**
 * Agent states (Inset direction): one Code session in Tandem at the moments it has to handle,
 * in the same shell as every other agent screen. A quiet select in the top bar picks the moment
 * and `state` opens one directly: the usage limit reached, a step that failed, a connector to
 * reconnect, a question from the agent, the context nearly full, the connection lost, messages
 * queued, and a run you stopped.
 *
 * Each state is drawn where it happens and says what to do: at the step it is about in the
 * transcript, over the composer when it is about what you can send, under the bar when it is
 * about the whole app. One message a problem. The way out works and plays the rest of the run;
 * Reset puts the moment back. The sidebar is there for the session's mark: its other chats and
 * sessions do not open here.
 */
export default function AgentStates({ state = 'limit' }: { state?: SceneId }) {
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);
  const [mode, setMode] = useState<Mode>('code');
  const [id, setId] = useState(state);
  /** Counts the resets: a new round is the same moment from its start. */
  const [round, setRound] = useState(0);
  const [mark, setMark] = useState<ThreadState>();
  const [view, setView] = useState<TranscriptView>('normal');
  const scene = scenes.find((item) => item.id === id) ?? scenes[0];

  return (
    <div className="bg-ws-static-background flex h-dvh">
      <AgentSidebar
        id={sidebarId}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        product={product}
        workspace={workspace}
        account={account}
        mode={mode}
        onModeChange={setMode}
        groups={mode === 'code' ? codeGroups(mark) : chatGroups}
        openId={mode === 'code' ? OPEN_SESSION : null}
        onOpen={() => undefined}
        onNew={() => undefined}
      />

      <main className="bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar
          sidebarId={sidebarId}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          crumbs={['lumen-app', 'CSV export for bookings']}
        >
          <Select
            size="sm"
            aria-label="State"
            className="w-[14rem]"
            options={scenes.map((item) => ({ value: item.id, label: item.label }))}
            value={id}
            onValueChange={(value) => setId(value as SceneId)}
          />
          <IconAction
            label="Reset this state"
            icon={RiRestartLine}
            side="bottom"
            onClick={() => setRound(round + 1)}
          />
          <ThreadMenu view={view} onViewChange={setView} />
        </TopBar>

        <StateSession key={`${id}-${round}`} scene={scene} view={view} onMarkChange={setMark} />
      </main>
    </div>
  );
}

import { RiRestartLine } from '@remixicon/react';
import { Button } from '@wideset/react';
import { useId, useState } from 'react';

import {
  account,
  chatGroups,
  efforts,
  fallback,
  models,
  permissions,
  product,
  workspace,
} from './canon';
import { CodeTools } from './code-tools';
import { ContextPopover } from './context-popover';
import { codeGroups, OPEN_SESSION } from './data';
import type { Mode, TranscriptView } from './model';
import { ModelMenu } from './model-menu';
import { Session } from './session';
import { AgentSidebar } from './sidebar';
import { ThreadMenu } from './thread-menu';
import { TopBar } from './top-bar';
import { useSession } from './use-session';

const GROUPS = { chat: chatGroups, code: codeGroups };
const repository = codeGroups.find((group) =>
  group.threads.some((thread) => thread.id === OPEN_SESSION),
)!;
const opened = repository.threads.find((thread) => thread.id === OPEN_SESSION)!;

/**
 * Agent context (a panel over the Inset agent shell): the session's environment, open on load as
 * a popover from the context meter in the composer. Behind it is a quiet Code session in
 * Tandem's shell: the sessions by repository on the grey frame, one raised card with the top bar,
 * a short transcript at rest and the composer, whose tools end with the meter (29% used). The
 * popover says how full the context is and what fills it, offers to compact the conversation,
 * lists the connectors with Reconnect beside the one whose sign-in ran out, then what the session
 * produced and the pull request it opened.
 *
 * The session works as in every agent block (send, Replay, the transcript views). The other
 * sessions are listed, not opened, and the Chat | Code switch changes the sidebar's list only:
 * this block is the one session and its popover.
 */
export default function AgentContext() {
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);
  const [mode, setMode] = useState<Mode>('code');
  const [turns, setTurns] = useState(opened.turns);
  const [view, setView] = useState<TranscriptView>('normal');

  const session = useSession({ turns, onChange: setTurns, reply: fallback });

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
        groups={GROUPS[mode]}
        openId={OPEN_SESSION}
        workingId={session.running ? OPEN_SESSION : undefined}
        onOpen={() => {}}
        onNew={() => {}}
      />

      <div className="bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 flex min-w-0 flex-1 overflow-hidden">
        <main className="flex min-w-0 flex-1 flex-col">
          <TopBar
            sidebarId={sidebarId}
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            crumbs={[repository.label, opened.title]}
          >
            <Button variant="secondary" preset="ghost" size="sm" onClick={session.replay}>
              <Button.Icon icon={RiRestartLine} />
              Replay
            </Button>
            <Button variant="secondary" preset="border" size="sm">
              Share
            </Button>
            <ThreadMenu view={view} onViewChange={setView} />
          </TopBar>

          <Session
            session={session}
            threadId={OPEN_SESSION}
            agent={product}
            view={view}
            // The tools end with the context meter, which here opens the session's environment.
            tools={<CodeTools permissions={permissions} meter={<ContextPopover />} />}
            model={<ModelMenu models={models} efforts={efforts} />}
          />
        </main>
      </div>
    </div>
  );
}

import {
  RiArrowRightLine,
  RiFileEditLine,
  RiGitBranchLine,
  RiGitPullRequestLine,
  RiLayoutRightLine,
  RiRestartLine,
} from '@remixicon/react';
import { Button, StatusBadge } from '@wideset/react';
import { useEffect, useId, useState } from 'react';

import {
  account,
  chatGroups,
  context,
  efforts,
  fallback,
  files,
  models,
  permissions,
  product,
  workspace,
} from './canon';
import { ChangeCounts } from './changes-counts';
import { FILES } from './changes-data';
import type { Reveal } from './changes-pane';
import { ChatTools } from './chat-tools';
import { PULL_REQUEST } from './checks-data';
import { CodePane, type Pane } from './code-pane';
import { CodeTools } from './code-tools';
import { codeGroups, OPEN_SESSION } from './data';
import { Home } from './home';
import { IconAction } from './icon-action';
import type { TranscriptView } from './model';
import { ModelMenu } from './model-menu';
import { PaneCard } from './pane-card';
import { PaneLink } from './pane-link';
import { PlanCard } from './plan-card';
import { Session } from './session';
import { plan } from './session-data';
import { AgentSidebar } from './sidebar';
import { ThreadMenu } from './thread-menu';
import { TopBar } from './top-bar';
import { useShell } from './use-shell';

export type { Pane } from './code-pane';

const ADDED = FILES.reduce((sum, file) => sum + file.added, 0);
const REMOVED = FILES.reduce((sum, file) => sum + file.removed, 0);

/**
 * Agent code (Inset direction): Tandem in Code mode. The sidebar on the grey frame lists the
 * sessions by repository, with "CSV export for bookings" open. One raised card holds the rest:
 * the session (its transcript and composer) and, behind a vertical line in the same card, the
 * pane with what the session works on: Changes, Terminal, Preview, Files, Tasks, Checks. Each
 * half has its own 48px bar, so their lines meet, and each scrolls inside itself. `pane` picks
 * the pane open on load.
 *
 * The session's bar says where you are (the repository and the session) and, while it has the
 * room, where the work happens: the branch and the branch it goes into. It holds the pull
 * request with its state, Replay, the thread's menu with the transcript views, and the control
 * that shuts and opens the pane. The transcript and the pane lead to each other: a card or a
 * link in the transcript brings up its pane, a comment in Checks opens its line in Changes, and
 * Fix with Tandem and Ask Tandem to fix write the request into the composer.
 *
 * The block opens at rest, on an approval: Allow once is the screen's filled button. Replay
 * plays the newest turn again from the start, and it stops at the approval again.
 */
export default function AgentCode({ pane: initial = 'changes' }: { pane?: Pane }) {
  const sidebarId = useId();
  const paneId = useId();
  const [collapsed, setCollapsed] = useState(false);
  const [view, setView] = useState<TranscriptView>('normal');
  const [pane, setPane] = useState<Pane>(initial);
  const [paneOpen, setPaneOpen] = useState(true);
  const [reveal, setReveal] = useState<Reveal>();

  const shell = useShell({
    chat: chatGroups,
    code: codeGroups,
    mode: 'code',
    openId: OPEN_SESSION,
    reply: fallback,
    files,
  });
  const { mode, thread, session } = shell;
  /** The pane belongs to the session it shows the work of. */
  const here = thread?.id === OPEN_SESSION;
  const paneShown = here && paneOpen ? pane : null;

  // A link to a line of a changed file (`#changes/<path>:<line>`, as a comment in Checks has)
  // brings up Changes on that line. The address then goes back to the page's own, so the same
  // link works a second time.
  useEffect(() => {
    const route = () => {
      const [, path, line] = /^#changes\/(.+):(\d+)$/.exec(window.location.hash) ?? [];
      if (!path) return;
      setPane('changes');
      setPaneOpen(true);
      setReveal((last) => ({ path, line: Number(line), key: (last?.key ?? 0) + 1 }));
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    };
    window.addEventListener('hashchange', route);
    return () => window.removeEventListener('hashchange', route);
  }, []);

  const togglePane = (target: Pane) => {
    setPaneOpen(paneShown !== target);
    setPane(target);
  };

  /** What the session made, and the ways from its transcript to the panes. */
  const card = (name: string) => {
    switch (name) {
      case 'plan':
        return (
          <PlanCard steps={plan}>
            <PaneLink
              label="Open in Tasks"
              open={paneShown === 'tasks'}
              paneId={paneId}
              onToggle={() => togglePane('tasks')}
            />
          </PlanCard>
        );
      case 'terminal':
        return (
          <div className="-ml-ws-3 flex">
            <PaneLink
              label="Open in Terminal"
              open={paneShown === 'terminal'}
              paneId={paneId}
              onToggle={() => togglePane('terminal')}
            />
          </div>
        );
      case 'changes':
        return (
          <PaneCard
            icon={RiFileEditLine}
            title={`${FILES.length} files changed`}
            caption={<ChangeCounts added={ADDED} removed={REMOVED} />}
            open={paneShown === 'changes'}
            paneId={paneId}
            onToggle={() => togglePane('changes')}
          />
        );
      case 'pull-request':
        return (
          <PaneCard
            icon={RiGitPullRequestLine}
            title={PULL_REQUEST.title}
            caption={`Pull request #${PULL_REQUEST.number} · ${PULL_REQUEST.state}`}
            open={paneShown === 'checks'}
            paneId={paneId}
            onToggle={() => togglePane('checks')}
          />
        );
    }
  };

  return (
    <div className="bg-ws-static-background flex h-dvh">
      <AgentSidebar
        id={sidebarId}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        product={product}
        workspace={workspace}
        account={account}
        {...shell.sidebar}
      />

      <div className="bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 flex min-w-0 flex-1 overflow-hidden">
        <main className="flex min-w-0 flex-1 flex-col">
          <TopBar
            sidebarId={sidebarId}
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            crumbs={shell.crumbs}
            meta={
              here && (
                <>
                  <RiGitBranchLine aria-hidden className="size-ws-8 shrink-0" />
                  <span className="font-ws-mono truncate">{PULL_REQUEST.head}</span>
                  <RiArrowRightLine role="img" aria-label="into" className="size-ws-8 shrink-0" />
                  <span className="font-ws-mono shrink-0">{PULL_REQUEST.base}</span>
                </>
              )
            }
          >
            {here && (
              <Button
                variant="secondary"
                preset="ghost"
                size="sm"
                aria-label={`${PULL_REQUEST.state} pull request #${PULL_REQUEST.number}: open its checks`}
                aria-expanded={paneShown === 'checks'}
                aria-controls={paneId}
                onClick={() => togglePane('checks')}
              >
                <Button.Icon icon={RiGitPullRequestLine} />
                <span className="tabular-nums">#{PULL_REQUEST.number}</span>
                <StatusBadge size="sm">{PULL_REQUEST.state}</StatusBadge>
              </Button>
            )}
            {thread && (
              <>
                <IconAction
                  label="Replay"
                  icon={RiRestartLine}
                  side="bottom"
                  onClick={session.replay}
                />
                <ThreadMenu view={view} onViewChange={setView} />
              </>
            )}
            {here && (
              <IconAction
                label={paneOpen ? 'Close pane' : 'Open pane'}
                icon={RiLayoutRightLine}
                iconClassName="text-ws-static-subtle size-ws-9"
                side="bottom"
                aria-expanded={paneOpen}
                aria-controls={paneId}
                onClick={() => setPaneOpen(!paneOpen)}
              />
            )}
          </TopBar>

          {thread ? (
            <Session
              session={session}
              threadId={thread.id}
              agent={product}
              view={view}
              card={card}
              tools={
                mode === 'chat' ? (
                  <ChatTools onAttach={shell.attach} />
                ) : (
                  <CodeTools
                    permissions={permissions}
                    // A session whose plan was approved goes on in Accept edits, where edits go
                    // through and a command still asks.
                    defaultPermission={here ? permissions[1] : undefined}
                    context={context}
                    onAttach={shell.attach}
                  />
                )
              }
              model={<ModelMenu models={models} efforts={efforts} />}
            />
          ) : (
            <Home key={mode} mode={mode} onSend={shell.begin} />
          )}
        </main>

        {paneShown && (
          <CodePane
            id={paneId}
            pane={paneShown}
            onPaneChange={setPane}
            reveal={reveal}
            // A request from a pane goes into the composer, for Ines to send as it is or change.
            onAsk={session.write}
          />
        )}
      </div>
    </div>
  );
}

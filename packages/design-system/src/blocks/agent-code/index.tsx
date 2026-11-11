import {
  RiFileEditLine,
  RiGitPullRequestLine,
  RiLayoutRightLine,
  RiRestartLine,
} from '@remixicon/react';
import { Button, StatusBadge } from '@wideset/react';
import { useEffect, useId, useRef, useState } from 'react';

import { ChangeCounts } from './changes-counts';
import { FILES } from './changes-data';
import type { Reveal } from './changes-pane';
import { ChatTools } from './chat-tools';
import { PULL_REQUEST } from './checks-data';
import { CodePane, type Pane } from './code-pane';
import { CodeTools } from './code-tools';
import {
  account,
  chatGroups,
  codeGroups,
  efforts,
  fallback,
  models,
  OPEN_SESSION,
  permissions,
  product,
  workspace,
} from './data';
import { Home } from './home';
import { IconAction } from './icon-action';
import type { Mode, Thread, ThreadGroup, TranscriptView, Turn } from './model';
import { ModelMenu } from './model-menu';
import { PaneCard } from './pane-card';
import { PaneLink } from './pane-link';
import { PlanCard } from './plan-card';
import { Session } from './session';
import { plan } from './session-data';
import { AgentSidebar } from './sidebar';
import { ThreadMenu } from './thread-menu';
import { TopBar } from './top-bar';
import { useSession } from './use-session';

export type { Pane } from './code-pane';

/** A thread that is still working when it is opened has been at it for a moment already. */
const HEAD_START = 3000;

const NOUN: Record<Mode, string> = { chat: 'chat', code: 'session' };

/** Every turn as the sample holds it, for Replay: a turn played again starts as it was written. */
const WRITTEN = new Map(
  [...chatGroups, ...codeGroups]
    .flatMap((group) => group.threads)
    .flatMap((thread) => thread.turns)
    .map((turn) => [turn.id, turn]),
);

const ADDED = FILES.reduce((sum, file) => sum + file.added, 0);
const REMOVED = FILES.reduce((sum, file) => sum + file.removed, 0);

const mapThread = (groups: ThreadGroup[], id: string, change: (thread: Thread) => Thread) =>
  groups.map((group) => ({
    ...group,
    threads: group.threads.map((thread) => (thread.id === id ? change(thread) : thread)),
  }));

/**
 * Agent code (Inset direction): Tandem in Code mode. The sidebar on the grey frame lists the
 * sessions by repository, with "CSV export for bookings" open. One raised card holds the rest:
 * the session (its transcript and composer) and, behind a vertical line in the same card, the
 * pane with what the session works on: Changes, Terminal, Preview, Files, Tasks, Checks. Each
 * half has its own 48px bar, so their lines meet, and each scrolls inside itself. `pane` picks
 * the pane open on load.
 *
 * The session's bar says where the work happens (the repository, the branch and the branch it
 * goes into) and holds the pull request with its state, Replay, the thread's menu with the
 * transcript views, and the control that shuts and opens the pane. The transcript and the pane
 * lead to each other: a card or a link in the transcript brings up its pane, a comment in Checks
 * opens its line in Changes, and Fix with Tandem and Ask Tandem to fix write the request into
 * the composer.
 *
 * The block opens at rest, on an approval: Allow once is the screen's filled button. Replay
 * plays the newest turn again from the start, and it stops at the approval again.
 */
export default function AgentCode({ pane: initial = 'changes' }: { pane?: Pane }) {
  const sidebarId = useId();
  const paneId = useId();
  const main = useRef<HTMLElement>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mode, setMode] = useState<Mode>('code');
  const [groups, setGroups] = useState({ chat: chatGroups, code: codeGroups });
  const [openIds, setOpenIds] = useState<Record<Mode, string | null>>({
    chat: null,
    code: OPEN_SESSION,
  });
  /** The group whose `+` started the new thread; without one it goes to Recents. */
  const [newIn, setNewIn] = useState<string>();
  const [view, setView] = useState<TranscriptView>('normal');
  const [pane, setPane] = useState<Pane>(initial);
  const [paneOpen, setPaneOpen] = useState(true);
  const [reveal, setReveal] = useState<Reveal>();
  const ids = useRef(0);

  const openId = openIds[mode];
  const group = groups[mode].find((item) => item.threads.some((thread) => thread.id === openId));
  const thread = group?.threads.find((item) => item.id === openId);
  /** The pane belongs to the session it shows the work of. */
  const here = thread?.id === OPEN_SESSION;
  const paneShown = here && paneOpen ? pane : null;

  const changeThread = (id: string, change: (thread: Thread) => Thread) =>
    setGroups((current) => ({ ...current, [mode]: mapThread(current[mode], id, change) }));

  const session = useSession({
    turns: thread?.turns ?? [],
    onChange: (change: (turns: Turn[]) => Turn[]) =>
      openId && changeThread(openId, (item) => ({ ...item, turns: change(item.turns) })),
    reply: fallback,
  });

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

  // ponytail: the kit pins the log to its newest line when the turns change, not when a font
  // that lands late rewraps them, so a cold load ends a line short; it is pinned once more here
  // when the fonts are in. A ResizeObserver in the kit's Session is the upgrade.
  useEffect(() => {
    void document.fonts?.ready.then(() =>
      main.current
        ?.querySelector('[role="log"]')
        ?.parentElement?.scrollIntoView?.({ block: 'end' }),
    );
  }, []);

  const nextId = () => `new-${(ids.current += 1)}`;

  const togglePane = (target: Pane) => {
    setPaneOpen(paneShown !== target);
    setPane(target);
  };

  /** Writes a request into the composer, for Ines to send as it is or change first. */
  const ask = (text: string) => {
    const field = main.current?.querySelector('textarea');
    if (!field) return;
    // ponytail: the kit's Session keeps the composer's draft to itself, so the words are put in
    // the way a paste is, through the field; a `draft` prop on Session once the kit has one.
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set?.call(field, text);
    field.dispatchEvent(new Event('input', { bubbles: true }));
    // After the pane has put the focus back on its own row.
    window.setTimeout(() => field.focus());
  };

  /**
   * Opening a thread reads it. One that was still working goes on from where it is; the one left
   * behind ends its run without a mark, so back there its turn is simply finished.
   */
  const open = (id: string) => {
    session.leave();
    setOpenIds({ ...openIds, [mode]: id });
    const target = groups[mode].flatMap((item) => item.threads).find((item) => item.id === id);
    if (target?.state === 'unread' || target?.state === 'working') {
      changeThread(id, (item) => ({ ...item, state: undefined }));
    }
    const last = target?.turns.findLast((turn) => turn.role === 'agent');
    if (target?.state === 'working' && last) session.start(last.id, HEAD_START);
  };

  const startNew = (groupId?: string) => {
    session.leave();
    setNewIn(groupId);
    setOpenIds({ ...openIds, [mode]: null });
  };

  /** The first message of a new thread: it takes its name from it and joins its group. */
  const begin = (text: string) => {
    const id = nextId();
    const reply = fallback(nextId());
    const created: Thread = {
      id,
      title: text.length > 32 ? `${text.slice(0, 32).trimEnd()}…` : text,
      turns: [{ id: nextId(), role: 'user', text }, reply],
    };
    setGroups((current) => ({
      ...current,
      [mode]: current[mode].map((item) =>
        (newIn ? item.id === newIn : item.fixed)
          ? { ...item, threads: [created, ...item.threads] }
          : item,
      ),
    }));
    setOpenIds({ ...openIds, [mode]: id });
    session.start(reply.id);
  };

  /** Replay: the newest turn as it was written (its approval unanswered again), from the start. */
  const replay = () => {
    const written = WRITTEN.get(thread?.turns.findLast((turn) => turn.role === 'agent')?.id ?? '');
    if (thread && written) {
      changeThread(thread.id, (item) => ({
        ...item,
        turns: item.turns.map((turn) => (turn.id === written.id ? written : turn)),
      }));
    }
    session.replay();
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
        mode={mode}
        onModeChange={(next) => {
          session.leave();
          setNewIn(undefined);
          setMode(next);
        }}
        groups={groups[mode]}
        openId={openId}
        workingId={session.running ? (openId ?? undefined) : undefined}
        onOpen={open}
        onNew={startNew}
      />

      <div className="bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 flex min-w-0 flex-1 overflow-hidden">
        {/* The kit's screen-reader-only labels are absolute with no positioned parent, so in a long
            transcript they fall outside the scroller and make the window scroll. Positioned and
            clipped here, they stay in the session's half. */}
        <main ref={main} className="relative flex min-w-0 flex-1 flex-col overflow-clip">
          <TopBar
            sidebarId={sidebarId}
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            crumbs={
              here && group
                ? [group.label, `${PULL_REQUEST.head} → ${PULL_REQUEST.base}`]
                : thread && group
                  ? [group.label, thread.title]
                  : [
                      ...groups[mode].filter((item) => item.id === newIn).map((item) => item.label),
                      `New ${NOUN[mode]}`,
                    ]
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
                <IconAction label="Replay" icon={RiRestartLine} side="bottom" onClick={replay} />
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
                  <ChatTools />
                ) : (
                  <CodeTools defaultPermission={here ? permissions[1] : undefined} />
                )
              }
              model={<ModelMenu models={models} efforts={efforts} />}
              onAnswer={(turnId, stepId, answer) => {
                session.answer(turnId, stepId, answer);
                // The thread no longer waits for you.
                changeThread(thread.id, (item) => ({ ...item, state: undefined }));
              }}
            />
          ) : (
            <Home key={mode} mode={mode} onSend={begin} />
          )}
        </main>

        {paneShown && (
          <CodePane
            id={paneId}
            pane={paneShown}
            onPaneChange={setPane}
            reveal={reveal}
            onAsk={ask}
          />
        )}
      </div>
    </div>
  );
}

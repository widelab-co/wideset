import { RiRestartLine } from '@remixicon/react';
import { Button } from '@wideset/react';
import { useId, useRef, useState } from 'react';

import { ChatTools } from './chat-tools';
import { CodeTools } from './code-tools';
import {
  account,
  chatGroups,
  codeGroups,
  efforts,
  fallback,
  launchDocument,
  models,
  OPEN_CHAT,
  product,
  workspace,
} from './data';
import { DocumentCard } from './document-card';
import { DocumentPane } from './document-pane';
import { Home } from './home';
import type { Mode, Thread, ThreadGroup, TranscriptView, Turn } from './model';
import { ModelMenu } from './model-menu';
import { Session } from './session';
import { AgentSidebar } from './sidebar';
import { ThreadMenu } from './thread-menu';
import { TopBar } from './top-bar';
import { useSession } from './use-session';

/** A thread that is still working when it is opened has been at it for a moment already. */
const HEAD_START = 3000;

const NOUN: Record<Mode, string> = { chat: 'chat', code: 'session' };

const mapThread = (groups: ThreadGroup[], id: string, change: (thread: Thread) => Thread) =>
  groups.map((group) => ({
    ...group,
    threads: group.threads.map((thread) => (thread.id === id ? change(thread) : thread)),
  }));

/**
 * Agent chat (Inset direction): Tandem in Chat mode. The sidebar on the grey frame holds the
 * mode switch and the chats in their projects. One raised card holds the rest: the open chat with
 * its transcript and composer, and, behind a vertical line in the same card, the document Tandem
 * wrote. Each half has its own 48px bar, so their lines meet, and each scrolls inside itself.
 * `screen="home"` opens on a new chat instead. The Chat | Code switch works: Code lists the
 * sessions by repository and starts on its own new-session screen.
 *
 * The block opens at rest. Replay in the top bar plays the newest turn again from the start;
 * Stop (or Esc) cuts it where it is, and a message sent meanwhile waits as Queued.
 */
export default function AgentChat({ screen = 'chat' }: { screen?: 'chat' | 'home' }) {
  const sidebarId = useId();
  const paneId = useId();
  const [collapsed, setCollapsed] = useState(false);
  const [mode, setMode] = useState<Mode>('chat');
  const [groups, setGroups] = useState({ chat: chatGroups, code: codeGroups });
  const [openIds, setOpenIds] = useState<Record<Mode, string | null>>({
    chat: screen === 'chat' ? OPEN_CHAT : null,
    code: null,
  });
  /** The group whose `+` started the new thread; without one it goes to Recents. */
  const [newIn, setNewIn] = useState<string>();
  const [view, setView] = useState<TranscriptView>('normal');
  /** The document version open in the pane, counted from 0; null while the pane is closed. */
  const [paneVersion, setPaneVersion] = useState<number | null>(screen === 'chat' ? 1 : null);
  const ids = useRef(0);

  const openId = openIds[mode];
  const group = groups[mode].find((item) => item.threads.some((thread) => thread.id === openId));
  const thread = group?.threads.find((item) => item.id === openId);

  const changeThread = (id: string, change: (thread: Thread) => Thread) =>
    setGroups((current) => ({ ...current, [mode]: mapThread(current[mode], id, change) }));

  const session = useSession({
    turns: thread?.turns ?? [],
    onChange: (change: (turns: Turn[]) => Turn[]) =>
      openId && changeThread(openId, (item) => ({ ...item, turns: change(item.turns) })),
    reply: fallback,
  });

  /* The document belongs to the launch chat. A version is there once its step has run. */
  const versions = launchDocument.versions.filter(({ step }) => {
    const status = session.steps.find((item) => item.id === step)?.status;
    return !step || status === 'running' || status === 'done';
  });
  const writing = session.steps.find((item) => item.id === versions.at(-1)?.step);
  const progress = writing?.status === 'running' ? writing.progress : undefined;
  /** While a version is being written the pane shows that one. */
  const paneShown =
    thread?.id !== OPEN_CHAT || paneVersion === null
      ? null
      : progress !== undefined
        ? versions.length - 1
        : Math.min(paneVersion, versions.length - 1);

  const nextId = () => `new-${(ids.current += 1)}`;

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

  const card = (name: string) => {
    const index = launchDocument.versions.findIndex((version) => version.card === name);
    return (
      <DocumentCard
        title={launchDocument.title}
        version={index + 1}
        open={paneShown === index}
        paneId={paneId}
        onToggle={() => setPaneVersion(paneShown === index ? null : index)}
      />
    );
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
        <main className="flex min-w-0 flex-1 flex-col">
          <TopBar
            sidebarId={sidebarId}
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            crumbs={
              thread && group
                ? [group.label, thread.title]
                : [
                    ...groups[mode].filter((item) => item.id === newIn).map((item) => item.label),
                    `New ${NOUN[mode]}`,
                  ]
            }
          >
            {thread && (
              <>
                <Button variant="secondary" preset="ghost" size="sm" onClick={session.replay}>
                  <Button.Icon icon={RiRestartLine} />
                  Replay
                </Button>
                <Button variant="secondary" preset="border" size="sm">
                  Share
                </Button>
                <ThreadMenu view={view} onViewChange={setView} />
              </>
            )}
          </TopBar>

          {thread ? (
            <Session
              session={session}
              threadId={thread.id}
              agent={product}
              view={view}
              card={card}
              tools={mode === 'chat' ? <ChatTools /> : <CodeTools />}
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

        {paneShown !== null && (
          <DocumentPane
            id={paneId}
            title={launchDocument.title}
            versions={versions.map((version) => version.prose)}
            version={paneShown}
            onVersionChange={setPaneVersion}
            progress={progress}
            onClose={() => setPaneVersion(null)}
          />
        )}
      </div>
    </div>
  );
}

import { RiLayoutRightLine, RiRestartLine } from '@remixicon/react';
import { Button } from '@wideset/react';
import { useId, useRef, useState } from 'react';

import { AnswerActions } from './answer-actions';
import { ChatTools } from './chat-tools';
import type { Citing } from './citation';
import { CodeTools } from './code-tools';
import {
  account,
  chatGroups,
  codeGroups,
  efforts,
  fallback,
  models,
  OPEN_CHAT,
  product,
  workspace,
} from './data';
import { Home } from './home';
import { IconAction } from './icon-action';
import type { AgentTurn, Block, Mode, Thread, ThreadGroup, TranscriptView, Turn } from './model';
import { ModelMenu } from './model-menu';
import { PlanCard } from './plan-card';
import { Report } from './report';
import { PLAN, readStep, REPORT, reportProse, researchPlan, sources } from './research-data';
import { proseText } from './run';
import { Session } from './session';
import { AgentSidebar } from './sidebar';
import { SourcesPane } from './sources-pane';
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
 * Agent research (Inset direction): Tandem in Chat mode, on a finished research run. The sidebar
 * on the grey frame is the same as in every agent block. One raised card holds the rest: the open
 * chat with the question, the plan and the steps of the run folded to a line each, and the
 * report; and, behind a vertical line in the same card, the sources it read.
 *
 * The report is in the transcript and the sources in the pane, not the other way round: the
 * report is the answer, so it goes where an answer goes and where the next message is written,
 * while the sources are evidence to check a sentence against, which works only when both are in
 * view. A citation mark lights its source and a source its marks; the pane can be closed and the
 * report still stands.
 *
 * The block opens at rest. Replay in the top bar plays the run again: the plan, the steps, the
 * sources arriving in the pane one by one, then the report streaming in. Stop (or Esc) keeps
 * what is there and marks the turn stopped. Editing the plan runs the research again.
 */
export default function AgentResearch() {
  const sidebarId = useId();
  const paneId = useId();
  const [collapsed, setCollapsed] = useState(false);
  const [mode, setMode] = useState<Mode>('chat');
  const [groups, setGroups] = useState({ chat: chatGroups, code: codeGroups });
  const [openIds, setOpenIds] = useState<Record<Mode, string | null>>({
    chat: OPEN_CHAT,
    code: null,
  });
  /** The group whose `+` started the new thread; without one it goes to Recents. */
  const [newIn, setNewIn] = useState<string>();
  const [view, setView] = useState<TranscriptView>('normal');
  const [plan, setPlan] = useState(researchPlan);
  const [paneOpen, setPaneOpen] = useState(true);
  /** The source in focus: the one a pointer or the keyboard is on, else the one a press pinned. */
  const [peeked, setPeeked] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const ids = useRef(0);

  const openId = openIds[mode];
  const group = groups[mode].find((item) => item.threads.some((thread) => thread.id === openId));
  const thread = group?.threads.find((item) => item.id === openId);
  const research = thread?.id === OPEN_CHAT;

  const changeThread = (id: string, change: (thread: Thread) => Thread) =>
    setGroups((current) => ({ ...current, [mode]: mapThread(current[mode], id, change) }));

  const session = useSession({
    turns: thread?.turns ?? [],
    onChange: (change: (turns: Turn[]) => Turn[]) =>
      openId && changeThread(openId, (item) => ({ ...item, turns: change(item.turns) })),
    reply: fallback,
  });

  /*
    The report is a text block, so the kit streams it, stops it and counts it as the answer. But
    the kit's prose has no table and no citation mark, so the transcript gets a card in its
    place, and that card draws the same text, as far as it is written, as the report.
  */
  const reportTurn = session.shown.find(
    (turn): turn is AgentTurn =>
      turn.role === 'agent' && turn.blocks.some((block) => block.id === REPORT),
  );
  const report = reportTurn?.blocks.find((block) => block.kind === 'text' && block.id === REPORT);
  const written = report?.kind === 'text' ? report.prose : [];
  const writing = report?.kind === 'text' && Boolean(report.streaming);
  const latest = session.shown.findLast((turn) => turn.role === 'agent') === reportTurn;
  const shown = session.shown.map((turn) =>
    turn.role === 'user'
      ? turn
      : {
          ...turn,
          blocks: turn.blocks.map((block): Block =>
            block.id === REPORT ? { kind: 'card', id: REPORT, card: REPORT } : block,
          ),
        },
  );

  /* A source is in the pane once the step that reads it has begun. */
  const statusOf = (id: string) => session.steps.find((step) => step.id === id)?.status;
  const read = research
    ? sources.filter((source) => ['running', 'done'].includes(statusOf(readStep(source)) ?? ''))
    : [];
  const reading = read.find((source) => statusOf(readStep(source)) === 'running');

  const citing: Citing = {
    active: peeked ?? pinned,
    onPeek: setPeeked,
    onPin: (source) => {
      setPinned(pinned === source ? null : source);
      setPaneOpen(true);
    },
  };

  const replay = () => {
    setPinned(null);
    session.replay();
  };

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

  const card = (name: string) =>
    name === PLAN ? (
      <PlanCard
        steps={plan}
        live={session.running}
        defaultOpen={view === 'verbose'}
        locked={session.running || !latest}
        onChange={(steps) => {
          setPlan(steps);
          replay();
        }}
      />
    ) : (
      <>
        <Report prose={written} live={writing} citing={citing} />
        {/* The kit puts an answer's actions under its text blocks; the report is drawn as a
            card, so it brings its own, once it is whole. */}
        {reportTurn && !writing && !reportTurn.stopped && (
          <div className="-ml-ws-2 mt-ws-5">
            <AnswerActions
              text={() => proseText(reportProse)}
              rating={reportTurn.rating}
              onRate={(rating) => session.rate(reportTurn.id, rating)}
              onRetry={latest ? replay : undefined}
            />
          </div>
        )}
      </>
    );

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
                <Button variant="secondary" preset="ghost" size="sm" onClick={replay}>
                  <Button.Icon icon={RiRestartLine} />
                  Replay
                </Button>
                <Button variant="secondary" preset="border" size="sm">
                  Share
                </Button>
                {research && (
                  <IconAction
                    label={paneOpen ? 'Hide sources' : 'Show sources'}
                    icon={RiLayoutRightLine}
                    side="bottom"
                    aria-expanded={paneOpen}
                    aria-controls={paneId}
                    onClick={() => setPaneOpen(!paneOpen)}
                  />
                )}
                <ThreadMenu view={view} onViewChange={setView} />
              </>
            )}
          </TopBar>

          {thread ? (
            <Session
              session={{ ...session, shown }}
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

        {research && paneOpen && (
          <SourcesPane
            id={paneId}
            sources={read}
            readingId={reading?.id}
            written={written}
            active={citing.active}
            pinned={pinned}
            live={session.running}
            onPeek={setPeeked}
            onClose={() => setPaneOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

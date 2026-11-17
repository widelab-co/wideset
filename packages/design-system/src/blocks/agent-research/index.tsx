import { RiLayoutRightLine, RiRestartLine } from '@remixicon/react';
import { AppShell, Button } from '@wideset/react';
import { useId, useState } from 'react';

import {
  account,
  codeGroups,
  context,
  efforts,
  fallback,
  files,
  models,
  permissions,
  product,
  workspace,
} from './canon';
import { ChatTools } from './chat-tools';
import type { Citing } from './citation';
import { CodeTools } from './code-tools';
import { chatGroups, OPEN_CHAT } from './data';
import { Home } from './home';
import { IconAction } from './icon-action';
import type { TranscriptView } from './model';
import { ModelMenu } from './model-menu';
import { PlanCard } from './plan-card';
import { Report } from './report';
import { PLAN, readStep, REPORT, researchPlan, sources } from './research-data';
import { Session } from './session';
import { AgentSidebar } from './sidebar';
import { SourcesPane } from './sources-pane';
import type { CardRender } from './step-row';
import { ThreadMenu } from './thread-menu';
import { TopBar } from './top-bar';
import { useShell } from './use-shell';

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
  const [view, setView] = useState<TranscriptView>('normal');
  const [plan, setPlan] = useState(researchPlan);
  const [paneOpen, setPaneOpen] = useState(true);
  /** The source in focus: the one a pointer or the keyboard is on, else the one a press pinned. */
  const [peeked, setPeeked] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);

  const shell = useShell({
    chat: chatGroups,
    code: codeGroups,
    mode: 'chat',
    openId: OPEN_CHAT,
    reply: fallback,
    files,
  });
  const { mode, thread, session } = shell;
  const research = thread?.id === OPEN_CHAT;

  /* The research turn, found in the thread as its data holds it: there from the start, while the
     transcript shows only what the clock has reached, and a follow-up does not replace it. */
  const researchTurn = thread?.turns.findLast(
    (turn) =>
      turn.role === 'agent' &&
      turn.blocks.some((block) => block.kind === 'card' && block.card === REPORT),
  );
  /* The report is a card that is written like an answer: this is its text as far as it has come. */
  const reportTurn = session.shown.find((turn) => turn.id === researchTurn?.id);
  const report =
    reportTurn?.role === 'agent'
      ? reportTurn.blocks.find((block) => block.kind === 'card' && block.card === REPORT)
      : undefined;
  const written = report?.kind === 'card' ? (report.prose ?? []) : [];

  /* A source is in the pane once the step that reads it has begun. */
  const statusOf = (id: string) => session.steps.find((step) => step.id === id)?.status;
  const read = research
    ? sources.filter((source) => ['running', 'done'].includes(statusOf(readStep(source)) ?? ''))
    : [];
  const reading = read.find((source) => statusOf(readStep(source)) === 'running');

  const citing: Citing = {
    active: peeked ?? pinned,
    onPeek: setPeeked,
    pinned,
    onPin: (source) => {
      setPinned((current) => (current === source ? null : source));
      setPaneOpen(true);
    },
  };

  const replay = () => {
    setPinned(null);
    // The research turn, not the newest: a follow-up may have come after it.
    session.replay(researchTurn?.id);
  };

  const card: CardRender = (name, of) =>
    name === PLAN ? (
      <PlanCard
        steps={plan}
        live={session.running}
        defaultOpen={view === 'verbose'}
        // Open to change once the run rests, stopped before the report too: a change runs it again.
        locked={session.running}
        onChange={(steps) => {
          setPlan(steps);
          replay();
        }}
      />
    ) : (
      'prose' in of && (
        <Report prose={of.prose ?? []} live={Boolean(of.streaming)} citing={citing} />
      )
    );

  return (
    <AppShell direction="inset">
      <AgentSidebar
        id={sidebarId}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        product={product}
        workspace={workspace}
        account={account}
        {...shell.sidebar}
      />

      <AppShell.Main className="flex-row overflow-hidden">
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar
            sidebarId={sidebarId}
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            crumbs={shell.crumbs}
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
                    onClick={() => setPaneOpen((value) => !value)}
                  />
                )}
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
              tools={
                mode === 'chat' ? (
                  // This chat is a research run, and a follow-up stays one.
                  <ChatTools research={research} onAttach={shell.attach} />
                ) : (
                  <CodeTools permissions={permissions} context={context} onAttach={shell.attach} />
                )
              }
              model={<ModelMenu models={models} efforts={efforts} />}
            />
          ) : (
            <Home
              key={`${mode}-${shell.newIn ?? ''}`}
              mode={mode}
              repository={shell.newIn}
              onSend={shell.begin}
            />
          )}
        </div>

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
      </AppShell.Main>
    </AppShell>
  );
}

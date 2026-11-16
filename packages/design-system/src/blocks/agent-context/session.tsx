// TODO(custom): the session column (the transcript that scrolls; under it the working line, the queue and the composer); Wideset has no chat or transcript layout.
import { cn } from '@wideset/react';
import { type ReactNode, useEffect, useRef } from 'react';

import { Composer } from './composer';
import { MessageQueue } from './message-queue';
import type { TranscriptView } from './model';
import type { CardRender } from './step-row';
import { Transcript } from './transcript';
import type { Session as SessionState } from './use-session';
import { WorkingLine } from './working-line';

/** The transcript and the composer share one reading column, 48rem at most. */
const COLUMN = 'px-ws-11 mx-auto w-full max-w-[48rem]';

type SessionProps = {
  /** The thread in use, from `useSession`. */
  session: SessionState;
  /** Changes with the thread on the page: a new one starts at its newest line. */
  threadId: string;
  /** The agent's name, for the composer's labels. */
  agent: string;
  view: TranscriptView;
  card?: CardRender;
  /** The mode's tools and the model menu, for the composer. */
  tools?: ReactNode;
  model?: ReactNode;
  /** Over the composer, above the working line: what is about what you can send next. */
  notice?: ReactNode;
  /** Why nothing can be sent right now. Send is disabled and says it; the text stays editable. */
  blocked?: string;
};

/**
 * The session under its top bar: the transcript, which alone scrolls and stays on its newest
 * line, and under it, always in reach, whatever is about the next message: a notice of the
 * block's own, the working line (working, or stopped with Continue), the
 * messages that wait their turn, and the composer. Send is the filled button, Stop while a turn
 * runs, and both step back for the way out of whatever waits for you.
 */
export function Session({
  session,
  threadId,
  agent,
  view,
  card,
  tools,
  model,
  notice,
  blocked,
}: SessionProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const log = useRef<HTMLDivElement>(null);
  /** The log is on its newest line and nothing in it was touched: it stays there as it resizes. */
  const pinned = useRef(true);
  const { shown, playback, at, running, stopped, queue } = session;

  const toEnd = () => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
    pinned.current = true;
  };

  // The log follows its newest line: on opening, with each new turn and while one plays.
  useEffect(toEnd, [threadId, shown.length, at, view]);

  // And it stays there when its size changes under it: a font that lands late, a composer that
  // grows, a notice that comes or goes. It lets go only when you do something in it: press a
  // row, which is then left where it is, or scroll away from the end. A scroll that the layout
  // caused is not yours, so it does not count.
  useEffect(() => {
    const box = scroller.current;
    if (typeof ResizeObserver !== 'function' || !box || !log.current) return;
    const observer = new ResizeObserver(() => pinned.current && toEnd());
    observer.observe(box);
    observer.observe(log.current);
    let touched = 0;
    const act = () => {
      touched = performance.now();
    };
    const release = () => {
      act();
      pinned.current = false;
    };
    const follow = () => {
      if (box.scrollHeight - box.scrollTop - box.clientHeight < 2) pinned.current = true;
      else if (performance.now() - touched < 600) pinned.current = false;
    };
    box.addEventListener('pointerdown', release);
    box.addEventListener('keydown', release);
    box.addEventListener('wheel', act, { passive: true });
    box.addEventListener('touchmove', act, { passive: true });
    box.addEventListener('scroll', follow);
    return () => {
      observer.disconnect();
      box.removeEventListener('pointerdown', release);
      box.removeEventListener('keydown', release);
      box.removeEventListener('wheel', act);
      box.removeEventListener('touchmove', act);
      box.removeEventListener('scroll', follow);
    };
  }, []);

  return (
    <>
      {/* `relative`: the transcript's screen-reader text is absolutely placed, and with no
          positioned parent it would fall outside the scroller and stretch the page. */}
      <div ref={scroller} className="relative min-h-0 flex-1 overflow-y-auto">
        <div
          ref={log}
          className={cn(COLUMN, 'pt-ws-5 pb-ws-12 flex min-h-full flex-col justify-end')}
        >
          <Transcript
            turns={shown}
            view={view}
            liveId={playback?.turn.id}
            card={card}
            onAnswer={session.answer}
            onChoose={session.choose}
            onRate={session.rate}
            onRetry={session.replay}
          />
        </div>
      </div>
      <div className={cn(COLUMN, 'gap-ws-5 pb-ws-7 flex shrink-0 flex-col')}>
        {notice}
        {playback ? (
          <WorkingLine state="working" label="Working" seconds={Math.floor(at / 1000)} />
        ) : (
          stopped && (
            <WorkingLine
              state="stopped"
              label={
                stopped.activity
                  ? `Stopped while ${stopped.activity[0].toLowerCase()}${stopped.activity.slice(1)}`
                  : 'Stopped'
              }
              onContinue={session.resume}
            />
          )
        )}
        {queue.length > 0 && (
          <MessageQueue
            messages={queue}
            agent={agent}
            onEdit={session.edit}
            onRemove={session.unqueue}
          />
        )}
        <Composer
          key={threadId}
          label={`Message ${agent}`}
          placeholder={running ? 'Queue a message' : `Reply to ${agent}`}
          draft={session.draft}
          attachments={session.attachments}
          onDetach={session.detach}
          tools={tools}
          model={model}
          running={running}
          primary={!session.awaiting || Boolean(blocked)}
          blocked={blocked}
          onSend={session.send}
          onStop={session.stop}
        />
      </div>
    </>
  );
}

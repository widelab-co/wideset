// TODO(custom): the session column (the transcript that scrolls, the working line and the composer under it); Wideset has no chat or transcript layout.
import { cn } from '@wideset/react';
import { type ReactNode, useEffect, useRef } from 'react';

import { Composer } from './composer';
import type { TranscriptView } from './model';
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
  card?: (card: string) => ReactNode;
  /** The mode's tools and the model menu, for the composer. */
  tools?: ReactNode;
  model?: ReactNode;
  /** Answers an approval; defaults to the session's own. */
  onAnswer?: SessionState['answer'];
};

/**
 * The session under its top bar: the transcript, which alone scrolls and follows its newest
 * line, and under it the working line (only while the agent works) and the composer, always in
 * reach. Send is the filled button, Stop while a turn runs, and both step back for Allow once
 * while an approval waits.
 */
export function Session({
  session,
  threadId,
  agent,
  view,
  card,
  tools,
  model,
  onAnswer = session.answer,
}: SessionProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const { shown, playback, at, running } = session;

  // The log follows its newest line: on opening, with each new turn and while one plays.
  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [threadId, shown.length, at, view]);

  return (
    <>
      <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto">
        <div className={cn(COLUMN, 'pt-ws-5 pb-ws-5 flex min-h-full flex-col justify-end')}>
          <Transcript
            turns={shown}
            view={view}
            liveId={playback?.turn.id}
            card={card}
            onAnswer={onAnswer}
            onRate={session.rate}
            onRetry={session.replay}
          />
        </div>
      </div>
      <div className={cn(COLUMN, 'gap-ws-5 pb-ws-9 flex shrink-0 flex-col')}>
        {playback && (
          <WorkingLine
            activity={playback.activity}
            seconds={Math.floor(at / 1000)}
            waiting={playback.waiting}
          />
        )}
        <Composer
          key={threadId}
          label={`Message ${agent}`}
          placeholder={running ? 'Queue a message' : `Reply to ${agent}`}
          tools={tools}
          model={model}
          running={running}
          primary={!session.awaiting}
          onSend={session.send}
          onStop={session.stop}
        />
      </div>
    </>
  );
}

// TODO(custom): the session column with room for a state (something at the head of the transcript, a notice over the composer, a composer that is paused and says why); the kit's Session has no such slots, its Composer cannot be disabled, and Wideset has no chat or transcript layout.
import { cn } from '@wideset/react';
import { type ReactNode, useEffect, useRef } from 'react';

import { Composer } from './composer';
import type { TranscriptView } from './model';
import { Transcript } from './transcript';
import type { Session } from './use-session';

/** The transcript and the composer share one reading column, 48rem at most. */
const COLUMN = 'px-ws-11 mx-auto w-full max-w-[48rem]';

type SessionColumnProps = {
  /** The thread in use, from `useSession`. */
  session: Session;
  /** The agent's name, for the composer's labels. */
  agent: string;
  view: TranscriptView;
  card?: (card: string) => ReactNode;
  tools?: ReactNode;
  model?: ReactNode;
  /** The agent turn that is not finished though no run plays: held at a step, or still working. */
  heldId?: string;
  /** Above the oldest turn: what stands in for the turns that are no longer there. */
  head?: ReactNode;
  /** Between the transcript and the composer: the working line, a queue, a notice and its way out. */
  notice?: ReactNode;
  /** The agent is working: Send is Stop, and what is sent meanwhile waits. */
  running: boolean;
  /** Whether Send is the screen's filled button (not while the agent waits for one answer). */
  primary: boolean;
  /** Why nothing can be sent right now. The composer is disabled and says it; a draft stays. */
  paused?: string;
  /** What the composer starts with; a new `draftKey` puts it there again. */
  draft?: string;
  draftKey?: number;
  onSend: (text: string) => void;
  onStop: () => void;
};

/**
 * The kit's session column (the transcript, which alone scrolls and follows its newest line, and
 * the composer under it), with the three places a state needs: the head of the transcript, the
 * space over the composer, and the composer itself, paused. A paused composer is a disabled
 * `fieldset`, so Send, the tools and the field are all off at once, natively, and the reason is
 * its legend and its placeholder.
 */
export function SessionColumn({
  session,
  agent,
  view,
  card,
  tools,
  model,
  heldId,
  head,
  notice,
  running,
  primary,
  paused,
  draft,
  draftKey,
  onSend,
  onStop,
}: SessionColumnProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const { shown, playback, at } = session;
  const headed = Boolean(head);

  // The log follows its newest line: on opening, with each new turn and while one plays.
  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [shown.length, at, view, headed]);

  return (
    <>
      <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto">
        <div
          className={cn(COLUMN, 'gap-ws-9 pt-ws-5 pb-ws-5 flex min-h-full flex-col justify-end')}
        >
          {head}
          <Transcript
            turns={shown}
            view={view}
            liveId={playback?.turn.id ?? heldId}
            card={card}
            onAnswer={session.answer}
            onRate={session.rate}
            onRetry={session.replay}
          />
        </div>
      </div>
      <div className={cn(COLUMN, 'gap-ws-5 pb-ws-9 flex shrink-0 flex-col')}>
        {notice}
        <fieldset disabled={Boolean(paused)} className="min-w-0">
          {paused && <legend className="sr-only">{paused}</legend>}
          <Composer
            key={draftKey}
            label={`Message ${agent}`}
            placeholder={paused ?? (running ? 'Queue a message' : `Reply to ${agent}`)}
            defaultValue={draft}
            tools={tools}
            model={model}
            running={running}
            primary={primary}
            onSend={onSend}
            onStop={onStop}
          />
        </fieldset>
      </div>
    </>
  );
}

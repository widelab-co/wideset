import { RiChatNewLine, RiQuestionAnswerLine } from '@remixicon/react';
import { Button } from '@wideset/react';
import { useEffect, useRef, useState } from 'react';

import { Composer } from './composer';
import { answers, conversation, fallback, suggestions, type Turn } from './data';
import { Message } from './message';
import { SuggestedPrompts } from './suggested-prompts';

/** How often a streaming answer grows, in milliseconds, and by how many words and spaces. */
const TICK = 70;
const STEP = 4;

/** An answer in the pieces it streams in: words and the spaces between them. */
const piecesOf = (text: string) => text.split(/(\s+)/);

/** Whether the device asks for less motion; where there is no `matchMedia` (a test), it does not. */
const reducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

type AssistantPanelProps = {
  /** Writes the proposed change to the record. */
  onApply: () => void;
};

/**
 * The assistant beside the record, in its own raised card, 26rem, on the same grey frame and with
 * the same margins and radius as the record's card: its name and "New conversation" in a bar
 * whose line runs level with the record's breadcrumb bar, the conversation, and the composer at
 * the foot. Answers stream in a few
 * words at a time with Stop in the composer (all at once when motion is reduced); a proposed
 * change waits for Apply or Discard. With nothing waiting and nothing streaming, three suggested
 * questions sit above the composer.
 */
export function AssistantPanel({ onApply }: AssistantPanelProps) {
  const [turns, setTurns] = useState<Turn[]>(conversation);
  const [streaming, setStreaming] = useState<{ id: string; shown: number } | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  const streamed = streaming && turns.find((turn) => turn.id === streaming.id);
  const pending = turns.some(
    (turn) => turn.role === 'assistant' && turn.change?.status === 'pending',
  );

  // Grows the streaming answer one step at a time until it is all there.
  useEffect(() => {
    if (!streaming || !streamed) return;
    if (streaming.shown >= piecesOf(streamed.text).length) return setStreaming(null);
    const id = window.setTimeout(
      () => setStreaming({ id: streaming.id, shown: streaming.shown + STEP }),
      TICK,
    );
    return () => window.clearTimeout(id);
  }, [streaming, streamed]);

  // Follows the newest words, on opening too, so a change that waits is in view; and again when
  // the suggestions come back over the composer and take some of the height.
  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [turns.length, streaming?.shown, pending]);

  const update = (id: string, change: (turn: Turn) => Turn) =>
    setTurns((current) => current.map((turn) => (turn.id === id ? change(turn) : turn)));

  const ask = (text: string) => {
    const answer = answers[text] ?? fallback;
    const id = `a${turns.length}`;
    setTurns([
      ...turns,
      { id: `q${turns.length}`, role: 'user', text },
      { id, role: 'assistant', text: answer.text, sources: answer.sources },
    ]);
    setStreaming(reducedMotion() ? null : { id, shown: 0 });
  };

  // Keeps what was written so far, and says that the answer stopped there.
  const stop = () => {
    if (!streaming || !streamed) return;
    const text = piecesOf(streamed.text).slice(0, streaming.shown).join('').trimEnd();
    update(streaming.id, (turn) => ({ ...turn, text, stopped: true }));
    setStreaming(null);
  };

  const decide = (id: string, status: 'applied' | 'discarded') =>
    update(id, (turn) =>
      turn.role === 'assistant' && turn.change
        ? { ...turn, change: { ...turn.change, status } }
        : turn,
    );

  return (
    <aside
      aria-label="Assistant"
      className="bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 flex w-[26rem] shrink-0 flex-col overflow-hidden"
    >
      <header className="h-ws-18 border-ws-static-base px-ws-11 gap-ws-5 flex shrink-0 items-center justify-between border-b">
        <h2 className="typography-label-strong-md text-ws-static-strong gap-ws-5 flex items-center">
          <RiQuestionAnswerLine aria-hidden className="size-ws-9 text-ws-static-subtle" />
          Assistant
        </h2>
        <Button
          variant="secondary"
          preset="border"
          size="sm"
          disabled={turns.length === 0}
          onClick={() => {
            setTurns([]);
            setStreaming(null);
          }}
        >
          <Button.Icon icon={RiChatNewLine} />
          New conversation
        </Button>
      </header>

      <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto">
        {turns.length === 0 ? (
          <div className="gap-ws-3 px-ws-11 pb-ws-9 flex h-full flex-col justify-end">
            <p className="typography-label-strong-md text-ws-static-strong">Ask about this deal</p>
            <p className="typography-body-md text-ws-static-subtle">
              Answers come from its e-mails, calls and notes, with the sources linked. Ask for a
              change and it is proposed here for you to apply.
            </p>
          </div>
        ) : (
          <div
            role="log"
            aria-label="Conversation"
            className="gap-ws-12 px-ws-11 py-ws-11 flex min-h-full flex-col justify-end"
          >
            {turns.map((turn) => (
              <Message
                key={turn.id}
                turn={turn}
                partial={
                  streaming?.id === turn.id
                    ? piecesOf(turn.text).slice(0, streaming.shown).join('')
                    : undefined
                }
                onApply={() => {
                  decide(turn.id, 'applied');
                  onApply();
                }}
                onDiscard={() => decide(turn.id, 'discarded')}
                onRate={(rating) => update(turn.id, (current) => ({ ...current, rating }))}
              />
            ))}
          </div>
        )}
      </div>

      <div className="gap-ws-7 px-ws-11 pb-ws-11 pt-ws-5 flex shrink-0 flex-col">
        {!streaming && !pending && <SuggestedPrompts prompts={suggestions} onPick={ask} />}
        <Composer streaming={Boolean(streaming)} primary={!pending} onSend={ask} onStop={stop} />
      </div>
    </aside>
  );
}

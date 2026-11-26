// TODO(custom): the agent's side of a turn (its thoughts, steps, answer and what it made, then the answer's actions); Wideset has no message or transcript component.
import { cn } from '@wideset/react';

import { AnswerActions } from './answer-actions';
import type { AgentTurn as Turn, ApprovalAnswer, TranscriptView } from './model';
import { ARRIVE } from './motion';
import { Prose } from './prose';
import { QuestionCard } from './question-card';
import { Reasoning } from './reasoning';
import { proseText } from './run';
import { StepGroup } from './step-group';
import { type CardRender, StepRow } from './step-row';

type AgentTurnProps = {
  /** The turn as it shows now: whole, playing, held where it waits, or cut where it was stopped. */
  turn: Turn;
  view: TranscriptView;
  /** It is running: its parts arrive with motion and its actions wait. */
  live: boolean;
  /** The newest answer keeps its actions in view; older ones show them on hover or focus. */
  latest: boolean;
  /** Draws a `card` block, and what a step carries under its detail. */
  card?: CardRender;
  onAnswer: (stepId: string, answer: ApprovalAnswer) => void;
  /** Answers a question with one of its own answers. */
  onChoose: (questionId: string, text: string) => void;
  onRate: (rating?: 'up' | 'down') => void;
  onRetry?: () => void;
};

/**
 * Everything the agent did in one turn, in the order it happened, on the left with no bubble and
 * no avatar: the page is the agent's, and only your messages are set apart. The view decides what
 * starts open: reasoning in Thinking, reasoning and every step in Verbose. The answer's actions
 * come once it is an answer: not while it runs, and not while it is held at something it waits
 * for from you.
 */
export function AgentTurn({
  turn,
  view,
  live,
  latest,
  card,
  onAnswer,
  onChoose,
  onRate,
  onRetry,
}: AgentTurnProps) {
  // What was written: the answer's text, and the text of a card that was written like one.
  const prose = turn.blocks.flatMap((block) =>
    block.kind === 'text' || block.kind === 'card' ? (block.prose ?? []) : [],
  );

  return (
    <article aria-label="Answer" aria-busy={live} className="group/turn gap-ws-2 flex flex-col">
      {turn.blocks.map((block) => {
        switch (block.kind) {
          case 'reasoning':
            return (
              <Reasoning key={block.id} block={block} defaultOpen={view !== 'normal'} live={live} />
            );
          case 'step':
            return (
              <StepRow
                key={block.id}
                step={block}
                defaultOpen={view === 'verbose'}
                live={live}
                card={card}
                onAnswer={onAnswer}
              />
            );
          case 'steps':
            return (
              <StepGroup
                key={block.id}
                block={block}
                defaultOpen={view === 'verbose'}
                live={live}
                card={card}
                onAnswer={onAnswer}
              />
            );
          case 'text':
            return (
              <div key={block.id} className="px-ws-3 py-ws-3">
                <Prose blocks={block.prose} />
              </div>
            );
          case 'card': {
            const drawn = card?.(block.card, block);
            return (
              drawn && (
                <div key={block.id} className={cn('px-ws-3 py-ws-3', live && ARRIVE)}>
                  {drawn}
                </div>
              )
            );
          }
          case 'question':
            // Answered, the question is the text above it and your message under it.
            return (
              block.answer === undefined &&
              !turn.stopped && (
                <div key={block.id} className={cn('px-ws-3 py-ws-3', live && ARRIVE)}>
                  <QuestionCard
                    title={block.title}
                    options={block.options}
                    onAnswer={(text) => onChoose(block.id, text)}
                  />
                </div>
              )
            );
        }
      })}
      {turn.stopped && (
        <p className="typography-caption-md text-ws-static-subtle px-ws-3 py-ws-2">Stopped</p>
      )}
      {!live && !turn.held && prose.length > 0 && (
        <div
          className={cn(
            'px-ws-2 pt-ws-3 transition-opacity duration-(--ws-motion-duration-quick) ease-(--ws-motion-ease-out)',
            !latest && 'opacity-0 group-focus-within/turn:opacity-100 group-hover/turn:opacity-100',
          )}
        >
          <AnswerActions
            text={() => proseText(prose)}
            rating={turn.rating}
            onRate={onRate}
            onRetry={onRetry}
          />
        </div>
      )}
    </article>
  );
}

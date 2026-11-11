// TODO(custom): the agent's side of a turn (its thoughts, steps, answer and what it made, then the answer's actions); Wideset has no message or transcript component.
import { cn } from '@wideset/react';
import type { ReactNode } from 'react';

import { AnswerActions } from './answer-actions';
import type { AgentTurn as Turn, ApprovalAnswer, TranscriptView } from './model';
import { ARRIVE } from './motion';
import { Prose } from './prose';
import { Reasoning } from './reasoning';
import { proseText } from './run';
import { StepGroup } from './step-group';
import { StepRow } from './step-row';

type AgentTurnProps = {
  /** The turn as it shows now: whole, playing or cut where it was stopped. */
  turn: Turn;
  view: TranscriptView;
  /** It is running: its parts arrive with motion and its actions wait. */
  live: boolean;
  /** The newest answer keeps its actions in view; older ones show them on hover or focus. */
  latest: boolean;
  /** Draws a `card` block: the document, the pull request, whatever the block makes. */
  card?: (card: string) => ReactNode;
  onAnswer: (stepId: string, answer: ApprovalAnswer) => void;
  onRate: (rating?: 'up' | 'down') => void;
  onRetry?: () => void;
};

/**
 * Everything the agent did in one turn, in the order it happened, on the left with no bubble and
 * no avatar: the page is the agent's, and only your messages are set apart. The view decides what
 * starts open: reasoning in Thinking, reasoning and every step in Verbose.
 */
export function AgentTurn({
  turn,
  view,
  live,
  latest,
  card,
  onAnswer,
  onRate,
  onRetry,
}: AgentTurnProps) {
  const prose = turn.blocks.flatMap((block) => (block.kind === 'text' ? block.prose : []));

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
                onAnswer={onAnswer}
              />
            );
          case 'text':
            return (
              <div key={block.id} className="px-ws-3 py-ws-3">
                <Prose blocks={block.prose} />
              </div>
            );
          case 'card':
            return (
              <div key={block.id} className={cn('px-ws-3 py-ws-3', live && ARRIVE)}>
                {card?.(block.card)}
              </div>
            );
        }
      })}
      {turn.stopped && (
        <p className="typography-caption-md text-ws-static-subtle px-ws-3 py-ws-2">Stopped</p>
      )}
      {!live && prose.length > 0 && (
        <div
          className={cn(
            'px-ws-2 transition-opacity duration-(--ws-motion-duration-quick) ease-(--ws-motion-ease-out)',
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

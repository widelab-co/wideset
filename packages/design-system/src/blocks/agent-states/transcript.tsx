// TODO(custom): the transcript of a thread (your messages, the agent's turns and the dividers between them, in one of three views); Wideset has no message or transcript component.
import { AgentTurn } from './agent-turn';
import { Divider } from './divider';
import type { ApprovalAnswer, TranscriptView, Turn } from './model';
import type { CardRender } from './step-row';
import { UserMessage } from './user-message';

type TranscriptProps = {
  /** The turns as they show now (see `showTurn`). */
  turns: Turn[];
  view: TranscriptView;
  /** The agent turn that is running, if one is. */
  liveId?: string;
  card?: CardRender;
  onAnswer: (turnId: string, stepId: string, answer: ApprovalAnswer) => void;
  onChoose: (turnId: string, questionId: string, text: string) => void;
  onRate: (turnId: string, rating?: 'up' | 'down') => void;
  /** Runs the newest answer again. */
  onRetry: () => void;
};

/**
 * A thread as a log, oldest first. It knows nothing of Chat or Code: it draws the turn model, and
 * hands what is the block's own (`card` blocks, what a step carries) back to the block that owns
 * it. Changing the view starts every fold from that view's default, so what was opened by hand
 * does not linger.
 */
export function Transcript({
  turns,
  view,
  liveId,
  card,
  onAnswer,
  onChoose,
  onRate,
  onRetry,
}: TranscriptProps) {
  const latest = turns.findLast((turn) => turn.role === 'agent')?.id;

  return (
    <div key={view} role="log" aria-label="Transcript" className="gap-ws-9 flex flex-col">
      {turns.map((turn) =>
        turn.role === 'user' ? (
          <UserMessage key={turn.id} turn={turn} />
        ) : turn.role === 'divider' ? (
          <Divider key={turn.id} turn={turn} />
        ) : (
          <AgentTurn
            key={turn.id}
            turn={turn}
            view={view}
            live={turn.id === liveId}
            latest={turn.id === latest}
            card={card}
            onAnswer={(stepId, answer) => onAnswer(turn.id, stepId, answer)}
            onChoose={(questionId, text) => onChoose(turn.id, questionId, text)}
            onRate={(rating) => onRate(turn.id, rating)}
            onRetry={turn.id === latest ? onRetry : undefined}
          />
        ),
      )}
    </div>
  );
}

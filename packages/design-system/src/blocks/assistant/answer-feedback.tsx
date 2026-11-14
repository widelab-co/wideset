import { RiThumbDownFill, RiThumbDownLine, RiThumbUpFill, RiThumbUpLine } from '@remixicon/react';
import { IconButton } from '@wideset/react';

type AnswerFeedbackProps = {
  rating?: 'up' | 'down';
  onRate: (rating?: 'up' | 'down') => void;
};

/**
 * A quiet thumbs up and down under an answer: ghost, grey, the smallest size, so it is there to
 * use and never competes with the answer. A second press takes the rating back.
 */
export function AnswerFeedback({ rating, onRate }: AnswerFeedbackProps) {
  return (
    <div role="group" aria-label="Rate this answer" className="gap-ws-2 -ml-ws-3 flex">
      <IconButton
        icon={rating === 'up' ? RiThumbUpFill : RiThumbUpLine}
        variant="secondary"
        preset="ghost"
        size="xs"
        aria-label="Helpful"
        aria-pressed={rating === 'up'}
        onClick={() => onRate(rating === 'up' ? undefined : 'up')}
      />
      <IconButton
        icon={rating === 'down' ? RiThumbDownFill : RiThumbDownLine}
        variant="secondary"
        preset="ghost"
        size="xs"
        aria-label="Not helpful"
        aria-pressed={rating === 'down'}
        onClick={() => onRate(rating === 'down' ? undefined : 'down')}
      />
    </div>
  );
}

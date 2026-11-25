import {
  RiRestartLine,
  RiThumbDownFill,
  RiThumbDownLine,
  RiThumbUpFill,
  RiThumbUpLine,
} from '@remixicon/react';

import { CopyButton } from './copy-button';
import { IconAction } from './icon-action';

/** The icons are grey until used: a thumb that was given takes the strong colour and its fill. */
const QUIET = 'text-ws-static-subtle';

type AnswerActionsProps = {
  /** The answer as plain text, for Copy. */
  text: () => string;
  rating?: 'up' | 'down';
  onRate: (rating?: 'up' | 'down') => void;
  /** Runs the turn again; only the newest answer offers it. */
  onRetry?: () => void;
};

/**
 * What can be done with an answer, under it: Copy, Retry, and a thumb up or down. Ghost, grey,
 * the smallest size, each named by a tooltip, so they are there to use and never compete with
 * the answer. A second press on a thumb takes the rating back.
 */
export function AnswerActions({ text, rating, onRate, onRetry }: AnswerActionsProps) {
  return (
    <div role="group" aria-label="Answer actions" className="gap-ws-2 flex">
      <CopyButton text={text} quiet />
      {onRetry && (
        <IconAction
          label="Retry"
          icon={RiRestartLine}
          iconClassName={QUIET}
          size="xs"
          onClick={onRetry}
        />
      )}
      <IconAction
        label="Helpful"
        icon={rating === 'up' ? RiThumbUpFill : RiThumbUpLine}
        iconClassName={rating === 'up' ? undefined : QUIET}
        size="xs"
        aria-pressed={rating === 'up'}
        onClick={() => onRate(rating === 'up' ? undefined : 'up')}
      />
      <IconAction
        label="Not helpful"
        icon={rating === 'down' ? RiThumbDownFill : RiThumbDownLine}
        iconClassName={rating === 'down' ? undefined : QUIET}
        size="xs"
        aria-pressed={rating === 'down'}
        onClick={() => onRate(rating === 'down' ? undefined : 'down')}
      />
    </div>
  );
}

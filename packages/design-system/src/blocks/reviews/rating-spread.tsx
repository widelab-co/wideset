// TODO(custom): bar list (label, a 4px bar, the share); no BarList in Wideset.
import { cn } from '@wideset/react';

import type { Rating } from './data';
import { formatShare } from './format';

type RatingSpreadProps = {
  /** How many reviews gave each rating. */
  counts: Record<Rating, number>;
  /** The ratings in the order to list them: five stars first. */
  ratings: Rating[];
  className?: string;
};

/**
 * How the ratings spread, from five stars to one: each row is a rating, its share of all reviews
 * as a bar on a track, and the share in figures. The label is words, not stars: the stars are the
 * average's visual and the bar is this row's. Bars are neutral and 4px, the thickness and track
 * of `ProgressBar`, and a low rating's bar is the same grey as a high one's.
 */
export function RatingSpread({ counts, ratings, className }: RatingSpreadProps) {
  const total = ratings.reduce((sum, rating) => sum + counts[rating], 0) || 1;

  return (
    <ul aria-label="Reviews by rating" className={cn('gap-ws-5 flex flex-col', className)}>
      {ratings.map((rating) => {
        const share = counts[rating] / total;
        return (
          <li key={rating} className="typography-label-sm gap-ws-7 flex items-center">
            <span className="text-ws-static-base w-[3.25rem] shrink-0">
              {rating} {rating === 1 ? 'star' : 'stars'}
            </span>
            <svg aria-hidden className="h-ws-3 min-w-0 flex-1">
              <rect
                width="100%"
                height="100%"
                rx="2"
                className="fill-(--ws-dynamic-stroke-secondary-default)"
              />
              <rect
                width={`${share * 100}%`}
                height="100%"
                rx="2"
                className="fill-(--ws-semantic-stroke-neutral)"
              />
            </svg>
            <span className="text-ws-static-strong w-[2.5rem] shrink-0 text-right tabular-nums">
              {formatShare(share)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

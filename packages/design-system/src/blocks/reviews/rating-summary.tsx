import { average, RATINGS, spread, total } from './data';
import { formatAverage, formatCount } from './format';
import { RatingSpread } from './rating-spread';
import { StarRating } from './star-rating';

/**
 * The summary over the list: the average on the left, the spread beside it, in the list's own two
 * columns so the figure stands over the customers and the bars over the reviews. One visual per
 * value: the average has its stars, each share has its bar, and nothing is boxed.
 */
export function RatingSummary({ className }: { className?: string }) {
  return (
    <section aria-label="Rating summary" className={className}>
      <div className="gap-ws-3 flex flex-col">
        <div className="gap-ws-7 flex items-center">
          <p className="typography-subtitle-md text-ws-static-strong tabular-nums">
            {formatAverage(average)}
          </p>
          <StarRating value={average} size="md" />
        </div>
        <p className="typography-body-md text-ws-static-subtle tabular-nums">
          from {formatCount(total)} reviews
        </p>
      </div>
      <RatingSpread counts={spread} ratings={RATINGS} className="max-w-[28rem]" />
    </section>
  );
}

// TODO(custom): review (who wrote it and after which deal, the stars, a title, the text, the reply); Wideset has no Review or Comment component.
import { RiHandCoinLine, RiReplyLine } from '@remixicon/react';
import { Button } from '@wideset/react';
import { useId, useState } from 'react';

import type { Review } from './data';
import { formatDate } from './format';
import { ReplyForm } from './reply-form';
import { ReviewMenu } from './review-menu';
import { ReviewReply } from './review-reply';
import { StarRating } from './star-rating';

type ReviewItemProps = {
  review: Review;
  /** The row's columns: the same grid as the summary over the list. */
  className?: string;
  onReply: (text: string) => void;
  onCopyLink: () => void;
  onReport: () => void;
};

/**
 * One review, on the page's white with a line above it. Who wrote it and the deal it followed
 * stand in the left column; the review itself reads in the right one: the stars and the day, a
 * one-line title, the text. Under it either the company's reply, or Reply, which opens the reply
 * field in its place. Every rating is drawn the same: a low one is not painted red.
 */
export function ReviewItem({ review, className, onReply, onCopyLink, onReport }: ReviewItemProps) {
  const titleId = useId();
  const [replying, setReplying] = useState(false);

  return (
    <article id={review.id} aria-labelledby={titleId} className={className}>
      <div className="gap-ws-1 flex min-w-0 flex-col">
        <p className="typography-label-strong-sm text-ws-static-strong">{review.customer}</p>
        <p className="typography-label-sm text-ws-static-subtle">
          {review.person}, {review.role}
        </p>
        <a
          href="#deal"
          className="typography-label-sm text-ws-static-subtle gap-ws-3 hover:text-ws-static-strong rounded-ws-control-sm focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default mt-ws-3 flex items-center self-start hover:underline"
        >
          <RiHandCoinLine aria-hidden="true" className="size-ws-9 shrink-0" />
          {review.deal}
        </a>
      </div>

      <div className="gap-ws-7 flex min-w-0 flex-col">
        <div className="gap-ws-3 flex flex-col">
          {/* The ⋯ is pulled out of the line's height, so the stars sit level with the name. */}
          <div className="h-ws-11 gap-ws-7 flex items-center">
            <StarRating value={review.rating} />
            <time
              dateTime={review.date}
              className="typography-label-sm text-ws-static-subtle tabular-nums"
            >
              {formatDate(review.date)}
            </time>
            <ReviewMenu
              customer={review.customer}
              onCopyLink={onCopyLink}
              onReport={onReport}
              className="-my-ws-4 ml-auto"
            />
          </div>
          <h2 id={titleId} className="typography-label-strong-md text-ws-static-strong">
            {review.title}
          </h2>
          <p className="typography-body-md text-ws-static-base max-w-[40rem]">{review.text}</p>
        </div>

        {review.reply ? (
          <ReviewReply reply={review.reply} />
        ) : replying ? (
          <ReplyForm
            to={review.person}
            onCancel={() => setReplying(false)}
            onReply={(text) => {
              onReply(text);
              setReplying(false);
            }}
          />
        ) : (
          <Button
            size="sm"
            variant="secondary"
            preset="ghost"
            className="-my-ws-4 -ml-ws-6 self-start"
            onClick={() => setReplying(true)}
          >
            <Button.Icon icon={RiReplyLine} />
            Reply
          </Button>
        )}
      </div>
    </article>
  );
}

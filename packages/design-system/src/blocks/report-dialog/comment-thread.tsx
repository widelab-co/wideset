// TODO(custom): comment thread (author, time, text, a menu each); no Comment component in Wideset.
import { Avatar } from '@wideset/react';

import type { Comment } from './data';
import { formatDateTime, formatWhen } from './format';
import { HiddenNotice } from './hidden-notice';
import { ItemMenu } from './item-menu';

type CommentThreadProps = {
  comments: Comment[];
  /** What the signed-in user has reported: folded away for them unless shown. */
  reported: string[];
  shown: string[];
  onShow: (id: string) => void;
  onReport: (comment: Comment) => void;
  onCopyLink: (id: string) => void;
};

/**
 * A post's comments, oldest first: who wrote, when, and what they said, one size below the post
 * (a 24px avatar) so the thread reads as belonging to it. Each comment's menu shows on hover or
 * focus, so a quiet thread is not a column of ⋯. A comment the reader reported folds into one
 * line until they choose to see it.
 */
export function CommentThread({
  comments,
  reported,
  shown,
  onShow,
  onReport,
  onCopyLink,
}: CommentThreadProps) {
  return (
    <ol aria-label="Comments" className="gap-ws-7 flex flex-col">
      {comments.map((comment) => {
        const isReported = reported.includes(comment.id);
        const owner = `${comment.author.name}’s comment`;

        if (isReported && !shown.includes(comment.id)) {
          return (
            <li key={comment.id}>
              <HiddenNotice gutterClassName="w-ws-12" onShow={() => onShow(comment.id)}>
                {`You reported ${owner}.`}
              </HiddenNotice>
            </li>
          );
        }

        return (
          <li key={comment.id} id={comment.id} className="group/comment gap-ws-5 flex">
            <Avatar
              size="sm"
              initials={comment.author.initials}
              color={comment.author.color}
              aria-hidden
            />
            <div className="gap-ws-1 flex min-w-0 flex-1 flex-col">
              <div className="gap-ws-5 flex items-center">
                <p className="gap-ws-5 flex min-w-0 flex-1 items-baseline">
                  <span className="typography-label-strong-sm text-ws-static-strong">
                    {comment.author.name}
                  </span>
                  <span className="typography-label-sm text-ws-static-subtle">
                    <time dateTime={comment.at} title={formatDateTime(comment.at)}>
                      {formatWhen(comment.at)}
                    </time>
                    {isReported && ' · Reported by you'}
                  </span>
                </p>
                <ItemMenu
                  label={owner}
                  onCopyLink={() => onCopyLink(comment.id)}
                  onReport={() => onReport(comment)}
                  className="opacity-0 group-focus-within/comment:opacity-100 group-hover/comment:opacity-100 data-[state=open]:opacity-100"
                />
              </div>
              <p className="typography-body-md text-ws-static-base">{comment.text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

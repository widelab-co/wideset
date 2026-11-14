// TODO(custom): feed post (author, time, text, a menu, comments); Wideset has no Post or feed item component.
import { useId } from 'react';

import { CommentThread } from './comment-thread';
import type { Comment, Post } from './data';
import { formatDateTime, formatWhen } from './format';
import { HiddenNotice } from './hidden-notice';
import { ItemMenu } from './item-menu';
import { PersonAvatar } from './person-avatar';

type FeedPostProps = {
  post: Post;
  /** Posts and comments the signed-in user reported: folded away for them unless shown. */
  reported: string[];
  shown: string[];
  onShow: (id: string) => void;
  onReport: (item: Post | Comment, kind: 'post' | 'comment') => void;
  onCopyLink: (id: string) => void;
};

/**
 * One post in the feed, on the page's white with a line above it, never in a card. The avatar
 * holds a gutter and everything else hangs beside it: who and when with the menu on the first
 * line, the text, then the comments. A post the reader reported folds into one line, as a
 * comment does.
 */
export function FeedPost({ post, reported, shown, onShow, onReport, onCopyLink }: FeedPostProps) {
  const titleId = useId();
  const { author } = post;
  const owner = `${author.name}’s post`;

  if (reported.includes(post.id) && !shown.includes(post.id)) {
    return (
      <article aria-label={owner} className="border-ws-static-subtle py-ws-12 border-t">
        <HiddenNotice gutterClassName="w-ws-14" onShow={() => onShow(post.id)}>
          {`You reported ${owner}.`}
        </HiddenNotice>
      </article>
    );
  }

  return (
    <article
      id={post.id}
      aria-labelledby={titleId}
      className="border-ws-static-subtle gap-ws-7 py-ws-12 flex border-t"
    >
      <PersonAvatar
        name={author.name}
        initials={author.initials}
        color={author.color}
        aria-hidden
      />
      <div className="gap-ws-5 flex min-w-0 flex-1 flex-col">
        <header className="h-ws-14 gap-ws-5 flex items-center">
          <p
            id={titleId}
            className="typography-label-sm text-ws-static-subtle min-w-0 flex-1 truncate"
          >
            <span className="typography-label-strong-sm text-ws-static-strong">{author.name}</span>{' '}
            {author.role}
            {' · '}
            <time dateTime={post.at} title={formatDateTime(post.at)}>
              {formatWhen(post.at)}
            </time>
            {reported.includes(post.id) && ' · Reported by you'}
          </p>
          <ItemMenu
            label={owner}
            onCopyLink={() => onCopyLink(post.id)}
            onReport={() => onReport(post, 'post')}
          />
        </header>
        <p className="typography-body-md text-ws-static-base">{post.text}</p>
        {post.comments.length > 0 && (
          <div className="pt-ws-5">
            <CommentThread
              comments={post.comments}
              reported={reported}
              shown={shown}
              onShow={onShow}
              onReport={(comment) => onReport(comment, 'comment')}
              onCopyLink={onCopyLink}
            />
          </div>
        )}
      </div>
    </article>
  );
}

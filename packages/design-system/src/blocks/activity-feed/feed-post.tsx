// TODO(custom): feed post (author, time, text, what it is about, actions, comments); Wideset has no Post or feed item component.
import { RiPushpinLine, RiTrophyLine } from '@remixicon/react';
import { Avatar, Button, Card } from '@wideset/react';
import { useEffect, useId, useRef, useState } from 'react';

import { CommentField } from './comment-field';
import { CommentThread } from './comment-thread';
import type { Post } from './data';
import { formatDateTime, formatWhen } from './format';
import { PersonAvatar } from './person-avatar';
import { PostActions } from './post-actions';
import { PostMenu } from './post-menu';
import { RecordLink } from './record-link';

/** How many comments a post shows before "View all". */
const SHOWN = 2;

type FeedPostProps = {
  post: Post;
  onLike: () => void;
  onComment: (text: string) => void;
  onFollow: () => void;
  onShare: () => void;
  onCopyLink: () => void;
  onReport: () => void;
};

/**
 * One post in the feed, in its own bordered card, so each post reads as one object and the feed
 * as a stack of them. The avatar holds a gutter and everything else hangs in one column beside
 * it: who and when on the first line, the text, what it is about, the actions, then the comments.
 *
 * An event Orbit reports (a deal won) is the same row made quieter: an icon for an avatar, one
 * sentence instead of a text, no menu and no Share. A pinned announcement says so above.
 */
export function FeedPost({
  post,
  onLike,
  onComment,
  onFollow,
  onShare,
  onCopyLink,
  onReport,
}: FeedPostProps) {
  const { author, comments } = post;
  const event = post.kind === 'event';
  const titleId = useId();
  const field = useRef<HTMLInputElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const earlier = expanded ? 0 : Math.max(0, comments.length - SHOWN);

  // A post with comments already shows the field: Comment puts the caret in it. On a quiet post
  // Comment brings the field in first, and the caret follows once it is on the page.
  const comment = () => {
    setCommenting(true);
    field.current?.focus();
  };
  useEffect(() => {
    if (commenting) field.current?.focus();
  }, [commenting]);

  return (
    <article id={post.id} aria-labelledby={titleId}>
      <Card>
        {/* Card.Content keeps 10px free on the right for a scrollbar; the padding gives it back,
            so the post sits 20px from both sides. w-0 with min-w-full pins the width, so the
            truncated lines truncate instead of widening the scroll area. */}
        <Card.Content contentClassName="pr-ws-6 w-0 min-w-full gap-ws-5 flex flex-col">
          {post.kind === 'announcement' && (
            <p className="typography-label-sm text-ws-static-subtle gap-ws-7 flex items-center">
              {/* The pin sits in the avatars' gutter, the words on the text's edge. */}
              <span className="w-ws-14 flex shrink-0 justify-center">
                <RiPushpinLine aria-hidden="true" className="size-ws-9" />
              </span>
              Pinned announcement
            </p>
          )}

          <div className="gap-ws-7 flex">
            {event ? (
              <Avatar icon={<RiTrophyLine />} aria-hidden />
            ) : (
              <PersonAvatar
                name={author.name}
                initials={author.initials}
                color={author.color}
                aria-hidden
              />
            )}

            <div className="flex min-w-0 flex-1 flex-col">
              <header className="h-ws-14 gap-ws-5 flex items-center">
                <p
                  id={titleId}
                  className="typography-label-sm text-ws-static-subtle min-w-0 flex-1 truncate"
                >
                  <span className="typography-label-strong-sm text-ws-static-strong">
                    {author.name}
                  </span>{' '}
                  {event ? <span className="text-ws-static-base">{post.text}</span> : author.role}
                  {' · '}
                  <time dateTime={post.at} title={formatDateTime(post.at)}>
                    {formatWhen(post.at)}
                  </time>
                  {post.audience && ` · ${post.audience}`}
                </p>
                {!event && (
                  <PostMenu
                    author={author.name}
                    following={post.following}
                    onFollow={onFollow}
                    onCopyLink={onCopyLink}
                    onReport={onReport}
                  />
                )}
              </header>

              <div className="gap-ws-5 flex flex-col">
                {!event && <p className="typography-body-md text-ws-static-base">{post.text}</p>}
                {post.subject && <RecordLink subject={post.subject} />}
                <PostActions
                  likes={post.likes}
                  liked={post.liked}
                  onLike={onLike}
                  onComment={comment}
                  onShare={event ? undefined : onShare}
                />

                {(comments.length > 0 || commenting) && (
                  <div className="gap-ws-7 pt-ws-3 flex flex-col">
                    {earlier > 0 && (
                      <Button
                        size="sm"
                        variant="secondary"
                        preset="ghost"
                        className="-ml-ws-6 self-start"
                        onClick={() => setExpanded(true)}
                      >
                        {`View all ${comments.length} comments`}
                      </Button>
                    )}
                    {comments.length > 0 && <CommentThread comments={comments.slice(earlier)} />}
                    <CommentField ref={field} author={author.name} onComment={onComment} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
    </article>
  );
}

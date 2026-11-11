// TODO(custom): comments on a file (who, when, the text); no Comment component in Wideset.
import { Avatar } from '@wideset/react';

import { type Comment, PEOPLE } from './data';
import { formatPosted } from './format';

/**
 * Comments on the file, oldest first, as a conversation reads: who wrote, how long ago, then the
 * text. Drawn like the recording block's comments, without the moment of the call.
 */
export function CommentList({ comments }: { comments: Comment[] }) {
  if (comments.length === 0) {
    return <p className="typography-body-md text-ws-static-subtle">No comments yet.</p>;
  }

  return (
    <ol aria-label="Comments" className="gap-ws-9 flex flex-col">
      {comments.map((comment) => {
        const author = PEOPLE[comment.by];
        return (
          <li key={comment.id} className="gap-ws-5 flex">
            <Avatar size="sm" initials={author.initials} color={author.color} aria-hidden />
            <div className="gap-ws-2 flex min-w-0 flex-1 flex-col">
              <p className="typography-label-sm gap-ws-5 flex flex-wrap items-baseline">
                <span className="typography-label-strong-sm text-ws-static-strong">
                  {author.name}
                </span>
                <time dateTime={comment.postedAt} className="text-ws-static-subtle">
                  {formatPosted(comment.postedAt)}
                </time>
              </p>
              <p className="typography-body-md text-ws-static-base">{comment.text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

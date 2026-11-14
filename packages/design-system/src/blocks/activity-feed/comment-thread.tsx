// TODO(custom): comment thread (author, time, text); no Comment component in Wideset.
import type { Comment } from './data';
import { formatDateTime, formatWhen } from './format';
import { PersonAvatar } from './person-avatar';

/**
 * A post's comments, oldest first: who wrote, when, and what they said. One size below the post
 * (a 24px avatar) so the thread reads as belonging to it.
 */
export function CommentThread({ comments }: { comments: Comment[] }) {
  return (
    <ol aria-label="Comments" className="gap-ws-7 flex flex-col">
      {comments.map((comment) => (
        <li key={comment.id} className="gap-ws-5 flex">
          <PersonAvatar
            size="sm"
            name={comment.author.name}
            initials={comment.author.initials}
            color={comment.author.color}
            aria-hidden
          />
          <div className="gap-ws-1 flex min-w-0 flex-1 flex-col">
            <p className="gap-ws-5 flex items-baseline">
              <span className="typography-label-strong-sm text-ws-static-strong">
                {comment.author.name}
              </span>
              <time
                dateTime={comment.at}
                title={formatDateTime(comment.at)}
                className="typography-label-sm text-ws-static-subtle"
              >
                {formatWhen(comment.at)}
              </time>
            </p>
            <p className="typography-body-md text-ws-static-base">{comment.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

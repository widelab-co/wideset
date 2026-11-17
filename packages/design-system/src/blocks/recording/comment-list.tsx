// TODO(custom): comments left at a moment of a recording (who, the moment, when, text or a voice note); no Comment component in Wideset.
import type { Comment } from './data';
import { formatClock, formatWhen } from './format';
import { PersonAvatar } from './person-avatar';
import { TextButton } from './text-button';
import { VoiceNote } from './voice-note';

type CommentListProps = {
  /** In the order of the moments they refer to. */
  comments: Comment[];
  onSeek: (time: number) => void;
};

/**
 * Comments on the call, in the order of the call: who wrote, the moment they mean (a link that
 * plays from there), how long ago, then the text or the voice note.
 */
export function CommentList({ comments, onSeek }: CommentListProps) {
  return (
    <ol aria-label="Comments" className="gap-ws-9 flex flex-col">
      {comments.map((comment) => (
        <li key={comment.id} className="gap-ws-5 flex">
          <PersonAvatar
            size="sm"
            name={comment.author.name}
            initials={comment.author.initials}
            color={comment.author.color}
            aria-hidden
          />
          <div className="gap-ws-2 flex min-w-0 flex-1 flex-col">
            <p className="typography-label-sm gap-ws-5 flex flex-wrap items-baseline">
              <span className="typography-label-strong-sm text-ws-static-strong">
                {comment.author.name}
              </span>
              <TextButton
                onClick={() => onSeek(comment.at)}
                aria-label={`Play from ${formatClock(comment.at)}`}
                className="tabular-nums"
              >
                {formatClock(comment.at)}
              </TextButton>
              <time dateTime={comment.postedAt} className="text-ws-static-subtle">
                {formatWhen(comment.postedAt)}
              </time>
            </p>
            {'text' in comment ? (
              <p className="typography-body-md text-ws-static-base">{comment.text}</p>
            ) : (
              <VoiceNote duration={comment.voiceNote} />
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

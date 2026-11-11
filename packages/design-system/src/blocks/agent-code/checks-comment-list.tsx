// TODO(custom): review comments as rows that lead to their line (who, how long ago, the text, the file and line); Wideset has no Comment component.
import { RiArrowRightSLine } from '@remixicon/react';
import { Avatar, Card } from '@wideset/react';
import { useId } from 'react';

import { splitPath, THREADS } from './changes-data';
import { formatWhen } from './changes-format';

/**
 * The review comments still open, in a card: who wrote on which file and line, how long ago, and
 * the comment in full. Each row is one target, the link on its file and line stretched over the
 * whole row, and leads to that line in the Changes pane, where the comment is answered, resolved
 * or handed to Tandem. Nothing is decided here, so the rows carry no actions of their own.
 */
export function CommentList() {
  const titleId = useId();
  const unresolved = THREADS.filter((thread) => !thread.resolved);

  return (
    <Card role="region" aria-labelledby={titleId}>
      <Card.Header>
        <h3 id={titleId} className="typography-label-strong-md text-ws-static-strong">
          Unresolved comments
        </h3>
      </Card.Header>
      <ul>
        {unresolved.map(({ id, path, anchor, comments: [comment] }) => (
          <li
            key={id}
            className="border-ws-static-base gap-ws-5 px-ws-11 py-ws-7 hover:bg-ws-dynamic-secondary-alpha-hover relative flex items-start border-b last:border-b-0"
          >
            <Avatar
              size="xs"
              initials={comment.author.initials}
              color={comment.author.color}
              aria-hidden
            />
            <div className="gap-ws-2 flex min-w-0 flex-1 flex-col">
              <p className="typography-label-sm text-ws-static-subtle gap-x-ws-5 flex flex-wrap items-baseline">
                <span>
                  <span className="typography-label-strong-sm text-ws-static-strong">
                    {comment.author.name}
                  </span>{' '}
                  on{' '}
                  <a
                    href={`#changes/${path}:${anchor.line}`}
                    className="text-ws-static-base rounded-ws-control-sm focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default after:inset-ws-0 wrap-anywhere after:absolute"
                  >
                    {splitPath(path).name}:{anchor.line}
                    <span className="sr-only">, open in Changes</span>
                  </a>
                </span>
                <time dateTime={comment.postedAt}>{formatWhen(comment.postedAt)}</time>
              </p>
              <p className="typography-body-md text-ws-static-base text-pretty">{comment.text}</p>
            </div>
            <RiArrowRightSLine
              aria-hidden="true"
              className="size-ws-9 text-ws-dynamic-secondary-default shrink-0 self-center"
            />
          </li>
        ))}
      </ul>
    </Card>
  );
}

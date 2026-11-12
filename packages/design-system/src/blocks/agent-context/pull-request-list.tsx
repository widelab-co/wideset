// TODO(custom): a pull request as a row that opens it (number, title, state); Wideset has no row for a record with its state.
import { RiGitPullRequestLine } from '@remixicon/react';
import { StatusBadge, type StatusBadgeProps } from '@wideset/react';

/** A state in the colour of its meaning: a draft signals nothing yet, merged is done. */
const STATE: Record<string, StatusBadgeProps['color']> = {
  Draft: 'neutral',
  Open: 'info',
  Merged: 'positive',
  Closed: 'neutral',
};

type PullRequestListProps = {
  pullRequests: { number: number; title: string; state: string }[];
};

/**
 * The pull requests the session opened, each row one link to its checks: the number, the title
 * cut to one line, and the state as a badge at the end.
 */
export function PullRequestList({ pullRequests }: PullRequestListProps) {
  return (
    <ul className="flex flex-col">
      {pullRequests.map(({ number, title, state }) => (
        <li key={number}>
          <a
            href={`#checks/${number}`}
            className="gap-ws-5 -mx-ws-3 px-ws-3 min-h-ws-13 rounded-ws-control-md hover:bg-ws-static-alpha-subtle focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default typography-label-sm flex items-center focus-visible:-outline-offset-2"
          >
            <RiGitPullRequestLine
              aria-hidden="true"
              className="size-ws-9 text-ws-static-subtle shrink-0"
            />
            <span className="text-ws-static-subtle tabular-nums">#{number}</span>
            <span className="text-ws-static-strong min-w-0 flex-1 truncate">{title}</span>
            <StatusBadge size="sm" color={STATE[state]}>
              {state}
            </StatusBadge>
          </a>
        </li>
      ))}
    </ul>
  );
}

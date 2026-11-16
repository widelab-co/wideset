// TODO(custom): page header (title, a line of facts, the call's state on the right); no PageHeader in Wideset.
import { call } from './data';
import { formatClock } from './format';
import { TextLink } from './text-link';

type CallHeaderProps = {
  /** Seconds since the call started, or nothing before it connects. */
  elapsed?: number;
  recording: boolean;
  /** How many people are on the call. */
  count: number;
};

/** The dot between two facts on the header's line. */
function Dot() {
  return (
    <span aria-hidden="true" className="text-ws-static-subtle">
      {'·'}
    </span>
  );
}

/**
 * What the call is and where it belongs: its name, the deal it is filed under and how many are on
 * it; on the right, how long it has run. While it is recorded a small red dot and the word say so
 * before the time: the only red on the page besides Leave.
 */
export function CallHeader({ elapsed, recording, count }: CallHeaderProps) {
  return (
    <header className="gap-ws-12 flex flex-wrap items-end justify-between">
      <div className="gap-ws-3 flex min-w-0 flex-col">
        <h1 className="typography-title-md text-ws-static-strong">{call.title}</h1>
        <p className="typography-body-md text-ws-static-subtle gap-ws-5 flex flex-wrap items-center">
          <span>
            Deal <TextLink href={`#${call.deal.id}`}>{call.deal.name}</TextLink>
          </span>
          <Dot />
          <span className="tabular-nums">{count} people</span>
        </p>
      </div>

      <p className="typography-label-md text-ws-static-base gap-ws-7 flex items-center tabular-nums">
        {recording && (
          <span className="gap-ws-3 flex items-center">
            <span
              aria-hidden="true"
              className="size-ws-5 rounded-ws-control-full bg-ws-semantic-inverse-negative"
            />
            Recording
          </span>
        )}
        {elapsed !== undefined && (
          <span>
            <span className="sr-only">Call time </span>
            {formatClock(elapsed)}
          </span>
        )}
      </p>
    </header>
  );
}

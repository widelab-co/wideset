// TODO(custom): moments in a recording (time, label, the row seeks); Wideset has no timed list.
import type { Moment } from './data';
import { formatClock } from './format';

/**
 * The moments Orbit marked in the call, in order. Each row is one target across its width: it
 * plays the call from there. The time leads, in a column of its own, so the rows line up.
 */
export function CallHighlights({
  moments,
  onSeek,
}: {
  moments: Moment[];
  onSeek: (time: number) => void;
}) {
  return (
    <ul className="-mx-ws-5 flex flex-col">
      {moments.map((moment) => (
        <li key={moment.at}>
          <button
            type="button"
            onClick={() => onSeek(moment.at)}
            aria-label={`${moment.label}, at ${formatClock(moment.at)}`}
            className="gap-ws-7 px-ws-5 py-ws-4 rounded-ws-control-lg typography-label-sm hover:bg-ws-dynamic-tertiary-alpha-strong-default focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex w-full cursor-pointer items-baseline text-left"
          >
            <span className="text-ws-static-subtle w-ws-16 shrink-0 tabular-nums">
              {formatClock(moment.at)}
            </span>
            <span className="text-ws-static-strong truncate">{moment.label}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

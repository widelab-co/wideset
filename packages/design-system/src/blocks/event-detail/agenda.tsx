// TODO(custom): an agenda timeline (time column, a mark on a line, the session); Wideset has no Timeline.
import type { Session } from './data';
import { formatTime } from './format';

/**
 * The afternoon as a timeline: the start times in one column so they line up, a mark for each
 * session on one line, then what the session is, who leads it and the room. Plain rows: nothing
 * to click, the times are the content.
 */
export function Agenda({ sessions }: { sessions: Session[] }) {
  return (
    <ol className="flex flex-col">
      {sessions.map((session, index) => {
        const last = index === sessions.length - 1;
        return (
          <li key={session.id} className="gap-ws-9 flex">
            <time
              dateTime={session.at}
              className="typography-label-sm text-ws-static-strong w-[4.5rem] shrink-0 text-right tabular-nums"
            >
              {formatTime(session.at)}
            </time>
            {/* The mark sits on the title's first line; the line runs to the next mark, 4px
                clear of each. */}
            <div className="w-ws-5 relative flex shrink-0 justify-center" aria-hidden="true">
              <span className="size-ws-5 rounded-ws-control-full text-ws-static-subtle mt-ws-4 bg-current" />
              {last ? null : (
                <span className="border-ws-static-base top-ws-10 -bottom-ws-2 absolute border-l" />
              )}
            </div>
            <div className={last ? 'flex min-w-0 flex-col' : 'pb-ws-11 flex min-w-0 flex-col'}>
              <span className="typography-label-strong-sm text-ws-static-strong">
                {session.title}
              </span>
              <span className="typography-body-md text-ws-static-subtle">
                {session.speakers ? `${session.speakers} · ${session.room}` : session.room}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

// TODO(custom): what stands between a draft and its review, with the action it gates (a footer of blockers beside a disabled button); Wideset has no gate or checklist-summary part.
import { RiChat3Fill, RiCheckboxCircleFill, RiCloseCircleFill } from '@remixicon/react';
import { Button } from '@wideset/react';
import { useId } from 'react';

import { THREADS } from './changes-data';
import { CHECKS } from './checks-data';
import { formatCount } from './checks-format';

const ITEM = 'gap-ws-3 flex items-center';
const MARK = 'size-ws-9 shrink-0';

/**
 * The pane's closing line, kept in view under the scrolling content: what still stands between
 * the draft and Ready for review, counted from the checks and the comments above, beside the
 * action it holds back. A disabled button gives no reason by itself, so the reason is the text
 * next to it and is tied to it for a screen reader. A failing check is a failure (negative); an
 * open comment waits for an answer (notice). The button is bordered: the session's composer owns
 * the screen's filled one.
 */
export function ReadySummary() {
  const reasonId = useId();
  const failing = CHECKS.filter((check) => check.state === 'failed').length;
  const unresolved = THREADS.filter((thread) => !thread.resolved).length;
  const ready = failing + unresolved === 0;

  return (
    <footer className="border-ws-static-base gap-x-ws-9 gap-y-ws-7 px-ws-11 py-ws-9 flex shrink-0 flex-wrap items-center border-t">
      <div id={reasonId} className="gap-ws-3 flex min-w-[12rem] flex-1 flex-col">
        <h3 className="typography-label-strong-sm text-ws-static-strong">
          {ready ? 'Ready for review' : 'Not ready for review yet'}
        </h3>
        <ul className="typography-label-sm text-ws-static-base gap-x-ws-9 gap-y-ws-2 flex flex-wrap">
          {ready && (
            <li className={ITEM}>
              <RiCheckboxCircleFill
                aria-hidden="true"
                className={`${MARK} text-ws-semantic-positive`}
              />
              Every check passed and every comment is resolved
            </li>
          )}
          {failing > 0 && (
            <li className={ITEM}>
              <RiCloseCircleFill
                aria-hidden="true"
                className={`${MARK} text-ws-semantic-negative`}
              />
              {formatCount(failing, 'failing check')}
            </li>
          )}
          {unresolved > 0 && (
            <li className={ITEM}>
              <RiChat3Fill aria-hidden="true" className={`${MARK} text-ws-semantic-notice`} />
              {formatCount(unresolved, 'unresolved comment')}
            </li>
          )}
        </ul>
      </div>
      <Button
        variant="secondary"
        preset="border"
        size="sm"
        disabled={!ready}
        aria-describedby={reasonId}
      >
        Mark ready for review
      </Button>
    </footer>
  );
}

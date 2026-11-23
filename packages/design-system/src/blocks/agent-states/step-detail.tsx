// TODO(custom): what a step opens to (a log, a diff, search results), in monospace where it is code; Wideset has no code, diff or console part.
import { cn } from '@wideset/react';

import type { StepDetail as Detail } from './model';

/** A diff line in the colour of what it does: added positive, removed negative, the rest plain. */
const DIFF: Record<string, string> = {
  '+': 'bg-ws-semantic-positive text-ws-semantic-on-subtle-positive',
  '-': 'bg-ws-semantic-negative text-ws-semantic-on-subtle-negative',
};

/**
 * The detail under a step, in an outlined box that follows the theme: output as a log with its
 * error lines in the negative colour, a diff with added and removed lines tinted, or the results
 * of a search as titles with where they are from. Long content scrolls inside the box.
 */
const NAME: Record<Detail['kind'], string> = { output: 'Output', diff: 'Diff', results: 'Results' };

export function StepDetail({ detail }: { detail: Detail }) {
  return (
    // Long content scrolls, so the box takes the keyboard's focus to be scrolled with the arrows.
    <div
      role="region"
      aria-label={NAME[detail.kind]}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a scrolling region must be reachable by keyboard
      tabIndex={0}
      className="border-ws-static-base rounded-ws-container-sm ml-ws-12 mt-ws-2 mb-ws-3 focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default ws-scrollbar max-h-[15rem] overflow-auto border"
    >
      {detail.kind === 'results' ? (
        <ul className="px-ws-7 py-ws-5 typography-body-md flex flex-col">
          {detail.items.map((item, index) => (
            // Two results can share a title; the list is fixed once the step has ended.
            <li key={index} className="gap-ws-7 py-ws-2 flex items-baseline">
              <span className="text-ws-static-base min-w-0 flex-1 truncate">{item.title}</span>
              <span className="text-ws-static-subtle shrink-0">{item.source}</span>
            </li>
          ))}
        </ul>
      ) : (
        <pre className="font-ws-mono typography-body-sm tracking-ws-normal py-ws-5 text-ws-static-base flex flex-col">
          {detail.lines.map((line, index) => (
            <span
              key={index}
              className={cn(
                'px-ws-7 whitespace-pre-wrap',
                detail.kind === 'diff' && DIFF[line[0]],
                detail.kind === 'output' &&
                  detail.errors?.includes(index) &&
                  'text-ws-semantic-negative',
              )}
            >
              {line || ' '}
            </span>
          ))}
        </pre>
      )}
    </div>
  );
}

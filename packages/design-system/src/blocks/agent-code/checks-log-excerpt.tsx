// TODO(custom): an excerpt of a log (the lines that matter, with their numbers in the whole log, the error in the negative colour); Wideset has no log or code part.
import { cn } from '@wideset/react';

import type { LogLine } from './checks-data';

/**
 * The few lines of a check's log that say why it failed, not the log: each keeps its number in
 * the whole log, so the gaps show that lines were left out. The error itself takes the negative
 * colour and the rest stays plain. A band across the card on the quiet fill the diff gives its
 * hunk headers, in monospace, following the theme; long lines wrap.
 */
export function LogExcerpt({ lines }: { lines: LogLine[] }) {
  return (
    <ol
      aria-label="Log excerpt"
      className="font-ws-mono typography-body-sm tracking-ws-normal bg-ws-static-alpha-subtle py-ws-5"
    >
      {lines.map(({ number, text, error }) => (
        <li key={number} className="gap-ws-7 px-ws-11 py-ws-1 flex">
          <span
            aria-hidden="true"
            className="w-ws-13 text-ws-static-subtle shrink-0 text-right tabular-nums select-none"
          >
            {number}
          </span>
          <span
            className={cn(
              'min-w-0 flex-1 wrap-anywhere whitespace-pre-wrap',
              error ? 'text-ws-semantic-negative' : 'text-ws-static-base',
            )}
          >
            {text}
          </span>
        </li>
      ))}
    </ol>
  );
}

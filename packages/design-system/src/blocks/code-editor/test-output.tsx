// TODO(custom): a test run's result (the input record, the returned score, the log); Wideset has no console or run-output part, and no monospace font token (Tailwind's font-mono stands in).
import { cn } from '@wideset/react';

import { SAMPLE_LEAD } from './data';
import { formatClock } from './format';
import type { TestRun } from './test-run';

const MONO = 'typography-body-sm tracking-ws-normal font-mono';
const HEADING = 'typography-caption-strong-md text-ws-static-subtle';

/**
 * What Run test produced, read left to right: the record that went in, what came back (the
 * score, the one large figure) and what the script logged on the way. A failed run returns
 * nothing and its log ends on the error, in the negative colour. Before the first run it says
 * what Run test will do. Whether the run passed sits in the panel's tab row.
 */
export function TestOutput({ run, running }: { run?: TestRun; running: boolean }) {
  if (running || !run) {
    return (
      <p className="typography-body-md text-ws-static-subtle">
        {running
          ? `Running the test with ${SAMPLE_LEAD.company}…`
          : `Run test scores the sample lead, ${SAMPLE_LEAD.company}, with the code in the editor, saved or not.`}
      </p>
    );
  }

  return (
    <div className="gap-ws-16 grid grid-cols-[minmax(0,16rem)_minmax(0,6rem)_minmax(0,1fr)]">
      <section aria-label="Input" className="gap-ws-3 flex flex-col">
        <h3 className={HEADING}>Input</h3>
        <pre className={cn(MONO, 'text-ws-static-base whitespace-pre-wrap')}>
          {JSON.stringify(SAMPLE_LEAD, null, 2)}
        </pre>
      </section>

      <section aria-label="Returned" className="gap-ws-2 flex flex-col">
        <h3 className={HEADING}>Returned</h3>
        {run.status === 'passed' ? (
          <p className="typography-title-md text-ws-static-strong tabular-nums">{run.score}</p>
        ) : (
          <p className="typography-body-md text-ws-static-subtle">Nothing</p>
        )}
      </section>

      <section aria-label="Log" className="gap-ws-3 flex flex-col">
        <h3 className={HEADING}>Log</h3>
        <ol className={cn(MONO, 'flex flex-col')}>
          {run.log.map((line) => (
            <li key={line.text} className="gap-ws-7 flex">
              <time
                dateTime={line.at.toISOString()}
                className="text-ws-static-subtle shrink-0 tabular-nums"
              >
                {formatClock(line.at)}
              </time>
              <span
                className={
                  line.level === 'error' ? 'text-ws-semantic-negative' : 'text-ws-static-base'
                }
              >
                {line.text}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

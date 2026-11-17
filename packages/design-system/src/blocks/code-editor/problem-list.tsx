// TODO(custom): the linter's findings as rows that jump to the code; Wideset has no problems or diagnostics list.
import { RiCloseCircleFill, RiErrorWarningFill } from '@remixicon/react';
import { cn } from '@wideset/react';

import type { ScriptFile } from './data';
import type { Problem } from './lint';

export type FileProblem = { file: ScriptFile; problem: Problem };

/**
 * Every problem in the step's code, errors first: the judgement's mark (an error in the negative
 * colour, a warning in the notice colour), the message, then where it is and the rule. A row is
 * one target: it opens the file and puts the caret on the problem.
 */
export function ProblemList({
  problems,
  onReveal,
}: {
  problems: FileProblem[];
  onReveal: (item: FileProblem) => void;
}) {
  if (problems.length === 0) {
    return <p className="typography-body-md text-ws-static-subtle">No problems in the code.</p>;
  }

  return (
    <ul className="-mx-ws-5 flex flex-col">
      {problems.map((item) => {
        const { file, problem } = item;
        const error = problem.severity === 'error';
        const Icon = error ? RiCloseCircleFill : RiErrorWarningFill;
        return (
          <li key={`${file.id}:${problem.line}:${problem.column}:${problem.rule}`}>
            <button
              type="button"
              onClick={() => onReveal(item)}
              className="gap-ws-5 px-ws-5 py-ws-4 rounded-ws-control-lg hover:bg-ws-dynamic-tertiary-alpha-strong-default focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex w-full items-center text-left"
            >
              <Icon
                aria-label={error ? 'Error' : 'Warning'}
                className={cn(
                  'size-ws-9 shrink-0',
                  error ? 'text-ws-semantic-negative' : 'text-ws-semantic-notice',
                )}
              />
              <span className="typography-label-sm text-ws-static-strong min-w-0 truncate">
                {problem.message}
              </span>
              <span className="typography-label-sm text-ws-static-subtle shrink-0 tabular-nums">
                {file.name}, line {problem.line}, column {problem.column} · {problem.rule}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

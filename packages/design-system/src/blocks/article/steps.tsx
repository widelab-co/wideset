// TODO(custom): a numbered list in long text; Wideset has no list styles, and the browser's markers would hang outside the text edge.
import type { ReactNode } from 'react';

/**
 * Steps to follow in order. The numbers sit on the text's left edge in a column of their own, so
 * a step that wraps keeps its lines under its first word, not under the number.
 */
export function Steps({ steps }: { steps: ReactNode[] }) {
  return (
    <ol className="gap-ws-5 flex flex-col">
      {steps.map((step, index) => (
        <li
          key={index}
          className="typography-body-lg text-ws-static-base grid grid-cols-[1.5rem_minmax(0,1fr)]"
        >
          <span aria-hidden="true" className="text-ws-static-subtle tabular-nums">
            {index + 1}.
          </span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  );
}

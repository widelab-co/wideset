// TODO(custom): error state (mark, what failed, why, the way out); Wideset has no ErrorState.
import { RiErrorWarningLine } from '@remixicon/react';
import type { ReactNode } from 'react';

type ErrorStateProps = {
  /** What failed, in a few plain words: "Support tickets did not load". */
  title: ReactNode;
  /** One sentence: why, and what is still safe. No error codes. */
  description: ReactNode;
  /** One `size="sm"` button: the way out, usually Retry. */
  children?: ReactNode;
};

/**
 * What a region shows when its data could not be fetched: the empty state's layout, so the two
 * sit alike, under a mark in the negative colour, the only colour in it, because a failure is a
 * judgement. Announced at once.
 */
export function ErrorState({ title, description, children }: ErrorStateProps) {
  return (
    <div className="gap-ws-12 flex flex-col items-center text-center">
      <div role="alert" className="gap-ws-7 flex flex-col items-center">
        <RiErrorWarningLine aria-hidden="true" className="size-ws-12 text-ws-semantic-negative" />
        <div className="gap-ws-3 flex max-w-[26rem] flex-col">
          <h3 className="typography-label-strong-md text-ws-static-strong">{title}</h3>
          <p className="typography-body-md text-ws-static-base">{description}</p>
        </div>
      </div>
      {children && <div className="gap-ws-5 flex flex-wrap justify-center">{children}</div>}
    </div>
  );
}

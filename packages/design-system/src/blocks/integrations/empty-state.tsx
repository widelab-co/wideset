// TODO(custom): empty state (drawing, title, line, actions); Wideset has no EmptyState.
import { Illustration, type IllustrationName } from '@wideset/react';
import type { ReactNode } from 'react';

/*
  The prototype for a Wideset EmptyState: one design for every region with nothing to show, copied
  byte for byte into each block that needs one. A first run (nothing here yet) takes a drawing and
  the ways in; a state the user caused (no search results) takes no drawing and the one way back.
*/

type EmptyStateProps = {
  /** A drawing, only for a first run: nothing has been added yet. */
  illustration?: IllustrationName;
  /** What is missing, in a few words: "No customers yet". */
  title: ReactNode;
  /** One sentence: what will appear here, or why nothing does. */
  description: ReactNode;
  /** One or two `size="sm"` buttons: the ways in, or the way back. */
  children?: ReactNode;
};

/** What a region shows with nothing in it: centred in the region, the text read first. */
export function EmptyState({ illustration, title, description, children }: EmptyStateProps) {
  return (
    <div className="gap-ws-12 flex flex-col items-center text-center">
      {illustration && <Illustration illustration={illustration} size="sm" />}
      {/* Announced when it replaces the rows, as after a search. */}
      <div role="status" className="gap-ws-3 flex max-w-[26rem] flex-col">
        <h2 className="typography-label-strong-md text-ws-static-strong">{title}</h2>
        <p className="typography-body-md text-ws-static-base">{description}</p>
      </div>
      {children && <div className="gap-ws-5 flex flex-wrap justify-center">{children}</div>}
    </div>
  );
}

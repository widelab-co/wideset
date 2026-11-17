// TODO(custom): empty state (title, line, action); no EmptyState in Wideset.
import type { ReactNode } from 'react';

/**
 * What a table shows with no rows: why it is empty and the one way forward, centred in the
 * table's width. Wideset has no EmptyState yet; this is the craft recipe (a title, a line, one
 * action), placed in a single cell that spans every column.
 */
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: ReactNode;
}) {
  return (
    <div className="gap-ws-9 py-ws-16 flex flex-col items-center text-center">
      <div className="gap-ws-3 flex flex-col">
        <p className="typography-label-strong-md text-ws-static-strong">{title}</p>
        <p className="typography-body-md text-ws-static-subtle">{description}</p>
      </div>
      {action}
    </div>
  );
}

// TODO(custom): no-results state (title, line, one action); no EmptyState in Wideset.
import type { ReactNode } from 'react';

/** What a region shows when nothing is left to show: why, and the one way back, centred. */
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
    <div className="gap-ws-9 py-ws-20 flex flex-col items-center text-center">
      <div className="gap-ws-3 flex max-w-[28rem] flex-col">
        <p className="typography-label-strong-md text-ws-static-strong">{title}</p>
        <p className="typography-body-md text-ws-static-base">{description}</p>
      </div>
      {action}
    </div>
  );
}

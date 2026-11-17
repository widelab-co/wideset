// TODO(custom): empty state (icon, title, line, action); no EmptyState in Wideset.
import type { RemixiconComponentType } from '@remixicon/react';
import type { ReactNode } from 'react';

/** What a region shows with nothing in it: why it is empty and the one way forward, centred. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: RemixiconComponentType;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="gap-ws-9 px-ws-12 flex flex-col items-center text-center">
      <Icon aria-hidden className="size-ws-14 text-ws-static-subtle" />
      <div className="gap-ws-3 flex max-w-[24rem] flex-col">
        <p className="typography-label-strong-md text-ws-static-strong">{title}</p>
        <p className="typography-body-md text-ws-static-subtle">{description}</p>
      </div>
      {action}
    </div>
  );
}

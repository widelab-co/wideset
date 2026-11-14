// TODO(custom): page header (title with its status, a line of description, the actions on the right); no PageHeader in Wideset.
import { StatusBadge } from '@wideset/react';
import type { ReactNode } from 'react';

import type { Status } from './data';

type PageHeaderProps = {
  title: string;
  /** The saved product's state; a product never saved has none. */
  status?: Status;
  description: string;
  /** The page's buttons, the filled one last; left out when they sit in a bar at the foot. */
  children?: ReactNode;
};

/**
 * The page's title, one line saying where the product stands, and what to do with it on the
 * right. Once saved, the title is the product's name and its state sits beside it, coloured by
 * meaning: Active is on sale, so positive; a draft has nothing to signal, so neutral.
 */
export function PageHeader({ title, status, description, children }: PageHeaderProps) {
  return (
    <header className="gap-ws-12 flex flex-wrap items-center justify-between">
      <div className="gap-ws-2 flex min-w-0 flex-col">
        <div className="gap-ws-5 flex min-w-0 items-center">
          <h1 className="typography-title-md text-ws-static-strong truncate">{title}</h1>
          {status && (
            <StatusBadge color={status === 'active' ? 'positive' : 'neutral'}>
              {status === 'active' ? 'Active' : 'Draft'}
            </StatusBadge>
          )}
        </div>
        <p className="typography-body-md text-ws-static-subtle">{description}</p>
      </div>
      {children && <div className="gap-ws-5 flex items-center">{children}</div>}
    </header>
  );
}

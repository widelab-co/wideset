// TODO(custom): page header (title, a line of description, the actions on the right); no PageHeader in Wideset.
import type { ReactNode } from 'react';

/** The page's title, one line saying what it is for, and its actions on the right. */
export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <header className="gap-ws-12 flex flex-wrap items-center justify-between">
      <div className="gap-ws-2 flex min-w-0 flex-col">
        <h1 className="typography-subtitle-md text-ws-static-strong">{title}</h1>
        <p className="typography-body-md text-ws-static-subtle">{description}</p>
      </div>
      {children && <div className="gap-ws-5 flex items-center">{children}</div>}
    </header>
  );
}

import { type ReactNode, useId } from 'react';

/**
 * One settings section's page: the title and its line, then the content in a 40rem column on the
 * page's left axis. The column scrolls inside the page; `footer` (the save bar) stays under it.
 */
export function SettingsPage({
  title,
  description,
  hidden,
  footer,
  children,
}: {
  title: string;
  description: string;
  hidden?: boolean;
  footer?: ReactNode;
  children: ReactNode;
}) {
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} hidden={hidden} className="flex min-w-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="gap-ws-14 px-ws-16 py-ws-12 flex max-w-[45rem] flex-col">
          <header className="gap-ws-3 flex flex-col">
            <h1 id={titleId} className="typography-title-md text-ws-static-strong">
              {title}
            </h1>
            <p className="typography-body-md text-ws-static-base">{description}</p>
          </header>
          {children}
        </div>
      </div>
      {footer}
    </section>
  );
}

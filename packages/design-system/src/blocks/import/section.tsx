// TODO(custom): section title and one line above its content; Wideset has no Section or PageSection.
import { cn } from '@wideset/react';
import { type ReactNode, useId } from 'react';

/**
 * One part of a step: a 16px title, one line saying what it is for, then its content. Sections
 * follow each other split by a line, not boxed, so the page stays one sheet; the first has no
 * line above it. The title names the region; an action for the whole section sits at its right.
 */
export function Section({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description: ReactNode;
  /** One small button for the whole section, at the right of its title. */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const id = useId();

  return (
    <section
      aria-labelledby={id}
      className={cn(
        'gap-ws-11 border-ws-static-subtle pt-ws-14 first:pt-ws-0 flex flex-col border-t first:border-t-0',
        className,
      )}
    >
      <div className="gap-ws-9 flex items-end justify-between">
        <div className="gap-ws-2 flex min-w-0 flex-col">
          <h2 id={id} className="typography-label-strong-md text-ws-static-strong">
            {title}
          </h2>
          <p className="typography-body-md text-ws-static-subtle">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

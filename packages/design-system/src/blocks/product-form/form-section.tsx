// TODO(custom): section title and one line above its content; Wideset has no Section or PageSection.
import { cn } from '@wideset/react';
import { type ReactNode, useId } from 'react';

/**
 * One part of the form: a 16px title, one line saying what it is for, then its fields. Sections
 * follow each other split by a line, not boxed, so the page stays one sheet; the first has no
 * line above it. The title names the region.
 */
export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description: ReactNode;
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
      <div className="gap-ws-2 flex flex-col">
        <h2 id={id} className="typography-label-strong-md text-ws-static-strong">
          {title}
        </h2>
        <p className="typography-body-md text-ws-static-subtle">{description}</p>
      </div>
      {children}
    </section>
  );
}

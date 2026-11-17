// TODO(custom): section title above its content, with an optional control on the right; Wideset has no Section or PageSection.
import { cn } from '@wideset/react';
import { type ReactNode, useId } from 'react';

type SectionProps = {
  title: string;
  /** A control in the title row (a search field). */
  action?: ReactNode;
  className?: string;
  children: ReactNode;
};

/**
 * One part of the page: a 16px title, then what it holds. The title row is a control's height
 * whether or not it holds one, so titles side by side line up. The title names the region.
 */
export function Section({ title, action, className, children }: SectionProps) {
  const id = useId();

  return (
    <section aria-labelledby={id} className={cn('gap-ws-7 flex flex-col', className)}>
      <div className="min-h-ws-14 gap-ws-9 flex items-center justify-between">
        <h2 id={id} className="typography-label-strong-md text-ws-static-strong">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

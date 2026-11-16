// TODO(custom): key figure (label, figure, a line under it, an action beside the figure); no stat or KpiCard component in Wideset.
import { cn } from '@wideset/react';
import type { ReactNode } from 'react';

export type KeyFigureProps = {
  label: string;
  /** The figure, formatted: `$600.00`. */
  value: string;
  /** What the figure is made of, or what happens to it next: one line. */
  note: string;
  /** The one thing to do with the figure, on its line. */
  action?: ReactNode;
  className?: string;
};

/**
 * A key figure: what it measures, the number, and one line that explains it. No bar and no
 * badge: an amount of credit is not a judgement. What can be done with the figure sits on the
 * figure's own line, so it reads as that figure's action and not the page's.
 */
export function KeyFigure({ label, value, note, action, className }: KeyFigureProps) {
  return (
    <div className={cn('gap-ws-5 flex min-w-0 flex-col', className)}>
      <div className="gap-ws-3 flex flex-col">
        <p className="typography-label-sm text-ws-static-subtle">{label}</p>
        <div className="gap-ws-9 flex items-center justify-between">
          <p className="typography-title-md text-ws-static-strong tabular-nums">{value}</p>
          {action}
        </div>
      </div>
      <p className="typography-label-sm text-ws-static-subtle tabular-nums">{note}</p>
    </div>
  );
}

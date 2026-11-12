// TODO(custom): a drawn preview of a template's shape (a checklist, a sequence of e-mails, a chart, a dashboard); Wideset has no preview, and blocks ship no images.
import { cn } from '@wideset/react';

import type { Kind } from './data';

const PAPER = 'bg-ws-static-foreground border-ws-static-subtle border rounded-ws-control-md';
const LINE = 'bg-ws-static-alpha-strong h-ws-2 rounded-full';

/** Bar heights for the report's chart, as a share of its height. */
const BARS = [
  'h-[38%]',
  'h-[52%]',
  'h-[46%]',
  'h-[64%]',
  'h-[58%]',
  'h-[78%]',
  'h-[70%]',
  'h-[92%]',
];
/** The dashboard's line, in a 100 × 40 box. */
const TREND = '0,32 14,28 28,30 42,20 56,23 70,14 84,16 100,6';

/** A checklist on a page: the first steps ticked, the rest still open. */
function Checklist({ compact }: { compact: boolean }) {
  const rows = compact ? 3 : 5;
  return (
    <div
      className={cn(
        PAPER,
        'gap-ws-5 p-ws-7 absolute inset-x-[18%] top-[14%] bottom-[-8%] flex flex-col',
      )}
    >
      <div className={cn(LINE, 'h-ws-3 w-1/2')} />
      {Array.from({ length: rows }, (_, row) => (
        <div key={row} className="gap-ws-4 flex items-center">
          <div
            className={cn(
              'size-ws-5 rounded-ws-control-sm shrink-0',
              row < 2 ? 'bg-ws-static-alpha-strong' : 'border-ws-static-strong border',
            )}
          />
          <div className={cn(LINE, row % 2 ? 'w-3/5' : 'w-4/5')} />
        </div>
      ))}
    </div>
  );
}

/** E-mails one after another down a thread line: the steps of a sequence. */
function Sequence({ compact }: { compact: boolean }) {
  const steps = compact ? 2 : 3;
  return (
    <div className="gap-ws-5 absolute inset-x-[16%] top-1/2 flex -translate-y-1/2 flex-col">
      {Array.from({ length: steps }, (_, step) => (
        <div key={step} className={cn(PAPER, 'gap-ws-5 px-ws-5 py-ws-4 flex items-center')}>
          <div className="size-ws-7 bg-ws-static-alpha-base shrink-0 rounded-full" />
          <div className="gap-ws-3 flex flex-1 flex-col">
            <div className={cn(LINE, step === 0 ? 'w-3/5' : 'w-1/2')} />
            {!compact && <div className={cn(LINE, 'bg-ws-static-alpha-base w-4/5')} />}
          </div>
        </div>
      ))}
    </div>
  );
}

/** A report: a title over a bar chart, one grey series rising. */
function Report({ compact }: { compact: boolean }) {
  return (
    <div
      className={cn(PAPER, 'gap-ws-5 p-ws-7 absolute inset-x-[14%] inset-y-[14%] flex flex-col')}
    >
      <div className={cn(LINE, 'h-ws-3 w-2/5')} />
      <div className="gap-ws-3 border-ws-static-base flex flex-1 items-end border-b">
        {(compact ? BARS.slice(2) : BARS).map((height, bar) => (
          <div
            key={bar}
            className={cn('bg-ws-static-alpha-strong rounded-t-ws-control-sm flex-1', height)}
          />
        ))}
      </div>
    </div>
  );
}

/** A dashboard: figures in a row of tiles over one wide chart. */
function Dashboard({ compact }: { compact: boolean }) {
  return (
    <div className="gap-ws-4 absolute inset-[10%] grid grid-cols-3 grid-rows-[auto_1fr]">
      {Array.from({ length: 3 }, (_, tile) => (
        <div key={tile} className={cn(PAPER, 'gap-ws-3 p-ws-4 flex flex-col')}>
          <div className={cn(LINE, 'bg-ws-static-alpha-base w-3/5')} />
          <div className={cn(LINE, 'h-ws-3 w-4/5')} />
        </div>
      ))}
      <div className={cn(PAPER, 'p-ws-5 col-span-3 flex')}>
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="size-full overflow-visible">
          <polyline
            points={TREND}
            strokeWidth={compact ? 1.5 : 2}
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
            strokeLinecap="round"
            className="fill-none stroke-(--ws-static-stroke-strong)"
          />
        </svg>
      </div>
    </div>
  );
}

/**
 * A template's shape drawn in a few grey marks on a neutral ground, so the library reads at a
 * glance without loading a picture: a playbook is a checklist, a sequence a run of e-mails, a
 * report a chart and a dashboard tiles over a line. One grey for everything: the marks stand for
 * the template's shape, not for data. `compact` drops detail for the small previews in a
 * collection. Decorative: the name beside it says what it is.
 */
export function TemplatePreview({
  kind,
  compact = false,
  className,
}: {
  kind: Kind;
  compact?: boolean;
  className?: string;
}) {
  const Shape = { playbook: Checklist, sequence: Sequence, report: Report, dashboard: Dashboard }[
    kind
  ];
  return (
    <div
      aria-hidden="true"
      className={cn('bg-ws-static-alpha-subtle relative aspect-[16/10] overflow-hidden', className)}
    >
      <Shape compact={compact} />
    </div>
  );
}

import { RiArrowDownLine, RiArrowUpLine } from '@remixicon/react';
import { cn } from '@wideset/react';
import type { ReactNode } from 'react';

import { formatChange } from './format';

/** A change against the previous period: arrow and percentage, green up and red down. */
export function Change({ value, children }: { value: number; children?: ReactNode }) {
  const up = value >= 0;
  const Arrow = up ? RiArrowUpLine : RiArrowDownLine;

  return (
    <span className="gap-ws-3 typography-number-sm flex items-center tabular-nums">
      <Arrow
        aria-hidden
        className={cn(
          'size-ws-7 shrink-0',
          up ? 'text-ws-semantic-positive' : 'text-ws-semantic-negative',
        )}
      />
      <span>
        <span className={up ? 'text-ws-semantic-positive' : 'text-ws-semantic-negative'}>
          <span className="sr-only">{up ? 'Up ' : 'Down '}</span>
          {formatChange(value)}
        </span>
        {children && <span className="text-ws-static-base"> {children}</span>}
      </span>
    </span>
  );
}

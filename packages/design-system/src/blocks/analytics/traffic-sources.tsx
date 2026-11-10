import { cn } from '@wideset/react';
import { useId } from 'react';

import { formatCount } from './format';

type Source = { name: string; visitors: number };

/**
 * Where the period's visitors came from, as a bar list: each bar is the source's visitors against
 * the largest source, drawn behind its name.
 */
export function TrafficSources({ sources, className }: { sources: Source[]; className?: string }) {
  const titleId = useId();
  const max = Math.max(...sources.map((source) => source.visitors));

  return (
    <section aria-labelledby={titleId} className={cn('gap-ws-7 flex flex-col', className)}>
      <h2 id={titleId} className="typography-label-strong-md text-ws-static-strong">
        Traffic sources
      </h2>
      <ul className="flex flex-col">
        {sources.map((source) => (
          <li key={source.name} className="h-ws-16 gap-ws-9 flex items-center">
            <div className="h-ws-14 relative flex min-w-0 flex-1 items-center">
              <svg aria-hidden className="inset-ws-0 absolute size-full">
                <rect
                  width={`${(source.visitors / max) * 100}%`}
                  height="100%"
                  rx="6"
                  className="fill-(--ws-static-fill-alpha-base)"
                />
              </svg>
              <span className="px-ws-5 typography-label-sm text-ws-static-base relative truncate">
                {source.name}
              </span>
            </div>
            <span className="typography-number-sm text-ws-static-base tabular-nums">
              {formatCount(source.visitors)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

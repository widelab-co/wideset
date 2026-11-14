// TODO(custom): ranked person row (Avatar, name, meta, value); no component in Wideset.
import { cn } from '@wideset/react';
import { useId } from 'react';

import { REPS } from './data';
import { formatPercent, formatUsd } from './format';
import { PersonAvatar } from './person-avatar';

/** The reps ranked by what they closed this quarter, with how much of their quota that is. */
export function RepLeaderboard({ className }: { className?: string }) {
  const titleId = useId();
  const ranked = [...REPS].sort((a, b) => b.won - a.won);

  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        'bg-ws-static-foreground rounded-ws-container-md shadow-ws-low p-ws-11 gap-ws-9 flex flex-col',
        className,
      )}
    >
      <div className="gap-ws-9 flex items-baseline justify-between">
        <h2 id={titleId} className="typography-subtitle-xs text-ws-static-strong">
          Top reps
        </h2>
        <p className="typography-body-md text-ws-static-subtle">Closed won</p>
      </div>
      <ol className="gap-ws-6 flex flex-col">
        {ranked.map(({ rep, won, quota }) => (
          <li key={rep.name} className="gap-ws-7 flex items-center">
            <PersonAvatar name={rep.name} initials={rep.initials} color={rep.color} aria-hidden />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="typography-label-sm text-ws-static-strong truncate">{rep.name}</span>
              <span className="typography-caption-md text-ws-static-subtle tabular-nums">
                {formatPercent(won / quota)} of quota
              </span>
            </div>
            <span className="typography-number-sm text-ws-static-strong tabular-nums">
              {formatUsd(won)}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

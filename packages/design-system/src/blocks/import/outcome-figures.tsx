// TODO(custom): a row of plain key figures (label above a 24px number); no stat or KeyFigure component in Wideset.
import { formatCount } from './format';

type OutcomeFiguresProps = { added: number; updated: number; skipped: number };

/**
 * What an import does, as three plain figures in a row: new customers, updated ones and rows
 * left out. No colour and no bars: the numbers are the whole message, and the same row reads
 * before the import (what will happen) and after it (what did).
 */
export function OutcomeFigures({ added, updated, skipped }: OutcomeFiguresProps) {
  const figures = [
    { label: 'New customers', value: added },
    { label: 'Updated', value: updated },
    { label: 'Skipped', value: skipped },
  ];

  return (
    <dl className="gap-ws-12 grid grid-cols-3">
      {figures.map(({ label, value }) => (
        <div key={label} className="gap-ws-3 flex flex-col">
          <dt className="typography-label-sm text-ws-static-subtle">{label}</dt>
          <dd className="typography-title-md text-ws-static-strong tabular-nums">
            {formatCount(value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

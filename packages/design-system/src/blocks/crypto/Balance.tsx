import { DISTRIBUTION, MONTHLY_BALANCE } from './data';
import { formatCompactUsd, formatUsd } from './format';

const MAX = 60_000;
const TICKS = [60_000, 40_000, 20_000, 0];

/** The wallet total beside its balance by month. */
export function Balance() {
  const total = DISTRIBUTION.reduce((sum, item) => sum + item.usd, 0);

  return (
    <section
      aria-label="Balance"
      className="gap-ws-16 flex min-h-[16.25rem] items-end justify-between"
    >
      <div className="gap-ws-11 flex max-w-[18.25rem] flex-col">
        <p className="typography-title-lg text-ws-static-strong tabular-nums">{formatUsd(total)}</p>
        <p className="typography-body-md text-ws-static-subtle">
          The combined value of all your cryptocurrency holdings across your wallet calculated in
          your preferred fiat currency
        </p>
      </div>

      <figure aria-label="Balance by month" className="gap-ws-12 flex w-[31.6875rem] shrink-0">
        <div className="pb-ws-12 flex h-[13.75rem] flex-col justify-between">
          {TICKS.map((tick) => (
            <span key={tick} className="typography-number-xs text-ws-static-subtle">
              {formatCompactUsd(tick)}
            </span>
          ))}
        </div>
        <div className="flex-1">
          <div className="mt-ws-5 relative h-[11.25rem]">
            <svg aria-hidden className="inset-ws-0 absolute size-full overflow-visible">
              {TICKS.map((tick) => (
                <line
                  key={tick}
                  x1="0"
                  x2="100%"
                  y1={`${100 - (tick / MAX) * 100}%`}
                  y2={`${100 - (tick / MAX) * 100}%`}
                  strokeDasharray="2 6"
                  className="stroke-(--ws-static-stroke-strong)"
                />
              ))}
            </svg>
            <div className="gap-x-ws-14 relative grid h-full grid-cols-8 items-end">
              {MONTHLY_BALANCE.map(({ month, usd }) => (
                <div
                  key={month}
                  title={`${month}: ${formatUsd(usd)}`}
                  className="bg-ws-non-semantic-pink-strong rounded-ws-control-md"
                  style={{ height: `${(usd / MAX) * 100}%` }}
                />
              ))}
            </div>
          </div>
          <div className="mt-ws-9 gap-x-ws-14 grid grid-cols-8">
            {MONTHLY_BALANCE.map(({ month }) => (
              <span key={month} className="typography-body-sm text-ws-static-subtle text-center">
                {month}
              </span>
            ))}
          </div>
        </div>
      </figure>
    </section>
  );
}

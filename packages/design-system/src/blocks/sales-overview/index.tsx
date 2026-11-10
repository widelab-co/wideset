import { ClosingDealsTable } from './closing-deals-table';
import { KEY_FIGURES } from './data';
import { formatCount, formatPercent, formatUsd, formatUsdCompact } from './format';
import { KpiCard } from './kpi-card';
import { PageHeader } from './page-header';
import { PipelineByStage } from './pipeline-by-stage';
import { RepLeaderboard } from './rep-leaderboard';
import { TopBar } from './top-bar';

type Figure = (typeof KEY_FIGURES)[number];

/** A figure against its target, in the words the key figure card shows. */
const toKpi = ({ label, value, target, unit, weekly }: Figure) => {
  const format = unit === 'usd' ? formatUsd : formatCount;
  const short = unit === 'usd' ? formatUsdCompact : formatCount;
  return {
    label,
    value: format(value),
    progress: value / target,
    target: `${formatPercent(value / target)} of ${short(target)}`,
    remaining: value >= target ? 'Target met' : `${short(target - value)} to go`,
    trend: weekly,
  };
};

/**
 * Sales against target, Canvas direction: the top bar and the page title on the grey canvas, every
 * block of content in its own white card.
 */
export default function SalesOverview() {
  return (
    <div className="bg-ws-static-background flex min-h-dvh flex-col">
      <TopBar />
      <main className="px-ws-12 pb-ws-12 pt-ws-5 flex-1">
        <div className="gap-ws-12 mx-auto flex w-full max-w-[80rem] flex-col">
          <PageHeader />
          <div className="gap-ws-9 flex flex-col">
            <section aria-label="Key figures" className="gap-ws-9 grid grid-cols-4">
              {KEY_FIGURES.map((figure) => (
                <KpiCard key={figure.label} {...toKpi(figure)} />
              ))}
            </section>
            <div className="gap-ws-9 grid grid-cols-4">
              <ClosingDealsTable className="col-span-3" />
              <div className="gap-ws-9 flex flex-col">
                <PipelineByStage />
                <RepLeaderboard className="flex-1" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

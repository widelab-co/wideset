/**
 * Compose the parts to change what the bar shows. `ProgressBar.Value` takes `formatValue` for a
 * count instead of a percentage; set `max` on the root so the fill and the screen reader value
 * follow it. The label names the progressbar and the description describes it, and a circle
 * without children renders its percentage and ring.
 */
import { ProgressBar } from '@wideset/react';

export default function ProgressBarComposition() {
  return (
    <div className="gap-ws-12 flex w-[20rem] max-w-full flex-col">
      <ProgressBar value={32} max={40}>
        <ProgressBar.Header>
          <ProgressBar.Label>Uploading files</ProgressBar.Label>
          <ProgressBar.Value formatValue={(value, max) => `${value} / ${max}`} />
        </ProgressBar.Header>
        <ProgressBar.Track />
        <ProgressBar.Description>8 files remaining</ProgressBar.Description>
      </ProgressBar>
      <div className="gap-ws-5 flex items-center justify-between">
        <span className="typography-label-sm text-ws-static-base">Syncing library</span>
        <ProgressBar type="circle" value={80} aria-label="Syncing library">
          <ProgressBar.Value />
          <ProgressBar.Track />
        </ProgressBar>
      </div>
    </div>
  );
}

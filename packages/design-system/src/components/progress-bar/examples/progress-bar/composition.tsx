/**
 * Compose the parts to change what the bar shows. Give `ProgressBar.Value` children to show a
 * count instead of the percentage, and set `max` on the root so the fill and the screen reader
 * value follow it. The label names the progressbar and the description describes it. Without children
 * the bar and the circle render only their track, so compose `ProgressBar.Value` for the percentage.
 */
import { ProgressBar } from '@wideset/react';

export default function ProgressBarComposition() {
  const uploaded = 32;
  const total = 40;

  return (
    <div className="gap-ws-12 flex w-[20rem] max-w-full flex-col">
      <ProgressBar value={uploaded} max={total}>
        <ProgressBar.Header>
          <ProgressBar.Label>Uploading files</ProgressBar.Label>
          <ProgressBar.Value>
            {uploaded} / {total}
          </ProgressBar.Value>
        </ProgressBar.Header>
        <ProgressBar.Track />
        <ProgressBar.Description>{total - uploaded} files remaining</ProgressBar.Description>
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

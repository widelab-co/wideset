/**
 * Compose the parts when the bar needs a label, a custom value or a description. `Label` names the
 * bar and `Description` describes it for screen readers. `Value` shows the rounded percentage; pass
 * `formatValue` to count files instead, which is a visual change only. Put the circle's `Value`
 * before its `Track` and name it with `aria-label`.
 */
import { ProgressBar } from '@wideset/react';

export default function ProgressBarComposition() {
  return (
    <div className="gap-ws-12 flex w-[20rem] max-w-full flex-col">
      <ProgressBar value={32} max={40} aria-valuetext="32 of 40 files">
        <ProgressBar.Header>
          <ProgressBar.Label>Uploading files</ProgressBar.Label>
          <ProgressBar.Value formatValue={(value, max) => `${value} / ${max}`} />
        </ProgressBar.Header>
        <ProgressBar.Track />
        <ProgressBar.Description>8 files remaining</ProgressBar.Description>
      </ProgressBar>
      <ProgressBar type="circle" value={80} aria-label="Sync progress">
        <ProgressBar.Value />
        <ProgressBar.Track />
      </ProgressBar>
    </div>
  );
}

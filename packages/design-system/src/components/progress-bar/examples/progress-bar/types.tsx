/**
 * The bar spans its container and carries a label, the percentage and a description, so it suits
 * an upload or a long task the user is watching. The circle is a compact percentage with a ring,
 * for a table row, a file list or a sidebar where a full-width bar does not fit; it has no label,
 * so name it with `aria-label`. Both announce their value to screen readers as a progressbar.
 */
import { ProgressBar } from '@wideset/react';

export default function ProgressBarTypes() {
  return (
    <div className="gap-ws-12 flex w-[20rem] max-w-full flex-col">
      <ProgressBar type="bar" value={50}>
        <ProgressBar.Header>
          <ProgressBar.Label>Uploading assets</ProgressBar.Label>
          <ProgressBar.Value />
        </ProgressBar.Header>
        <ProgressBar.Track />
        <ProgressBar.Description>9 of 18 files uploaded</ProgressBar.Description>
      </ProgressBar>
      <ProgressBar type="circle" value={50} aria-label="Uploading assets" />
    </div>
  );
}

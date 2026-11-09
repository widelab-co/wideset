/**
 * Default shows a task that is still running. Neutral is for a quantity rather than a task, such
 * as seats or storage used; warning is for one close to its limit. Switch to success once a task
 * completes and to error when it fails or a limit is passed, and say in the description what
 * happened and what to do next. Colour is not the only signal: warning, success and error also add
 * an icon to the description.
 */
import { ProgressBar } from '@wideset/react';

export default function ProgressBarVariants() {
  return (
    <div className="gap-ws-12 flex w-[20rem] max-w-full flex-col">
      <ProgressBar
        variant="default"
        value={50}
        label="Uploading assets"
        description="9 of 18 files uploaded"
      />
      <ProgressBar variant="neutral" value={40} label="Storage" description="40 of 100 GB used" />
      <ProgressBar
        variant="warning"
        value={92}
        label="API calls"
        description="92,000 of 100,000 calls this month"
      />
      <ProgressBar
        variant="success"
        value={100}
        label="Uploading assets"
        description="All 18 files uploaded"
      />
      <ProgressBar
        variant="error"
        value={50}
        label="Uploading assets"
        description="Upload stopped: 9 files failed. Try again."
      />
    </div>
  );
}

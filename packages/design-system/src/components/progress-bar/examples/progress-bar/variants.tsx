/**
 * Default shows progress that is still running. Switch to success once the task completes and to
 * error when it fails, and say in the description what happened and what to do next. The
 * description takes its colour from the bar, and success and error add an icon to it, so colour is
 * not the only signal.
 */
import { ProgressBar } from '@wideset/react';

const states = [
  { variant: 'default', value: 50, description: '9 of 18 files uploaded' },
  { variant: 'success', value: 100, description: 'All 18 files uploaded' },
  { variant: 'error', value: 50, description: 'Upload stopped: 9 files failed. Try again.' },
] as const;

export default function ProgressBarVariants() {
  return (
    <div className="gap-ws-12 flex w-[20rem] max-w-full flex-col">
      {states.map(({ variant, value, description }) => (
        <ProgressBar key={variant} variant={variant} value={value}>
          <ProgressBar.Header>
            <ProgressBar.Label>Uploading assets</ProgressBar.Label>
            <ProgressBar.Value />
          </ProgressBar.Header>
          <ProgressBar.Track />
          <ProgressBar.Description>{description}</ProgressBar.Description>
        </ProgressBar>
      ))}
    </div>
  );
}

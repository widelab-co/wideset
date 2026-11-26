/**
 * Use default for a running task, neutral for usage within a limit and warning when the limit is
 * close. Success marks completion and error marks a failure or an exceeded limit. Warning, success
 * and error add an icon to the description. Use the description to explain the status.
 */
import { ProgressBar } from '@wideset/react';

const states = [
  {
    status: 'default',
    value: 50,
    label: 'Uploading assets',
    description: '9 of 18 files uploaded',
  },
  { status: 'neutral', value: 40, label: 'Storage', description: '40 of 100 GB used' },
  {
    status: 'warning',
    value: 92,
    label: 'API calls',
    description: '92,000 of 100,000 calls this month',
  },
  {
    status: 'success',
    value: 100,
    label: 'Uploading assets',
    description: 'All 18 files uploaded',
  },
  {
    status: 'error',
    value: 50,
    label: 'Uploading assets',
    description: 'Upload stopped: 9 files failed. Try again.',
  },
] as const;

export default function ProgressBarStatuses() {
  return (
    <div className="gap-ws-12 flex w-[20rem] max-w-full flex-col">
      {states.map(({ status, value, label, description }) => (
        <ProgressBar key={status} status={status} value={value}>
          <ProgressBar.Header>
            <ProgressBar.Label>{label}</ProgressBar.Label>
            <ProgressBar.Value />
          </ProgressBar.Header>
          <ProgressBar.Track />
          <ProgressBar.Description>{description}</ProgressBar.Description>
        </ProgressBar>
      ))}
    </div>
  );
}

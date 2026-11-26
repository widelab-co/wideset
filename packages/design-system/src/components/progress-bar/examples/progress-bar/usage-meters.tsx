/**
 * Use the neutral fill for typical usage so the primary action keeps the brand colour. Choose
 * the warning threshold in the application and explain what happens at the limit.
 */
import { ProgressBar } from '@wideset/react';

const meters = [
  { label: 'Seats', status: 'neutral', value: 24, max: 40, description: '24 of 40 seats assigned' },
  { label: 'Storage', status: 'neutral', value: 64, max: 100, description: '64 of 100 GB used' },
  {
    label: 'API calls',
    status: 'warning',
    value: 92000,
    max: 100000,
    description: '92% of this month’s limit. Calls stop at 100,000.',
  },
] as const;

export default function ProgressBarUsageMeters() {
  return (
    <div className="gap-ws-12 flex w-[20rem] max-w-full flex-col">
      {meters.map(({ label, status, value, max, description }) => (
        <ProgressBar key={label} status={status} value={value} max={max}>
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

/**
 * Usage against a plan limit is a quantity, not a task, so it uses the neutral fill and leaves the
 * brand colour for the page's primary action. Switch a meter to warning when it nears its limit and
 * say in the description what happens next.
 */
import { ProgressBar } from '@wideset/react';

export default function ProgressBarUsageMeters() {
  return (
    <div className="gap-ws-12 flex w-[20rem] max-w-full flex-col">
      <ProgressBar
        variant="neutral"
        value={24}
        max={40}
        label="Seats"
        description="24 of 40 seats assigned"
      />
      <ProgressBar variant="neutral" value={64} label="Storage" description="64 of 100 GB used" />
      <ProgressBar
        variant="warning"
        value={92}
        label="API calls"
        description="92% of this month's limit. Calls stop at 100,000."
      />
    </div>
  );
}

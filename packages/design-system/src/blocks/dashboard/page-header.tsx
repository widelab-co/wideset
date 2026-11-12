// TODO(custom): page header (title, a line of description, the period control on the right); no PageHeader in Wideset.
import { SegmentedControl } from '@wideset/react';

import { type Period, PERIODS } from './data';

type PageHeaderProps = {
  /** The days on screen and what they are compared with, in words. */
  summary: string;
  period: Period;
  onPeriodChange: (period: Period) => void;
};

/**
 * The page's title, what its numbers cover, and the period control: three short options that
 * apply at once, so a segmented control and not a menu.
 */
export function PageHeader({ summary, period, onPeriodChange }: PageHeaderProps) {
  return (
    <header className="gap-ws-9 flex flex-wrap items-center justify-between">
      <div className="gap-ws-2 flex min-w-0 flex-col">
        <h1 className="typography-subtitle-md text-ws-static-strong">Revenue</h1>
        <p className="typography-body-md text-ws-static-subtle tabular-nums">{summary}</p>
      </div>
      <SegmentedControl
        size="sm"
        aria-label="Period"
        value={period}
        onValueChange={(value) => onPeriodChange(value as Period)}
      >
        {PERIODS.map(({ value, label }) => (
          <SegmentedControl.Item key={value} value={value}>
            {label}
          </SegmentedControl.Item>
        ))}
      </SegmentedControl>
    </header>
  );
}

import { RiDownload2Line } from '@remixicon/react';
import { Button, SegmentedControl } from '@wideset/react';

import { type Period, PERIODS } from './data';

type PageHeaderProps = {
  period: Period;
  onPeriodChange: (period: Period) => void;
  /** The dates the period covers, formatted. */
  range: string;
};

/** The page's title bar: what the page is, the period it shows and its one action. */
export function PageHeader({ period, onPeriodChange, range }: PageHeaderProps) {
  return (
    <header className="border-ws-static-subtle px-ws-12 shrink-0 border-b">
      <div className="h-ws-20 gap-ws-9 mx-auto flex w-full max-w-[80rem] items-center justify-between">
        <h1 className="typography-subtitle-md text-ws-static-strong">Analytics</h1>
        <div className="gap-ws-9 flex items-center">
          <p className="typography-body-md text-ws-static-subtle">{range}</p>
          <SegmentedControl
            size="sm"
            value={period}
            onValueChange={(value) => onPeriodChange(value as Period)}
            aria-label="Period"
          >
            {PERIODS.map((option) => (
              <SegmentedControl.Item
                key={option.value}
                value={option.value}
                aria-label={option.label}
              >
                {option.value}
              </SegmentedControl.Item>
            ))}
          </SegmentedControl>
          <Button size="sm" variant="secondary" preset="border">
            <Button.Icon icon={RiDownload2Line} />
            Export
          </Button>
        </div>
      </div>
    </header>
  );
}

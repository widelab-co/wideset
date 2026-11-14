import { RiDownload2Line } from '@remixicon/react';
import {
  Button,
  DateRangePicker,
  type DateRangePreset,
  type DateRangeValue,
  Select,
} from '@wideset/react';

import { type Compare, COMPARE_OPTIONS, FIRST_DAY, isoOf, TODAY } from './data';

/** The presets in the product's sentence case. */
const PRESET_LABELS: Partial<Record<DateRangePreset, string>> = {
  thisWeek: 'This week',
  lastWeek: 'Last week',
  thisMonth: 'This month',
  lastMonth: 'Last month',
  thisYear: 'This year',
  lastYear: 'Last year',
};

/** A calendar day as a local Date, for the picker's disabled days. */
const localDate = (day: number) => {
  const [year, month, date] = isoOf(day).split('-').map(Number);
  return new Date(year, month - 1, date);
};
// Ranges start a year into the data, so a comparison always has numbers, and end today.
const DISABLED = [{ before: localDate(FIRST_DAY) }, { after: localDate(TODAY) }];

type PageHeaderProps = {
  range: DateRangeValue;
  preset: DateRangePreset;
  onRangeChange: (range: DateRangeValue, preset: DateRangePreset) => void;
  compare: Compare;
  onCompareChange: (compare: Compare) => void;
  /** The dates on screen and what they are compared with, in words. */
  summary: string;
  onExport: () => void;
};

/**
 * The report's title, the dates it covers, what it is compared with, and its export, on the grey
 * canvas with no fill and no line under it.
 */
export function PageHeader({
  range,
  preset,
  onRangeChange,
  compare,
  onCompareChange,
  summary,
  onExport,
}: PageHeaderProps) {
  return (
    <header className="px-ws-12 shrink-0">
      <div className="gap-ws-9 pt-ws-11 pb-ws-12 mx-auto flex w-full max-w-[80rem] items-center justify-between">
        <div className="gap-ws-3 flex min-w-0 flex-col">
          <h1 className="typography-title-md text-ws-static-strong">Revenue report</h1>
          <p className="typography-body-md text-ws-static-base">{summary}</p>
        </div>
        <div className="gap-ws-5 flex shrink-0 items-center">
          <DateRangePicker
            size="sm"
            aria-label="Report period"
            className="w-[14.5rem]"
            showDatePresets
            presetLabels={PRESET_LABELS}
            selected={range}
            activeDatePreset={preset}
            weekStartsOn={1}
            dateFormat="MMM d, yyyy"
            disabledDates={DISABLED}
            onSelect={(next, nextPreset) => {
              if (next?.from && next.to) onRangeChange(next, nextPreset ?? 'custom');
            }}
          />
          <Select
            size="sm"
            options={COMPARE_OPTIONS}
            value={compare}
            onValueChange={(value) => onCompareChange(value as Compare)}
            aria-label="Compare with"
            className="w-[10rem]"
          />
          <Button size="sm" variant="secondary" preset="border" onClick={onExport}>
            <Button.Icon icon={RiDownload2Line} />
            Export
          </Button>
        </div>
      </div>
    </header>
  );
}

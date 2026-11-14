import { RiSearchLine } from '@remixicon/react';
import {
  Button,
  DateRangePicker,
  type DateRangeValue,
  FilterButton,
  Select,
  TextInput,
} from '@wideset/react';

import { sortOptions, statusOptions, TODAY } from './data';

export type FilterValues = {
  query: string;
  statuses: string[];
  /** The days the orders were placed in; left out, every day. */
  range?: DateRangeValue;
};

/** The sample's own today as a local Date, for the calendar: drop it to follow the clock. */
const [year, month, day] = TODAY.split('-').map(Number);
const SAMPLE_TODAY = new Date(year, month - 1, day);

/**
 * The toolbar over the table: search, the status, the days, and the sort at the far end. The
 * date range keeps its own state and reports a finished range; `resetKey` changes when the
 * filters are cleared from outside, which empties it.
 */
export function Filters({
  values,
  onChange,
  sort,
  onSortChange,
  resetKey,
  onClear,
}: {
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  /** The sort as the select holds it: `placed-desc`. */
  sort: string;
  onSortChange: (sort: string) => void;
  resetKey: number;
  /** Clears every filter; left out while nothing narrows the list. */
  onClear?: () => void;
}) {
  const set = (next: Partial<FilterValues>) => onChange({ ...values, ...next });

  return (
    <div className="gap-ws-5 flex flex-wrap items-center">
      <TextInput
        size="sm"
        className="w-[18rem] max-w-full"
        value={values.query}
        onChange={(event) => set({ query: event.target.value })}
      >
        <TextInput.Prefix inner>
          <TextInput.Icon icon={RiSearchLine} />
        </TextInput.Prefix>
        <TextInput.Input
          type="search"
          placeholder="Search by number or customer"
          aria-label="Search orders"
        />
        <TextInput.Suffix inner>
          <TextInput.ClearButton />
        </TextInput.Suffix>
      </TextInput>
      <FilterButton
        label="Status"
        placeholder="Status"
        options={statusOptions}
        value={values.statuses}
        onChange={(statuses) => set({ statuses })}
        clearFilterAriaLabel="Clear status filter"
      />
      <DateRangePicker
        key={resetKey}
        size="sm"
        aria-label="Order date"
        placeholder="Order date"
        className="w-[14.5rem]"
        dateFormat="MMM d, yyyy"
        weekStartsOn={1}
        today={SAMPLE_TODAY}
        defaultMonth={SAMPLE_TODAY}
        disabledDates={{ after: SAMPLE_TODAY }}
        onSelect={(range) => range?.from && range.to && set({ range })}
      />
      {onClear && (
        <Button size="sm" variant="secondary" preset="ghost" onClick={onClear}>
          Clear filters
        </Button>
      )}
      <Select
        size="sm"
        preset="border"
        aria-label="Sort orders"
        options={sortOptions}
        value={sort}
        onValueChange={onSortChange}
        className="ml-auto w-auto"
      />
    </div>
  );
}

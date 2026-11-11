import { RiSearchLine } from '@remixicon/react';
import { Button, FilterButton, TextInput } from '@wideset/react';

import { healthOptions, ownerOptions, segmentOptions } from './data';

export type FilterValues = {
  query: string;
  segments: string[];
  owners: string[];
  health: string[];
};

export const NO_FILTERS: FilterValues = { query: '', segments: [], owners: [], health: [] };

/** Whether anything narrows the list. */
export const isFiltered = (values: FilterValues) =>
  values.query.trim() !== '' ||
  values.segments.length + values.owners.length + values.health.length > 0;

/** The toolbar over the table: search, a filter per column worth narrowing by, and clearing them. */
export function Filters({
  values,
  onChange,
}: {
  values: FilterValues;
  onChange: (values: FilterValues) => void;
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
          placeholder="Search by name or domain"
          aria-label="Search customers"
        />
        <TextInput.Suffix inner>
          <TextInput.ClearButton />
        </TextInput.Suffix>
      </TextInput>
      <FilterButton
        label="Segment"
        placeholder="Segment"
        options={segmentOptions}
        value={values.segments}
        onChange={(segments) => set({ segments })}
        clearFilterAriaLabel="Clear segment filter"
      />
      <FilterButton
        label="Owner"
        placeholder="Owner"
        options={ownerOptions}
        value={values.owners}
        onChange={(owners) => set({ owners })}
        clearFilterAriaLabel="Clear owner filter"
      />
      <FilterButton
        label="Health"
        placeholder="Health"
        options={healthOptions}
        value={values.health}
        onChange={(health) => set({ health })}
        clearFilterAriaLabel="Clear health filter"
      />
      {isFiltered(values) && (
        <Button size="sm" variant="secondary" preset="ghost" onClick={() => onChange(NO_FILTERS)}>
          Clear filters
        </Button>
      )}
    </div>
  );
}

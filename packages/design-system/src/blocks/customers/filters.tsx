import { RiSearchLine } from '@remixicon/react';
import { FilterButton, Select, TextInput } from '@wideset/react';

import { healthOptions, ownerOptions, planOptions, type SortKey, sortOptions } from './data';

export type FilterValues = { query: string; plans: string[]; owners: string[]; health: string[] };

/** The toolbar over the table: search, a filter per column worth narrowing by, and the sort. */
export function Filters({
  values,
  onChange,
  sort,
  onSortChange,
}: {
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
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
        label="Plan"
        placeholder="Plan"
        options={planOptions}
        value={values.plans}
        onChange={(plans) => set({ plans })}
        clearFilterAriaLabel="Clear plan filter"
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
      <Select
        size="sm"
        preset="ghost"
        aria-label="Sort customers"
        options={sortOptions}
        value={sort}
        onValueChange={(value) => onSortChange(value as SortKey)}
        className="ml-auto w-auto"
      />
    </div>
  );
}

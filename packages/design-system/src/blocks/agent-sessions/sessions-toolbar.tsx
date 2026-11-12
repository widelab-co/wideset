import { RiSearchLine } from '@remixicon/react';
import { FilterButton, TextInput } from '@wideset/react';

import { stateOptions } from './data';

export type FilterValues = { query: string; states: string[] };

type SessionsToolbarProps = {
  values: FilterValues;
  onChange: (values: FilterValues) => void;
};

/**
 * The toolbar over the list: a search by name or branch, then the filter by state. The states
 * are a filter, not tabs, so nothing here counts sessions: the list is for working through.
 */
export function SessionsToolbar({ values, onChange }: SessionsToolbarProps) {
  return (
    <div className="gap-ws-5 flex flex-wrap items-center">
      <TextInput
        size="sm"
        className="w-[18rem] max-w-full"
        value={values.query}
        onChange={(event) => onChange({ ...values, query: event.target.value })}
      >
        <TextInput.Prefix inner>
          <TextInput.Icon icon={RiSearchLine} />
        </TextInput.Prefix>
        <TextInput.Input
          type="search"
          placeholder="Search by name or branch"
          aria-label="Search this list by name or branch"
        />
        <TextInput.Suffix inner>
          <TextInput.ClearButton aria-label="Clear search" />
        </TextInput.Suffix>
      </TextInput>
      <FilterButton
        label="State"
        placeholder="State"
        options={stateOptions}
        value={values.states}
        onChange={(states) => onChange({ ...values, states })}
        clearFilterAriaLabel="Clear state filter"
      />
    </div>
  );
}

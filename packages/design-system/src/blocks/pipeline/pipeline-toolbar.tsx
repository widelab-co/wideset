import { RiKanbanView2, RiListUnordered, RiSearchLine } from '@remixicon/react';
import { FilterButton, SegmentedControl, TextInput } from '@wideset/react';

import { closeOptions, ownerOptions } from './data';

export type Filters = { query: string; owners: string[]; close: string[] };

/**
 * The controls over the board: search and two filters narrow the deals, and the view switch on
 * the right only changes how they are shown. List is not built yet, so it says so instead of
 * switching.
 */
export function PipelineToolbar({
  filters,
  onFiltersChange,
  onListView,
}: {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onListView: () => void;
}) {
  const set = (next: Partial<Filters>) => onFiltersChange({ ...filters, ...next });

  return (
    <div className="gap-ws-5 flex flex-wrap items-center">
      <TextInput
        size="sm"
        className="w-[18rem] max-w-full"
        value={filters.query}
        onChange={(event) => set({ query: event.target.value })}
      >
        <TextInput.Prefix inner>
          <TextInput.Icon icon={RiSearchLine} />
        </TextInput.Prefix>
        <TextInput.Input
          type="search"
          placeholder="Search deals or customers"
          aria-label="Search deals"
        />
        <TextInput.Suffix inner>
          <TextInput.ClearButton aria-label="Clear search" />
        </TextInput.Suffix>
      </TextInput>
      <FilterButton
        label="Owner"
        placeholder="Owner"
        options={ownerOptions}
        value={filters.owners}
        onChange={(owners) => set({ owners })}
        clearFilterAriaLabel="Clear owner filter"
      />
      <FilterButton
        label="Close date"
        placeholder="Close date"
        options={closeOptions}
        value={filters.close}
        onChange={(close) => set({ close })}
        clearFilterAriaLabel="Clear close date filter"
      />
      <SegmentedControl
        size="sm"
        aria-label="View"
        value="board"
        onValueChange={(value) => value === 'list' && onListView()}
        className="ml-auto"
      >
        <SegmentedControl.Item value="board">
          <SegmentedControl.Icon icon={RiKanbanView2} />
          Board
        </SegmentedControl.Item>
        <SegmentedControl.Item value="list">
          <SegmentedControl.Icon icon={RiListUnordered} />
          List
        </SegmentedControl.Item>
      </SegmentedControl>
    </div>
  );
}

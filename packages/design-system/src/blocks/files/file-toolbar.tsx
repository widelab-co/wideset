import { RiLayoutGridLine, RiListUnordered, RiSearchLine } from '@remixicon/react';
import { FilterButton, SegmentedControl, Select, TextInput } from '@wideset/react';

import { type SortKey, sortOptions, typeOptions, type View } from './data';

type FileToolbarProps = {
  query: string;
  onQueryChange: (query: string) => void;
  types: string[];
  onTypesChange: (types: string[]) => void;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
  /** Left out where the files can only be a list (archive and trash). */
  view?: View;
  onViewChange: (view: View) => void;
};

/**
 * The controls over the files: search and the type filter narrow them, sort and the view switch
 * on the right only rearrange them. The switch is two icons, so each says what it is.
 */
export function FileToolbar({
  query,
  onQueryChange,
  types,
  onTypesChange,
  sort,
  onSortChange,
  view,
  onViewChange,
}: FileToolbarProps) {
  return (
    <div className="gap-ws-5 flex flex-wrap items-center">
      <TextInput
        size="sm"
        className="w-[18rem] max-w-full"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      >
        <TextInput.Prefix inner>
          <TextInput.Icon icon={RiSearchLine} />
        </TextInput.Prefix>
        <TextInput.Input type="search" placeholder="Search files" aria-label="Search files" />
        <TextInput.Suffix inner>
          <TextInput.ClearButton aria-label="Clear search" />
        </TextInput.Suffix>
      </TextInput>
      <FilterButton
        label="Type"
        placeholder="Type"
        options={typeOptions}
        value={types}
        onChange={onTypesChange}
        clearFilterAriaLabel="Clear type filter"
      />
      <div className="gap-ws-5 ml-auto flex items-center">
        <Select
          size="sm"
          preset="border"
          aria-label="Sort files"
          options={sortOptions}
          value={sort}
          onValueChange={(value) => onSortChange(value as SortKey)}
          className="w-auto"
        />
        {view && (
          <SegmentedControl
            size="sm"
            aria-label="View"
            value={view}
            onValueChange={(value) => onViewChange(value as View)}
          >
            <SegmentedControl.Item value="list" icon={RiListUnordered} aria-label="List view" />
            <SegmentedControl.Item value="grid" icon={RiLayoutGridLine} aria-label="Grid view" />
          </SegmentedControl>
        )}
      </div>
    </div>
  );
}

import { FilterButton, Select } from '@wideset/react';

import { RATINGS, type SortKey, sortOptions } from './data';

const ratingOptions = RATINGS.map((rating) => ({
  value: String(rating),
  label: `${rating} ${rating === 1 ? 'star' : 'stars'}`,
}));

type ReviewFiltersProps = {
  /** The ratings to show, as the filter holds them; none means all. */
  ratings: string[];
  onRatingsChange: (ratings: string[]) => void;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
};

/**
 * The bar over the list: narrow by rating on the left, order on the right. The sort is a bordered
 * `Select` so its chevron shows at rest: a ghost one hides it until hover.
 */
export function ReviewFilters({
  ratings,
  onRatingsChange,
  sort,
  onSortChange,
}: ReviewFiltersProps) {
  return (
    <div className="gap-ws-5 flex flex-wrap items-center">
      <FilterButton
        label="Rating"
        placeholder="Rating"
        options={ratingOptions}
        value={ratings}
        onChange={onRatingsChange}
        clearFilterAriaLabel="Clear rating filter"
      />
      <Select
        size="sm"
        preset="border"
        aria-label="Sort reviews"
        options={sortOptions}
        value={sort}
        onValueChange={(value) => onSortChange(value as SortKey)}
        className="ml-auto w-auto"
      />
    </div>
  );
}

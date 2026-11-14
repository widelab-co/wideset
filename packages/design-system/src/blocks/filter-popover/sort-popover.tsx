import { RiArrowDownSLine, RiArrowUpDownLine } from '@remixicon/react';
import { Button, Popup, SegmentedControl, Select } from '@wideset/react';
import { useId } from 'react';

import { type Sort, type SortKey, SORTS } from './conditions';

const SORT_OPTIONS = Object.entries(SORTS).map(([value, { label }]) => ({ value, label }));

/**
 * The sort, in a small popover beside Filter: the field in a select, the direction as two
 * segments named in the field's own words (earliest first, largest first, A to Z). It changes
 * the list as it is set, so it has no footer to confirm.
 */
export function SortPopover({
  sort,
  onSortChange,
}: {
  sort: Sort;
  onSortChange: (sort: Sort) => void;
}) {
  const labelId = useId();
  const directions = SORTS[sort.key];

  return (
    <Popup>
      <Popup.Trigger asChild>
        <Button variant="secondary" preset="border" size="sm">
          <Button.Icon icon={RiArrowUpDownLine} />
          Sort
          <Button.Icon icon={RiArrowDownSLine} />
        </Button>
      </Popup.Trigger>
      <Popup.Container side="bottom" align="end" aria-label="Sort deals" className="w-[20rem]">
        <Popup.Content contentClassName="gap-ws-5 flex flex-col">
          <span id={labelId} className="typography-label-strong-sm text-ws-static-strong">
            Sort by
          </span>
          <Select
            size="sm"
            preset="border"
            aria-labelledby={labelId}
            options={SORT_OPTIONS}
            value={sort.key}
            onValueChange={(key) => onSortChange({ ...sort, key: key as SortKey })}
            className="w-full"
          />
          <SegmentedControl
            size="sm"
            variant="fullWidth"
            aria-label="Direction"
            value={sort.direction}
            onValueChange={(direction) =>
              direction && onSortChange({ ...sort, direction: direction as Sort['direction'] })
            }
          >
            <SegmentedControl.Item value="asc">{directions.asc}</SegmentedControl.Item>
            <SegmentedControl.Item value="desc">{directions.desc}</SegmentedControl.Item>
          </SegmentedControl>
        </Popup.Content>
      </Popup.Container>
    </Popup>
  );
}

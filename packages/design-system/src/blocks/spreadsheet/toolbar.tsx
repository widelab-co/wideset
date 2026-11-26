import {
  RiFilter3Line,
  RiFolder3Line,
  RiMoreFill,
  RiPaletteLine,
  RiSortDesc,
} from '@remixicon/react';
import { Button, IconButton, SegmentedControl } from '@wideset/react';

// The grid is always sorted by one field: the table's own order, or the column a header menu set.
const TOOLS = [
  { label: 'Filter', icon: RiFilter3Line },
  { label: 'Group', icon: RiFolder3Line },
  { label: 'Sorted by 1 field', icon: RiSortDesc },
  { label: 'Color', icon: RiPaletteLine },
  { label: 'More', icon: RiMoreFill },
];

/**
 * The view's tools over the grid, no line of their own (the grid's top edge is the line): the
 * view switch and what shapes the rows, then sharing.
 */
export function Toolbar() {
  return (
    <div className="h-ws-19 px-ws-11 flex shrink-0 items-center justify-between">
      <div className="gap-ws-5 flex items-center">
        {/* The List view is yours to build; until then the grid stays a table. */}
        <SegmentedControl size="sm" defaultValue="table" aria-label="View">
          <SegmentedControl.Item value="table">Table</SegmentedControl.Item>
          <SegmentedControl.Item value="list">List</SegmentedControl.Item>
        </SegmentedControl>
        <div className="gap-ws-2 flex items-center">
          {TOOLS.map(({ label, icon }) => (
            <Button key={label} variant="secondary" preset="ghost" size="sm">
              <Button.Icon icon={icon} />
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div className="gap-ws-5 flex items-center">
        <Button variant="secondary" preset="border" size="sm">
          Share
        </Button>
        <Button variant="secondary" preset="border" size="sm">
          Export
        </Button>
        <IconButton
          variant="secondary"
          preset="ghost"
          size="sm"
          icon={RiMoreFill}
          aria-label="More actions"
        />
      </div>
    </div>
  );
}

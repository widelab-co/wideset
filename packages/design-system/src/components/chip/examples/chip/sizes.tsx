/**
 * Medium is the default. Small fits dense filter bars and table cells; large gives the chip more
 * presence and a bigger hit area on touch screens. Chips in one row share a size.
 */
import { Chip } from '@wideset/react';

export default function ChipSizes() {
  return (
    <div className="gap-ws-12 flex flex-wrap items-center">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Chip key={size} size={size}>
          <Chip.Action>
            <Chip.Label>Remote only</Chip.Label>
          </Chip.Action>
        </Chip>
      ))}
    </div>
  );
}

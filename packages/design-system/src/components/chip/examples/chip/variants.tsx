/**
 * Primary gives the chip brand emphasis, for selected filters and values the user just applied.
 * Secondary is quieter, for suggestions and supporting metadata.
 */
import { Chip } from '@wideset/react';

export default function ChipVariants() {
  return (
    <div className="gap-ws-12 flex flex-wrap items-center">
      <Chip variant="primary">
        <Chip.Label>Remote only</Chip.Label>
      </Chip>
      <Chip variant="secondary">
        <Chip.Label>Full time</Chip.Label>
      </Chip>
    </div>
  );
}

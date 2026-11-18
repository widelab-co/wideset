/**
 * Primary gives the chip brand emphasis, for selected filters and values the user just applied.
 * Secondary is quieter, for suggestions and supporting metadata. Chip.Action supplies the main
 * button; omit it when the label should be passive and only a removal button is needed.
 */
import { Chip } from '@wideset/react';

export default function ChipVariants() {
  return (
    <div className="gap-ws-12 flex flex-wrap items-center">
      <Chip variant="primary">
        <Chip.Action>
          <Chip.Label>Remote only</Chip.Label>
        </Chip.Action>
      </Chip>
      <Chip variant="secondary">
        <Chip.Action>
          <Chip.Label>Full time</Chip.Label>
        </Chip.Action>
      </Chip>
    </div>
  );
}

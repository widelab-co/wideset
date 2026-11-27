/**
 * The consumer owns selection: this example toggles a filter through Action's onClick and exposes
 * its state with aria-pressed. `disabled` on Chip disables both buttons and skips them in the tab
 * order; use it while an option is temporarily unavailable.
 */
import { Chip } from '@wideset/react';
import { useState } from 'react';

export default function ChipStates() {
  const [remoteOnly, setRemoteOnly] = useState(false);

  return (
    <div className="gap-ws-12 flex flex-wrap items-center">
      <Chip style={remoteOnly ? 'filled' : 'border'}>
        <Chip.Action aria-pressed={remoteOnly} onClick={() => setRemoteOnly(!remoteOnly)}>
          <Chip.Label>Remote only</Chip.Label>
        </Chip.Action>
      </Chip>
      <Chip disabled>
        <Chip.Action>
          <Chip.Label>Unavailable filter</Chip.Label>
        </Chip.Action>
        <Chip.IconButton aria-label="Remove unavailable filter" />
      </Chip>
    </div>
  );
}

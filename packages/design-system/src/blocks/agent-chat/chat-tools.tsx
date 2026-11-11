import { RiAttachment2, RiGlobalLine, RiSearchEyeLine } from '@remixicon/react';
import { Chip } from '@wideset/react';
import { useState } from 'react';

import { IconAction } from './icon-action';

/**
 * Chat's tools in the composer: attach, then two toggles for what the agent may reach for, the
 * web and a longer research run. A toggle that is on takes the brand colour on its outline and
 * label, the mark of a selected thing; it never fills, so Send stays the one filled button.
 */
export function ChatTools() {
  const [web, setWeb] = useState(true);
  const [research, setResearch] = useState(false);

  return (
    <>
      <IconAction label="Attach files" icon={RiAttachment2} />
      <Chip
        variant={web ? 'primary' : 'secondary'}
        style="border"
        aria-pressed={web}
        onClick={() => setWeb(!web)}
      >
        <Chip.Icon icon={RiGlobalLine} />
        Web search
      </Chip>
      <Chip
        variant={research ? 'primary' : 'secondary'}
        style="border"
        aria-pressed={research}
        onClick={() => setResearch(!research)}
      >
        <Chip.Icon icon={RiSearchEyeLine} />
        Research
      </Chip>
    </>
  );
}

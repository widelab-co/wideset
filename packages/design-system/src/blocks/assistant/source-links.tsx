import {
  type RemixiconComponentType,
  RiMailLine,
  RiRecordCircleLine,
  RiStickyNoteLine,
} from '@remixicon/react';
import { Button } from '@wideset/react';

import type { Source } from './data';

const ICON: Record<Source['kind'], RemixiconComponentType> = {
  email: RiMailLine,
  call: RiRecordCircleLine,
  note: RiStickyNoteLine,
};

/**
 * Where an answer comes from, as small links under it: an e-mail, a call recording, a note, each
 * named by whose and when, each opening its source. They are quiet bordered xs buttons on
 * links, since Chip is a button and cannot be a link.
 */
export function SourceLinks({ sources }: { sources: Source[] }) {
  return (
    <ul aria-label="Sources" className="gap-ws-3 flex flex-wrap">
      {sources.map((source) => (
        <li key={source.id}>
          <Button asChild variant="secondary" preset="border" size="xs">
            <a href={source.href}>
              <Button.Icon icon={ICON[source.kind]} />
              {source.label}
            </a>
          </Button>
        </li>
      ))}
    </ul>
  );
}

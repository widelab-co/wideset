import { RiFileList2Line } from '@remixicon/react';
import { Divider } from '@wideset/react';
import { useState } from 'react';

import { Fold } from './fold';
import type { DividerTurn } from './model';
import { Prose } from './prose';
import { Row } from './row';

/**
 * Where the transcript changes for everything after it: a labelled line, so it is plain that
 * what came before is no longer here word for word, and, when there is a summary, one row that
 * opens to what the agent works from instead. The turns under it are the ones kept in full.
 */
export function TranscriptBreak({ turn }: { turn: DividerTurn }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="gap-ws-5 flex flex-col">
      <Divider text={turn.label} aria-label={turn.label} weight="thin" />
      {turn.summary && (
        <div>
          <Row
            mark={
              <RiFileList2Line aria-hidden className="size-ws-9 text-ws-static-subtle shrink-0" />
            }
            open={open}
            onToggle={() => setOpen(!open)}
          >
            <span className="text-ws-static-subtle">{turn.summary.label}</span>
          </Row>
          <Fold open={open}>
            <div className="px-ws-3 py-ws-3">
              <Prose blocks={turn.summary.prose} />
            </div>
          </Fold>
        </div>
      )}
    </div>
  );
}

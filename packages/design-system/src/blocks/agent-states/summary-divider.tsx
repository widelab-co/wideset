// TODO(custom): the line in a transcript where earlier messages were replaced by a summary, and the summary under it; Wideset's Divider carries no label, and the kit has no divider between turns.
import { RiFileList2Line } from '@remixicon/react';
import { useState } from 'react';

import { Fold } from './fold';
import { Prose } from './prose';
import { Row } from './row';

/**
 * Where the transcript now begins: a labelled line, so it is plain that what came before is no
 * longer here word for word, and one row that opens to the summary the agent works from. The
 * turns under it are the ones kept in full.
 */
export function SummaryDivider({ points }: { points: string[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="gap-ws-5 flex flex-col">
      <p className="gap-ws-7 typography-label-sm text-ws-static-subtle flex items-center">
        <span aria-hidden className="border-ws-static-base flex-1 border-t" />
        Earlier messages were summarized
        <span aria-hidden className="border-ws-static-base flex-1 border-t" />
      </p>
      <div>
        <Row
          mark={
            <RiFileList2Line aria-hidden className="size-ws-9 text-ws-static-subtle shrink-0" />
          }
          open={open}
          onToggle={() => setOpen(!open)}
        >
          <span className="text-ws-static-subtle">Summary of the earlier messages</span>
        </Row>
        <Fold open={open}>
          <div className="px-ws-3 py-ws-3">
            <Prose blocks={[{ kind: 'list', items: points }]} />
          </div>
        </Fold>
      </div>
    </div>
  );
}

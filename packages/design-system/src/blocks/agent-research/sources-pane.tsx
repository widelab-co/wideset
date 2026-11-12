import { RiCloseLine } from '@remixicon/react';
import { Select } from '@wideset/react';
import { useEffect, useRef, useState } from 'react';

import { IconAction } from './icon-action';
import type { Prose } from './model';
import { citedIn, type Source, vendors } from './research-data';
import { SourceRow } from './source-row';

const ALL = 'all';

type SourcesPaneProps = {
  id: string;
  /** The sources read so far, in the order they were read. */
  sources: Source[];
  /** The one being read right now, if the run is at one. */
  readingId?: number;
  /** The report's text as far as it is written: a source says where it is cited once it is. */
  written: Prose[];
  /** The source in focus, from either side: a citation in the report or a row here. */
  active: number | null;
  /** The source a pressed citation keeps in focus. */
  pinned: number | null;
  /** The run is in progress: new sources arrive at the foot of the list, which follows them. */
  live: boolean;
  onPeek: (source: number | null) => void;
  onClose: () => void;
};

/**
 * What the report rests on: the right part of the chat's own card, set off by one vertical line,
 * with a bar as high as the chat's so the two lines meet. The bar holds the name, how many
 * sources were read (this is a list that counts: it grows as the run reads), the vendor filter
 * and Close. Under it the sources in the order they were read, which is the order of their
 * numbers, so a `3` in the report is the third row here. The pinned source stays in the list
 * whatever the filter says, since a citation that points at nothing would be a broken link.
 */
export function SourcesPane({
  id,
  sources,
  readingId,
  written,
  active,
  pinned,
  live,
  onPeek,
  onClose,
}: SourcesPaneProps) {
  const [vendor, setVendor] = useState(ALL);
  const list = useRef<HTMLDivElement>(null);

  const read = sources.filter((source) => source.id !== readingId).length;
  const shown = sources.filter(
    (source) =>
      vendor === ALL || source.id === pinned || source.vendors.some((name) => name === vendor),
  );

  // While the run reads, the list follows its newest source.
  useEffect(() => {
    if (live && list.current) list.current.scrollTop = list.current.scrollHeight;
  }, [live, sources.length]);

  return (
    <aside
      id={id}
      aria-label="Sources"
      aria-busy={live}
      className="border-ws-static-base flex w-[26rem] shrink-0 flex-col border-l"
    >
      <header className="h-ws-18 border-ws-static-base gap-ws-5 pl-ws-11 pr-ws-7 flex shrink-0 items-center border-b">
        <h2 className="typography-label-strong-md text-ws-static-strong">Sources</h2>
        <p aria-live="polite" className="typography-label-sm text-ws-static-subtle tabular-nums">
          {read > 0 && (vendor === ALL ? `${read} read` : `${shown.length} of ${read}`)}
        </p>
        <Select
          size="sm"
          preset="border"
          aria-label="Vendor"
          className="ml-auto w-[9.5rem]"
          options={[
            { value: ALL, label: 'All vendors' },
            ...vendors.map((name) => ({ value: name, label: name })),
          ]}
          value={vendor}
          onValueChange={setVendor}
        />
        <IconAction label="Close sources" icon={RiCloseLine} onClick={onClose} />
      </header>
      {/* `relative`: the rows' screen-reader text is absolutely placed, and would otherwise stretch
          the page under the fold instead of scrolling with the list. */}
      <div ref={list} className="relative min-h-0 flex-1 overflow-y-auto">
        {shown.length > 0 ? (
          <ol>
            {shown.map((source) => (
              <SourceRow
                key={source.id}
                source={source}
                reading={source.id === readingId}
                cited={citedIn(source.id, written)}
                active={source.id === active}
                pinned={source.id === pinned}
                live={live}
                onPeek={onPeek}
              />
            ))}
          </ol>
        ) : (
          <p className="typography-body-md text-ws-static-subtle px-ws-11 py-ws-9">
            {sources.length > 0
              ? `Nothing read about ${vendor} yet.`
              : 'Sources appear here as they are read.'}
          </p>
        )}
      </div>
    </aside>
  );
}

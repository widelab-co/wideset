// TODO(custom): a search result row (40px avatar or file tile, title, context line); ListItem is the 32px menu row, Wideset has no larger result row.
import type { RemixiconComponentType } from '@remixicon/react';
import { Avatar, cn } from '@wideset/react';

import { Highlight } from './highlight';

export type SearchResult = {
  id: string;
  /** What is searched and shown first: a person's name or a file's name. */
  title: string;
  /** The line under it: when the person was last active, or where the file lives. */
  detail: string;
} & (
  | { kind: 'person'; initials: string; online: boolean }
  | { kind: 'file'; icon: RemixiconComponentType }
);

/**
 * One result, an option of the list the search field drives: the field keeps the focus, so the
 * row never takes it and `active` (the arrow keys, or the pointer) is its only highlight. A line
 * splits it from the row above, as in Figma, drawn by the row so the list holds only options.
 */
export function SearchResultRow({
  result,
  query,
  active,
  id,
  onActivate,
  onOpen,
}: {
  result: SearchResult;
  query: string;
  active: boolean;
  id: string;
  onActivate: () => void;
  onOpen: () => void;
}) {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- the search field holds the focus and its keys open the active option
    <li
      id={id}
      role="option"
      aria-selected={active}
      className="border-ws-static-base not-first:mt-ws-5 not-first:pt-ws-5 not-first:border-t"
      onPointerMove={onActivate}
      onClick={onOpen}
    >
      <div
        className={cn(
          'gap-ws-9 p-ws-5 rounded-ws-container-md flex cursor-pointer items-center',
          active && 'bg-ws-dynamic-tertiary-alpha-hover',
        )}
      >
        {result.kind === 'person' ? (
          <Avatar
            size="lg"
            aria-hidden="true"
            initials={result.initials}
            // Figma's dot for someone away is grey: Avatar's `unavailable` (`offline` is red).
            status={result.online ? 'online' : 'unavailable'}
          />
        ) : (
          <Avatar size="lg" shape="square" aria-hidden="true" icon={<result.icon />} />
        )}
        <div className="gap-ws-2 flex min-w-0 flex-col">
          <span className="typography-label-strong-sm text-ws-static-strong truncate">
            <Highlight text={result.title} query={query} />
          </span>
          <span className="typography-body-md text-ws-static-subtle truncate">{result.detail}</span>
        </div>
      </div>
    </li>
  );
}

// TODO(custom): a search result row (40px avatar or file tile, title, context line); ListItem is the 32px menu row, Wideset has no larger result row.
import { RiFileTextLine } from '@remixicon/react';
import { Avatar, cn } from '@wideset/react';

import type { Article } from './data';
import { Highlight } from './highlight';

/**
 * One article found, an option of the list the search field drives: the field keeps the focus,
 * so the row never takes it and `active` (the arrow keys, or the pointer) is its only highlight.
 * A line splits it from the row above, drawn by the row so the list holds only options. Copied
 * from the search modal, with the file tile kept for an article.
 */
export function SearchResultRow({
  article,
  query,
  active,
  id,
  onActivate,
  onOpen,
}: {
  article: Article;
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
        <Avatar size="lg" shape="square" aria-hidden="true" icon={<RiFileTextLine />} />
        <div className="gap-ws-2 flex min-w-0 flex-col">
          <span className="typography-label-strong-sm text-ws-static-strong truncate">
            <Highlight text={article.title} query={query} />
          </span>
          <span className="typography-body-md text-ws-static-subtle truncate">
            {article.topic}, {article.minutes} min read
          </span>
        </div>
      </div>
    </li>
  );
}

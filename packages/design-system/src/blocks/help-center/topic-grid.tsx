import { RiArrowRightLine } from '@remixicon/react';
import { ActionTile } from '@wideset/react';
import { useId } from 'react';

import { topics } from './data';

/**
 * The topics as outlined tiles, each one link: its name and what it covers. No article count:
 * the page is for finding an answer, not for counting. The tiles go somewhere, so each ends in
 * an arrow; no icon badges, which would add a colour per tile.
 */
export function TopicGrid() {
  const id = useId();

  return (
    <section aria-labelledby={id} className="gap-ws-9 flex flex-col">
      <h2 id={id} className="typography-label-strong-md text-ws-static-strong">
        Browse by topic
      </h2>
      <ul className="gap-ws-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <li key={topic.id} className="flex">
            <ActionTile href={`#topics/${topic.id}`} className="items-start">
              <div className="gap-ws-3 flex min-w-0 flex-1 flex-col">
                <ActionTile.Title>{topic.title}</ActionTile.Title>
                <ActionTile.Description>{topic.summary}</ActionTile.Description>
              </div>
              <ActionTile.Icon icon={RiArrowRightLine} />
            </ActionTile>
          </li>
        ))}
      </ul>
    </section>
  );
}

import { RiArrowRightLine } from '@remixicon/react';
import { ActionTile } from '@wideset/react';
import { useId } from 'react';

import { resources } from './data';

/**
 * Help under the checklist, for when a step needs more than its one line. The tiles go
 * somewhere, so each ends in an arrow; no icon badges, which would add a colour per tile.
 */
export function Resources() {
  const id = useId();

  return (
    <section aria-labelledby={id} className="gap-ws-9 flex flex-col">
      <h2 id={id} className="typography-label-strong-md text-ws-static-strong">
        Learn as you go
      </h2>
      <ul className="gap-ws-5 grid grid-cols-1 sm:grid-cols-3">
        {resources.map((resource) => (
          <li key={resource.id}>
            <ActionTile
              title={resource.title}
              description={resource.description}
              icon={RiArrowRightLine}
              href={resource.href}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

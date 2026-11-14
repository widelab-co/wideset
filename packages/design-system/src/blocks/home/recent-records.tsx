// TODO(custom): record link row (icon, name, kind); ListItem is a div with no link of its own, ActionTile is a bordered tile.
import {
  type RemixiconComponentType,
  RiContactsBook3Line,
  RiHandCoinLine,
  RiPieChart2Line,
} from '@remixicon/react';
import { useId } from 'react';

import type { RecordKind } from './data';

// The icon of the page the record lives on, as the sidebar draws it.
const ICONS: Record<RecordKind, RemixiconComponentType> = {
  Customer: RiContactsBook3Line,
  Deal: RiHandCoinLine,
  Report: RiPieChart2Line,
};

type RecentRecordsProps = { records: { id: string; kind: RecordKind; name: string }[] };

/**
 * The records opened last, newest first: a way back to where the work was. Each row is one link
 * across its width; the fill on hover reaches past the text so the icons stay on the column's
 * edge.
 */
export function RecentRecords({ records }: RecentRecordsProps) {
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className="gap-ws-7 flex flex-col">
      <h2 id={titleId} className="typography-label-strong-md text-ws-static-strong">
        Recently opened
      </h2>
      <ul className="-mx-ws-5 flex flex-col">
        {records.map(({ id, kind, name }) => {
          const Icon = ICONS[kind];
          return (
            <li key={id}>
              <a
                href={`#${kind.toLowerCase()}-${id}`}
                className="h-ws-15 gap-ws-5 px-ws-5 rounded-ws-control-lg hover:bg-ws-dynamic-secondary-alpha-hover focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex items-center"
              >
                <Icon aria-hidden="true" className="size-ws-9 text-ws-static-subtle shrink-0" />
                <span className="typography-label-sm text-ws-static-strong min-w-0 flex-1 truncate">
                  {name}
                </span>
                <span className="typography-label-sm text-ws-static-subtle">{kind}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

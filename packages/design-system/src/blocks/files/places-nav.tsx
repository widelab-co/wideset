// TODO(custom): a list of places inside the page, drawn like Sidebar.Item, which throws outside a Sidebar; no NavList in Wideset.
import {
  type RemixiconComponentType,
  RiAddLine,
  RiArchiveLine,
  RiDeleteBinLine,
  RiFolder3Line,
  RiPushpinLine,
  RiStackLine,
  RiTimeLine,
  RiUserSharedLine,
} from '@remixicon/react';
import { Divider, IconButton } from '@wideset/react';
import { useId } from 'react';

import { type Collection, PLACE_LABEL, type PlaceId } from './data';

type PlaceRow = { id: PlaceId; label: string; icon: RemixiconComponentType };

const TOP: PlaceRow[] = [
  { id: 'all', label: PLACE_LABEL.all, icon: RiFolder3Line },
  { id: 'pinned', label: PLACE_LABEL.pinned, icon: RiPushpinLine },
  { id: 'shared', label: PLACE_LABEL.shared, icon: RiUserSharedLine },
  { id: 'recent', label: PLACE_LABEL.recent, icon: RiTimeLine },
];

const BOTTOM: PlaceRow[] = [
  { id: 'archive', label: PLACE_LABEL.archive, icon: RiArchiveLine },
  { id: 'trash', label: PLACE_LABEL.trash, icon: RiDeleteBinLine },
];

/** One place: one target across the row, the neutral fill on the open one, as in the sidebar. */
function Place({
  label,
  icon: Icon,
  current,
  onSelect,
}: {
  label: string;
  icon: RemixiconComponentType;
  current: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        aria-current={current ? 'page' : undefined}
        onClick={onSelect}
        className="group gap-ws-5 px-ws-5 h-ws-14 rounded-ws-control-lg typography-label-strong-sm text-ws-static-base hover:bg-ws-dynamic-tertiary-alpha-strong-default hover:text-ws-static-strong aria-[current=page]:bg-ws-dynamic-tertiary-alpha-strong-default aria-[current=page]:text-ws-static-strong focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex w-full items-center text-left focus-visible:-outline-offset-2"
      >
        <Icon
          aria-hidden="true"
          className="size-ws-10 text-ws-static-subtle group-aria-[current=page]:text-ws-static-strong shrink-0"
        />
        <span className="min-w-0 flex-1 truncate">{label}</span>
      </button>
    </li>
  );
}

/**
 * The places a file can be found from, in a narrow column inside the page: every file, the ones
 * pinned or shared with you, what changed lately, then the collections, which gather files from
 * any folder, and last what has been put away. The open place is the selected row.
 */
export function PlacesNav({
  place,
  collections,
  onSelect,
  onNewCollection,
}: {
  place: PlaceId;
  collections: Collection[];
  onSelect: (place: PlaceId) => void;
  onNewCollection: () => void;
}) {
  const collectionsId = useId();
  const row = ({ id, label, icon }: PlaceRow) => (
    <Place
      key={id}
      label={label}
      icon={icon}
      current={place === id}
      onSelect={() => onSelect(id)}
    />
  );

  return (
    <nav aria-label="Places" className="gap-ws-9 flex flex-col">
      <ul className="flex flex-col">{TOP.map(row)}</ul>

      <section aria-labelledby={collectionsId} className="gap-ws-2 flex flex-col">
        <div className="flex items-center justify-between">
          <h2
            id={collectionsId}
            className="typography-caption-strong-md text-ws-static-subtle px-ws-5 py-ws-3"
          >
            Collections
          </h2>
          <IconButton
            icon={RiAddLine}
            variant="secondary"
            preset="ghost"
            size="xs"
            aria-label="New collection"
            onClick={onNewCollection}
            className="mr-ws-3"
          />
        </div>
        <ul className="flex flex-col">
          {collections.map(({ id, name }) =>
            row({ id: `c:${id}`, label: name, icon: RiStackLine }),
          )}
        </ul>
      </section>

      <Divider weight="thin" />
      <ul className="flex flex-col">{BOTTOM.map(row)}</ul>
    </nav>
  );
}

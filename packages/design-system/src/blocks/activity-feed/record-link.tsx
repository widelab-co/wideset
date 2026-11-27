// TODO(custom): record link row (icon, name, detail); ListItem is a div with no link of its own, ActionTile is a bordered tile.
import {
  type RemixiconComponentType,
  RiAttachment2,
  RiContactsBook3Line,
  RiHandCoinLine,
} from '@remixicon/react';

import type { Subject, SubjectKind } from './data';

// The icon of the page the record lives on, as the sidebar draws it; a file takes the paperclip.
const ICONS: Record<SubjectKind, RemixiconComponentType> = {
  Customer: RiContactsBook3Line,
  Deal: RiHandCoinLine,
  File: RiAttachment2,
};

/**
 * What a post is about (a deal, a customer, a file), as one quiet link across the column: no box,
 * so the post stays one object. The fill on hover reaches past the text so the icon stays on the
 * column's edge.
 */
export function RecordLink({ subject }: { subject: Subject }) {
  const Icon = ICONS[subject.kind];

  return (
    <a
      href={`#${subject.kind.toLowerCase()}`}
      className="h-ws-15 gap-ws-5 px-ws-5 -mx-ws-5 rounded-ws-control-lg hover:bg-ws-dynamic-secondary-alpha-hover focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex items-center"
    >
      <Icon aria-hidden="true" className="size-ws-9 text-ws-static-subtle shrink-0" />
      <span className="typography-label-sm text-ws-static-strong min-w-0 flex-1 truncate">
        {subject.name}
      </span>
      <span className="typography-label-sm text-ws-static-subtle shrink-0 tabular-nums">
        {subject.detail}
      </span>
    </a>
  );
}

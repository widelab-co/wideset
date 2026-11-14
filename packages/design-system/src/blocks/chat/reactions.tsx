import {
  type RemixiconComponentType,
  RiCheckLine,
  RiEyeLine,
  RiThumbUpLine,
} from '@remixicon/react';
import { Chip } from '@wideset/react';

import type { Reaction, ReactionKind } from './data';

/** Each reaction's icon and what it says. */
export const REACTIONS: Record<ReactionKind, { icon: RemixiconComponentType; label: string }> = {
  like: { icon: RiThumbUpLine, label: 'Like' },
  done: { icon: RiCheckLine, label: 'Done' },
  seen: { icon: RiEyeLine, label: 'Seen' },
};

type ReactionsProps = { reactions: Reaction[]; onToggle: (kind: ReactionKind) => void };

/**
 * The reactions under a message: small neutral chips, an icon and how many. The ones the
 * signed-in user gave are filled, the rest outlined; a click adds or takes back their own.
 */
export function Reactions({ reactions, onToggle }: ReactionsProps) {
  return (
    <div className="gap-ws-3 pt-ws-3 flex flex-wrap">
      {reactions.map(({ kind, count, mine }) => (
        <Chip
          key={kind}
          size="sm"
          variant="secondary"
          style={mine ? 'filled' : 'border'}
          aria-pressed={mine}
          aria-label={`${REACTIONS[kind].label}, ${count}`}
          onClick={() => onToggle(kind)}
        >
          <Chip.Icon icon={REACTIONS[kind].icon} />
          <span className="tabular-nums">{count}</span>
        </Chip>
      ))}
    </div>
  );
}

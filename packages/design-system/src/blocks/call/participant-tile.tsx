// TODO(custom): a person's tile on the call stage (avatar, name, muted mark, speaking outline); Wideset has no video or participant tile.
import { RiMicOffLine } from '@remixicon/react';
import { Avatar, cn } from '@wideset/react';

import type { Participant } from './data';

type ParticipantTileProps = {
  person: Participant;
  speaking: boolean;
  /** In the strip under a shared screen: a smaller avatar and less room. */
  compact?: boolean;
};

/**
 * One person on the call, drawn without a camera: their avatar large in the middle, their name
 * at the foot and, when their microphone is off, a quiet mark beside it. Whoever is speaking
 * takes a thin light outline; it moves between tiles without a fade when motion is reduced.
 */
export function ParticipantTile({ person, speaking, compact = false }: ParticipantTileProps) {
  return (
    <li
      className={cn(
        'bg-ws-static-foreground rounded-ws-container-md relative flex min-h-0 min-w-0 items-center justify-center outline-2 -outline-offset-2 transition-[outline-color] duration-(--ws-motion-duration-fast) ease-(--ws-motion-ease-out) motion-reduce:transition-none',
        speaking ? 'outline-ws-static-inverse-background' : 'outline-transparent',
      )}
    >
      <Avatar
        size={compact ? 'lg' : '2xl'}
        initials={person.initials}
        color={person.color}
        aria-hidden
      />
      <p
        className={cn(
          'gap-ws-3 absolute flex max-w-full min-w-0 items-center',
          compact ? 'bottom-ws-3 left-ws-5 right-ws-5' : 'bottom-ws-7 left-ws-9 right-ws-9',
        )}
      >
        <span
          className={cn(
            'text-ws-static-strong truncate',
            compact ? 'typography-caption-strong-md' : 'typography-label-strong-sm',
          )}
        >
          {person.you ? `${person.name} (you)` : person.name}
        </span>
        {person.muted && (
          <RiMicOffLine
            role="img"
            aria-label="Muted"
            className="size-ws-8 text-ws-static-subtle shrink-0"
          />
        )}
        {speaking && <span className="sr-only">, speaking</span>}
      </p>
    </li>
  );
}

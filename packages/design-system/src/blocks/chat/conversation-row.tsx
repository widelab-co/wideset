// TODO(custom): chat list row (channel sign or avatar with presence, name, muted sign, unread dot); Sidebar.Item is a navigation link and ListItem a menu row with a brand-tinted checked state.
import { RiHashtag, RiNotificationOffLine } from '@remixicon/react';
import { Avatar, cn } from '@wideset/react';

import type { Conversation } from './data';

type ConversationRowProps = {
  conversation: Conversation;
  selected: boolean;
  onSelect: () => void;
};

/**
 * One conversation in the list: one target across the whole row, the height of a sidebar item.
 * Unread is weight and a dot, never a number; a muted one shows the sign instead and stays
 * quiet. The open one takes the neutral selected fill.
 */
export function ConversationRow({ conversation, selected, onSelect }: ConversationRowProps) {
  const { kind, name, members, muted } = conversation;
  const unread = conversation.unread && !muted;
  return (
    <button
      type="button"
      aria-current={selected || undefined}
      onClick={onSelect}
      className={cn(
        'gap-ws-5 px-ws-5 h-ws-forms-sm rounded-ws-control-lg flex w-full items-center text-left',
        'hover:bg-ws-static-alpha-subtle aria-[current=true]:bg-ws-dynamic-tertiary-alpha-strong-default',
        'focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default focus-visible:-outline-offset-2',
      )}
    >
      {kind === 'channel' ? (
        <span className="size-ws-11 flex shrink-0 items-center justify-center">
          <RiHashtag aria-hidden className="size-ws-9 text-ws-static-subtle" />
        </span>
      ) : (
        <Avatar size="xs" initials={members[0].initials} status={members[0].status} />
      )}
      <span
        className={cn(
          'min-w-0 flex-1 truncate',
          unread
            ? 'typography-body-strong-md text-ws-static-strong'
            : 'typography-body-md text-ws-static-base',
        )}
      >
        {name}
      </span>
      {muted && (
        <RiNotificationOffLine
          role="img"
          aria-label="Muted"
          className="size-ws-8 text-ws-static-subtle shrink-0"
        />
      )}
      {unread && (
        <span className="bg-ws-dynamic-primary-default rounded-ws-control-full size-ws-4 shrink-0">
          <span className="sr-only">Unread</span>
        </span>
      )}
    </button>
  );
}

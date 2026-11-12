import {
  type RemixiconComponentType,
  RiHashtag,
  RiLogoutBoxRLine,
  RiMoreLine,
  RiNotificationLine,
  RiNotificationOffLine,
  RiPhoneLine,
  RiPushpinLine,
  RiVidiconLine,
} from '@remixicon/react';
import { Avatar, cn, DropdownMenu, IconButton, ListItem, Tooltip } from '@wideset/react';
import type { ReactNode } from 'react';

import { COLUMN } from './column';
import type { Conversation } from './data';

const ghost = { variant: 'secondary', preset: 'ghost', size: 'sm' } as const;

/** Names a header button on hover and focus; the button keeps its own `aria-label`. */
function Hint({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Tooltip size="sm">
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Content side="bottom">
        <Tooltip.Label>{label}</Tooltip.Label>
      </Tooltip.Content>
    </Tooltip>
  );
}

function MenuItem({ icon: Icon, label }: { icon: RemixiconComponentType; label: string }) {
  return (
    <>
      <ListItem.Prefix>
        <Icon className="size-ws-9" />
      </ListItem.Prefix>
      <ListItem.Content>
        <ListItem.Label>{label}</ListItem.Label>
      </ListItem.Content>
    </>
  );
}

type ConversationHeaderProps = {
  conversation: Conversation;
  /** The id of the conversation's name, which labels the whole pane. */
  titleId: string;
  onToggleMute: () => void;
};

/**
 * The head of the open conversation: what it is and who is in it on the left; calling and the
 * rest (mute, pin, leave) on the right, as quiet icon buttons. A channel shows its sign, its
 * topic and its members' faces; a direct message shows the person, their presence and their role.
 */
export function ConversationHeader({
  conversation,
  titleId,
  onToggleMute,
}: ConversationHeaderProps) {
  const { kind, name, topic, members, muted } = conversation;
  const person = members[0];
  return (
    <header className="h-ws-20 border-ws-static-subtle shrink-0 border-b">
      <div className={cn(COLUMN, 'gap-ws-9 flex h-full items-center')}>
        <div className="gap-ws-7 flex min-w-0 flex-1 items-center">
          {kind === 'direct' && <Avatar initials={person.initials} status={person.status} />}
          <div className="flex min-w-0 flex-col">
            <h1
              id={titleId}
              className="gap-ws-2 typography-label-strong-md text-ws-static-strong flex items-center"
            >
              {kind === 'channel' && (
                <RiHashtag aria-hidden className="size-ws-9 text-ws-static-subtle shrink-0" />
              )}
              <span className="truncate">{name}</span>
              {muted && (
                <RiNotificationOffLine
                  role="img"
                  aria-label="Muted"
                  className="size-ws-9 ml-ws-3 text-ws-static-subtle shrink-0"
                />
              )}
            </h1>
            <p className="typography-caption-md text-ws-static-subtle truncate">
              {kind === 'channel' ? topic : person.role}
            </p>
          </div>
        </div>

        {kind === 'channel' && (
          <Avatar.Group size="sm" aria-label="Members" role="group" className="w-fit shrink-0">
            {members.map((member) => (
              <Avatar
                key={member.name}
                initials={member.initials}
                color={member.color}
                aria-label={member.name}
              />
            ))}
          </Avatar.Group>
        )}

        <div className="gap-ws-3 flex shrink-0 items-center">
          <Hint label="Start a call">
            <IconButton {...ghost} icon={RiPhoneLine} aria-label="Start a call" />
          </Hint>
          <Hint label="Start a video call">
            <IconButton {...ghost} icon={RiVidiconLine} aria-label="Start a video call" />
          </Hint>
          <DropdownMenu>
            <Hint label="More actions">
              <DropdownMenu.Trigger asChild>
                <IconButton {...ghost} icon={RiMoreLine} aria-label="More actions" />
              </DropdownMenu.Trigger>
            </Hint>
            <DropdownMenu.Content align="end" className="w-[14rem]">
              <DropdownMenu.Item onSelect={onToggleMute}>
                <MenuItem
                  icon={muted ? RiNotificationLine : RiNotificationOffLine}
                  label={muted ? 'Unmute' : 'Mute'}
                />
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                <MenuItem icon={RiPushpinLine} label="Pin" />
              </DropdownMenu.Item>
              {kind === 'channel' && (
                <>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item variant="danger">
                    <MenuItem icon={RiLogoutBoxRLine} label="Leave channel" />
                  </DropdownMenu.Item>
                </>
              )}
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

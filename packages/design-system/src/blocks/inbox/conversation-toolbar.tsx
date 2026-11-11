import {
  type RemixiconComponentType,
  RiArchiveLine,
  RiMailOpenLine,
  RiMailUnreadLine,
  RiMoreLine,
  RiNotificationOffLine,
  RiPrinterLine,
  RiShareForwardLine,
  RiSpam2Line,
  RiStarFill,
  RiStarLine,
} from '@remixicon/react';
import { DropdownMenu, IconButton, ListItem, Tooltip } from '@wideset/react';
import type { ReactNode } from 'react';

const ghost = { variant: 'secondary', preset: 'ghost', size: 'sm' } as const;

/** Names a toolbar button on hover and focus; the button keeps its own `aria-label`. */
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

type ConversationToolbarProps = {
  starred: boolean;
  unread: boolean;
  onArchive: () => void;
  onToggleStar: () => void;
  onToggleRead: () => void;
};

/**
 * What to do with the open conversation: quiet icon buttons, each named by its label and a
 * tooltip, and a menu for the rest. None is filled: the page's one primary is Send.
 */
export function ConversationToolbar({
  starred,
  unread,
  onArchive,
  onToggleStar,
  onToggleRead,
}: ConversationToolbarProps) {
  const star = starred ? 'Remove star' : 'Star';
  const read = unread ? 'Mark as read' : 'Mark as unread';
  return (
    <div role="toolbar" aria-label="Conversation" className="gap-ws-3 flex shrink-0 items-center">
      <Hint label="Archive">
        <IconButton {...ghost} icon={RiArchiveLine} aria-label="Archive" onClick={onArchive} />
      </Hint>
      <Hint label={star}>
        <IconButton
          {...ghost}
          icon={starred ? RiStarFill : RiStarLine}
          aria-label={star}
          aria-pressed={starred}
          onClick={onToggleStar}
        />
      </Hint>
      <Hint label={read}>
        <IconButton
          {...ghost}
          icon={unread ? RiMailOpenLine : RiMailUnreadLine}
          aria-label={read}
          onClick={onToggleRead}
        />
      </Hint>
      <DropdownMenu>
        <Hint label="More actions">
          <DropdownMenu.Trigger asChild>
            <IconButton {...ghost} icon={RiMoreLine} aria-label="More actions" />
          </DropdownMenu.Trigger>
        </Hint>
        <DropdownMenu.Content align="end" className="w-[14rem]">
          <DropdownMenu.Item>
            <MenuItem icon={RiShareForwardLine} label="Forward" />
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <MenuItem icon={RiPrinterLine} label="Print" />
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <MenuItem icon={RiNotificationOffLine} label="Mute conversation" />
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item variant="danger">
            <MenuItem icon={RiSpam2Line} label="Report spam" />
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  );
}

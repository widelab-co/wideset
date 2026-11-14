import {
  type RemixiconComponentType,
  RiFlagLine,
  RiLinkM,
  RiMoreFill,
  RiNotification3Line,
  RiNotificationOffLine,
} from '@remixicon/react';
import { DropdownMenu, IconButton, ListItem } from '@wideset/react';

type PostMenuProps = {
  /** Whose post it is, for the button's name. */
  author: string;
  following: boolean;
  onFollow: () => void;
  onCopyLink: () => void;
  onReport: () => void;
};

const Item = ({
  icon: Icon,
  label,
  onSelect,
}: {
  icon: RemixiconComponentType;
  label: string;
  onSelect: () => void;
}) => (
  <DropdownMenu.Item onSelect={onSelect}>
    <ListItem.Prefix>
      <Icon className="size-ws-9" />
    </ListItem.Prefix>
    <ListItem.Content>
      <ListItem.Label>{label}</ListItem.Label>
    </ListItem.Content>
  </DropdownMenu.Item>
);

/**
 * What else a post can do, behind the ⋯ at the end of its first line: follow its thread, copy
 * its link, report it. Reporting sits apart, under a line: it is the one that tells someone.
 */
export function PostMenu({ author, following, onFollow, onCopyLink, onReport }: PostMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton
          icon={RiMoreFill}
          size="sm"
          variant="secondary"
          preset="ghost"
          aria-label={`More actions for ${author}’s post`}
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" className="w-[14rem]">
        <Item
          icon={following ? RiNotificationOffLine : RiNotification3Line}
          label={following ? 'Unfollow thread' : 'Follow thread'}
          onSelect={onFollow}
        />
        <Item icon={RiLinkM} label="Copy link" onSelect={onCopyLink} />
        <DropdownMenu.Separator />
        <Item icon={RiFlagLine} label="Report" onSelect={onReport} />
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}

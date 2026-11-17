import { RiFlagLine, RiLinkM, RiMoreFill } from '@remixicon/react';
import { cn, DropdownMenu, IconButton, ListItem } from '@wideset/react';

type ItemMenuProps = {
  /** Names the button: `Leo Marchetti’s comment`. */
  label: string;
  onCopyLink: () => void;
  onReport: () => void;
  className?: string;
};

/**
 * What else a post or a comment can do, behind the ⋯ at the end of its first line: copy its link,
 * or report it. Report sits apart, under a line: it is the one that tells someone.
 */
export function ItemMenu({ label, onCopyLink, onReport, className }: ItemMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton
          icon={RiMoreFill}
          size="xs"
          variant="secondary"
          preset="ghost"
          aria-label={`More actions for ${label}`}
          className={cn('shrink-0', className)}
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" className="w-[13rem]">
        <DropdownMenu.Item onSelect={onCopyLink}>
          <ListItem.Prefix>
            <RiLinkM className="size-ws-9" />
          </ListItem.Prefix>
          <ListItem.Content>
            <ListItem.Label>Copy link</ListItem.Label>
          </ListItem.Content>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onSelect={onReport}>
          <ListItem.Prefix>
            <RiFlagLine className="size-ws-9" />
          </ListItem.Prefix>
          <ListItem.Content>
            <ListItem.Label>Report</ListItem.Label>
          </ListItem.Content>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}

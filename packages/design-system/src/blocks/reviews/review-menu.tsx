import { RiFlagLine, RiLinkM, RiMoreFill } from '@remixicon/react';
import { DropdownMenu, IconButton, ListItem } from '@wideset/react';

type ReviewMenuProps = {
  /** Whose review it is, for the button's name. */
  customer: string;
  onCopyLink: () => void;
  onReport: () => void;
  className?: string;
};

/**
 * What else a review can do, behind the ⋯ at the end of its first line: copy its link, or report
 * it to Orbit when it breaks the rules. Reporting sits under a line: it is the one that tells
 * someone.
 */
export function ReviewMenu({ customer, onCopyLink, onReport, className }: ReviewMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton
          icon={RiMoreFill}
          size="sm"
          variant="secondary"
          preset="ghost"
          aria-label={`More actions for ${customer}’s review`}
          className={className}
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" className="w-[14rem]">
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

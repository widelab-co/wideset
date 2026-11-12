// TODO(custom): a context menu that opens where the row was right-clicked; Wideset exports no ContextMenu (Radix ContextMenu), so a DropdownMenu opens from an invisible 0×0 trigger moved to the pointer, or laid over the ⋯ button or the row's first cell.
import {
  type RemixiconComponentType,
  RiArchiveLine,
  RiArrowRightLine,
  RiDeleteBinLine,
  RiExternalLinkLine,
  RiFileCopyLine,
  RiLinkM,
  RiPriceTag3Line,
  RiUserSharedLine,
} from '@remixicon/react';
import { DropdownMenu, ListItem } from '@wideset/react';
import { useRef } from 'react';

import { type Customer, PEOPLE, type PersonId, type TagId, TAGS } from './data';
import { MODIFIER, Shortcut } from './keyboard-key';
import { MenuCheck } from './menu-check';
import { MenuChoice } from './menu-choice';
import { MenuSub } from './menu-sub';
import { PersonAvatar } from './person-avatar';

export type MenuAction = 'open' | 'open-new-tab' | 'copy-link' | 'duplicate' | 'archive' | 'delete';

/** Where the menu opens from, in viewport pixels, and where the focus goes back to. */
export type MenuAnchor = {
  /** The box the menu hangs from: the pointer (0 by 0), the ⋯ button, or the row's first cell. */
  x: number;
  y: number;
  width: number;
  height: number;
  /** `start` from the pointer or the row, `end` under the ⋯ button, as its own menu would. */
  align: 'start' | 'end';
  /** The row or the button the menu was opened from; it takes the focus back on close. */
  origin: HTMLElement | null;
};

/** The shortcuts the menu shows, which the rows also answer to. */
export const SHORTCUTS: Partial<Record<MenuAction, string[]>> = {
  open: ['Enter'],
  'open-new-tab': [MODIFIER, 'Enter'],
  'copy-link': [MODIFIER, 'C'],
  duplicate: [MODIFIER, 'D'],
  archive: ['E'],
  delete: ['Del'],
};

type CustomerMenuProps = {
  /** The customer the menu is for; kept while the menu closes, so its rows do not change. */
  customer: Customer;
  anchor: MenuAnchor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAction: (action: MenuAction) => void;
  onAssign: (owner: PersonId) => void;
  onTagChange: (tag: TagId, on: boolean) => void;
};

/**
 * The actions on one customer, the same menu wherever it opens from: a right-click on the row,
 * its ⋯ button, or Shift F10 and the Menu key on a focused row. Grouped by what they do to the
 * record: go to it, copy it, hand it over or label it, put it away, and Delete last and red.
 * Every row with a shortcut shows its keys, which work on the focused row too. Assign to and Add
 * tag are submenus; the owner is a choice of one, the tags toggle and keep the menu open.
 */
export function CustomerMenu({
  customer,
  anchor,
  open,
  onOpenChange,
  onAction,
  onAssign,
  onTagChange,
}: CustomerMenuProps) {
  // Delete opens a dialog: it waits until the menu has closed and given the focus back, so the
  // dialog returns it to the row too.
  const afterClose = useRef<MenuAction>(undefined);

  const command = (action: MenuAction, Icon: RemixiconComponentType, label: string) => {
    const keys = SHORTCUTS[action];
    return (
      <DropdownMenu.Item
        variant={action === 'delete' ? 'danger' : undefined}
        onSelect={() => {
          if (action === 'delete') afterClose.current = action;
          else onAction(action);
        }}
      >
        <ListItem.Prefix>
          <Icon className="size-ws-9" />
        </ListItem.Prefix>
        <ListItem.Content>
          <ListItem.Label>{label}</ListItem.Label>
        </ListItem.Content>
        {keys && (
          <ListItem.Suffix>
            <Shortcut keys={keys} />
          </ListItem.Suffix>
        )}
      </DropdownMenu.Item>
    );
  };

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenu.Trigger asChild>
        {/* The anchor's box is the pointer's or the control's, known only at run time. */}
        <span
          aria-hidden="true"
          className="pointer-events-none fixed"
          style={{ left: anchor.x, top: anchor.y, width: anchor.width, height: anchor.height }}
        >
          <span className="sr-only">{`Actions for ${customer.name}`}</span>
        </span>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        side="bottom"
        align={anchor.align}
        sideOffset={anchor.width === 0 ? 2 : 4}
        collisionPadding={12}
        className="w-[16rem]"
        // The browser's own menu must not open over this one.
        onContextMenu={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => {
          // Closed with a click, the menu has already kept the focus where it is; closed with the
          // keyboard, the focus goes back to the row or the button, never to the hidden anchor.
          const byPointer = event.defaultPrevented;
          event.preventDefault();
          if (!byPointer && anchor.origin?.isConnected) anchor.origin.focus();
          const action = afterClose.current;
          afterClose.current = undefined;
          if (action) onAction(action);
        }}
      >
        {command('open', RiArrowRightLine, 'Open')}
        {command('open-new-tab', RiExternalLinkLine, 'Open in new tab')}
        <DropdownMenu.Separator />
        {command('copy-link', RiLinkM, 'Copy link')}
        {command('duplicate', RiFileCopyLine, 'Duplicate')}
        <DropdownMenu.Separator />
        <MenuSub icon={RiUserSharedLine} label="Assign to">
          <DropdownMenu.RadioGroup
            aria-label="Owner"
            value={customer.owner}
            onValueChange={(value) => onAssign(value as PersonId)}
          >
            {(Object.keys(PEOPLE) as PersonId[]).map((id) => (
              <MenuChoice key={id} value={id}>
                <ListItem.Prefix>
                  <PersonAvatar
                    size="xs"
                    name={PEOPLE[id].name}
                    initials={PEOPLE[id].initials}
                    color={PEOPLE[id].color}
                  />
                </ListItem.Prefix>
                <ListItem.Content>
                  <ListItem.Label>{PEOPLE[id].name}</ListItem.Label>
                </ListItem.Content>
              </MenuChoice>
            ))}
          </DropdownMenu.RadioGroup>
        </MenuSub>
        <MenuSub icon={RiPriceTag3Line} label="Add tag">
          {TAGS.map((tag) => (
            <MenuCheck
              key={tag.id}
              checked={customer.tags.includes(tag.id)}
              onCheckedChange={(on) => onTagChange(tag.id, on)}
            >
              <ListItem.Content>
                <ListItem.Label>{tag.label}</ListItem.Label>
              </ListItem.Content>
            </MenuCheck>
          ))}
        </MenuSub>
        <DropdownMenu.Separator />
        {command('archive', RiArchiveLine, 'Archive')}
        <DropdownMenu.Separator />
        {command('delete', RiDeleteBinLine, 'Delete')}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}

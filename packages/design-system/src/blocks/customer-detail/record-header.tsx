import {
  type RemixiconComponentType,
  RiAddLine,
  RiDeleteBinLine,
  RiEditLine,
  RiLinkM,
  RiMailLine,
  RiMoreFill,
  RiPhoneLine,
} from '@remixicon/react';
import { Avatar, Button, DropdownMenu, IconButton, ListItem, StatusBadge } from '@wideset/react';

import { customer } from './data';

const MENU: { label: string; icon: RemixiconComponentType }[] = [
  { label: 'Edit details', icon: RiEditLine },
  { label: 'Log a call', icon: RiPhoneLine },
  { label: 'Copy link', icon: RiLinkM },
];

/** The record's header: who the customer is, then what to do with them, primary last. */
export function RecordHeader() {
  return (
    <header className="gap-ws-12 flex flex-wrap items-center justify-between">
      <div className="gap-ws-9 flex min-w-0 items-center">
        <Avatar
          size="xl"
          shape="square"
          initials={customer.initials}
          color="indigo"
          aria-hidden="true"
        />
        <div className="gap-ws-2 flex min-w-0 flex-col">
          <div className="gap-ws-7 flex items-center">
            <h1 className="typography-title-md text-ws-static-strong">{customer.name}</h1>
            {/* Active is a healthy state, so it takes the positive colour. */}
            <StatusBadge size="lg" color="positive">
              {customer.status}
            </StatusBadge>
          </div>
          <p className="typography-body-md text-ws-static-subtle">{customer.domain}</p>
        </div>
      </div>

      <div className="gap-ws-5 flex items-center">
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <IconButton
              icon={RiMoreFill}
              variant="secondary"
              preset="border"
              size="sm"
              aria-label="More actions"
            />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end" className="w-[14rem]">
            {MENU.map(({ label, icon: Icon }) => (
              <DropdownMenu.Item key={label}>
                <ListItem.Prefix>
                  <Icon className="size-ws-9" />
                </ListItem.Prefix>
                <ListItem.Content>
                  <ListItem.Label>{label}</ListItem.Label>
                </ListItem.Content>
              </DropdownMenu.Item>
            ))}
            <DropdownMenu.Separator />
            <DropdownMenu.Item variant="danger">
              <ListItem.Prefix>
                <RiDeleteBinLine className="size-ws-9" />
              </ListItem.Prefix>
              <ListItem.Content>
                <ListItem.Label>Delete customer</ListItem.Label>
              </ListItem.Content>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
        <Button variant="secondary" preset="border" size="sm">
          <Button.Icon icon={RiMailLine} />
          Email
        </Button>
        <Button size="sm">
          <Button.Icon icon={RiAddLine} />
          New deal
        </Button>
      </div>
    </header>
  );
}

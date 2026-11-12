// TODO(custom): account menu is composed by hand.
import { RiArrowDownSLine } from '@remixicon/react';
import { Avatar, DropdownMenu, ListItem, Sidebar } from '@wideset/react';
import { useState } from 'react';

import { BrandMark } from './brand-mark';
import { account, navigation, ROLE_LABEL, workspace, workspaceNavigation } from './data';

/** The account menu: who is signed in, their settings and sign-out. */
function AccountMenu() {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="gap-ws-5 px-ws-5 py-ws-3 rounded-ws-control-lg hover:bg-ws-dynamic-tertiary-alpha-strong-default focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex w-full items-center text-left"
        >
          <Avatar initials={account.initials} status="online" />
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="typography-label-strong-sm text-ws-static-base truncate">
              {account.name}
            </span>
            <span className="typography-label-sm text-ws-static-subtle truncate">
              {ROLE_LABEL[account.role]}
            </span>
          </span>
          <RiArrowDownSLine aria-hidden="true" className="size-ws-9 text-ws-static-strong" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content side="top" align="start" className="w-[13.875rem]">
        <DropdownMenu.Item>
          <ListItem.Prefix>
            <Avatar initials={account.initials} status="online" />
          </ListItem.Prefix>
          <ListItem.Content>
            <ListItem.Label>{account.name}</ListItem.Label>
            <ListItem.Description>{account.email}</ListItem.Description>
          </ListItem.Content>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>
          <ListItem.Content>
            <ListItem.Label>Account</ListItem.Label>
          </ListItem.Content>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <ListItem.Content>
            <ListItem.Label>Preferences</ListItem.Label>
          </ListItem.Content>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item variant="danger">
          <ListItem.Content>
            <ListItem.Label>Log out</ListItem.Label>
          </ListItem.Content>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}

/** The app sidebar (Frame direction: a grey tint beside the white page). */
export function TeamSidebar() {
  const [active, setActive] = useState('team');

  const item = ({ id, label, icon }: (typeof navigation)[number]) => (
    <Sidebar.Item
      key={id}
      href={`#${id}`}
      icon={icon}
      label={label}
      active={active === id}
      onClick={() => setActive(id)}
    />
  );

  const nav = (
    <nav aria-label="Main" className="gap-ws-7 flex flex-col">
      <div className="flex flex-col">{navigation.map(item)}</div>
      <Sidebar.Group label="Workspace">{workspaceNavigation.map(item)}</Sidebar.Group>
    </nav>
  );

  return (
    <Sidebar surface="tinted">
      <Sidebar.Header>
        <Sidebar.Expanded>
          <div className="gap-ws-7 py-ws-3 pl-ws-5 flex items-center">
            <BrandMark />
            <span className="typography-label-strong-sm text-ws-dynamic-secondary-default min-w-0 flex-1 truncate">
              {workspace.name}
            </span>
            <Sidebar.Trigger />
          </div>
        </Sidebar.Expanded>
        <Sidebar.Collapsed>
          <div className="gap-ws-7 flex flex-col items-center">
            <BrandMark label={workspace.name} />
            <Sidebar.Trigger />
          </div>
        </Sidebar.Collapsed>
      </Sidebar.Header>

      <Sidebar.Section scrollable>
        <Sidebar.Expanded>{nav}</Sidebar.Expanded>
        <Sidebar.Collapsed>{nav}</Sidebar.Collapsed>
      </Sidebar.Section>

      <Sidebar.Footer>
        <Sidebar.Expanded>
          <AccountMenu />
        </Sidebar.Expanded>
        <Sidebar.Collapsed>
          <Avatar initials={account.initials} status="online" aria-label={account.name} />
        </Sidebar.Collapsed>
      </Sidebar.Footer>
    </Sidebar>
  );
}

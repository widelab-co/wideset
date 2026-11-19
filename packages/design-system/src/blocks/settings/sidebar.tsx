// TODO(custom): account menu is composed by hand.
import { RiArrowDownSLine } from '@remixicon/react';
import { Avatar, DropdownMenu, ListItem, Sidebar } from '@wideset/react';

import { BrandMark } from './brand-mark';
import { account, navigation } from './data';

/** The account menu: who is signed in, their workspaces and sign-out. */
function AccountMenu({ email }: { email: string }) {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="gap-ws-5 px-ws-5 py-ws-3 rounded-ws-control-lg hover:bg-ws-dynamic-tertiary-alpha-strong-default focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex w-full items-center text-left"
        >
          <Avatar initials={account.initials} color={account.color} />
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="typography-label-strong-sm text-ws-static-base truncate">
              {account.name}
            </span>
            <span className="typography-label-sm text-ws-static-subtle truncate">
              {account.role}
            </span>
          </span>
          <RiArrowDownSLine aria-hidden="true" className="size-ws-9 text-ws-static-strong" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content side="top" align="start" className="w-[13.875rem]">
        <DropdownMenu.Item>
          <ListItem.Prefix>
            <Avatar initials={account.initials} color={account.color} />
          </ListItem.Prefix>
          <ListItem.Content>
            <ListItem.Label>{account.name}</ListItem.Label>
            <ListItem.Description>{email}</ListItem.Description>
          </ListItem.Content>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>
          <ListItem.Content>
            <ListItem.Label>Switch workspace</ListItem.Label>
          </ListItem.Content>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <ListItem.Content>
            <ListItem.Label>Keyboard shortcuts</ListItem.Label>
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

/** The app sidebar (Frame direction: a grey tint beside the white page), Settings open. */
export function AppSidebar({ workspaceName, email }: { workspaceName: string; email: string }) {
  const nav = (
    <nav aria-label="Main" className="flex flex-col">
      {navigation.map(({ id, label, icon, count }) => (
        <Sidebar.Item
          key={id}
          href={`#${id}`}
          icon={icon}
          label={label}
          active={id === 'settings'}
          suffix={count}
        />
      ))}
    </nav>
  );

  return (
    <Sidebar surface="tinted">
      <Sidebar.Header>
        <Sidebar.Expanded>
          <div className="gap-ws-7 py-ws-3 pl-ws-5 flex items-center">
            <BrandMark />
            <span className="typography-label-strong-sm text-ws-dynamic-secondary-default min-w-0 flex-1 truncate">
              {workspaceName}
            </span>
            <Sidebar.Trigger />
          </div>
        </Sidebar.Expanded>
        <Sidebar.Collapsed>
          <div className="gap-ws-7 flex flex-col items-center">
            <BrandMark label={workspaceName} />
            <Sidebar.Trigger />
          </div>
        </Sidebar.Collapsed>
      </Sidebar.Header>

      <Sidebar.Section scrollable>{nav}</Sidebar.Section>

      <Sidebar.Footer>
        <Sidebar.Expanded>
          <AccountMenu email={email} />
        </Sidebar.Expanded>
        <Sidebar.Collapsed>
          <Avatar initials={account.initials} color={account.color} aria-label={account.name} />
        </Sidebar.Collapsed>
      </Sidebar.Footer>
    </Sidebar>
  );
}

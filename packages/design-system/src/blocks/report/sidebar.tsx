// TODO(custom): account menu trigger is composed by hand; no account switcher in Wideset.
import { RiArrowDownSLine } from '@remixicon/react';
import { Avatar, DropdownMenu, ListItem, Sidebar } from '@wideset/react';
import { useState } from 'react';

import { BrandMark } from './brand-mark';
import { ACCOUNT, NAVIGATION, REPORTS, WORKSPACE } from './data';

/** The account menu: who is signed in, their settings and sign-out. */
function AccountMenu() {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="gap-ws-5 px-ws-5 py-ws-3 rounded-ws-control-lg hover:bg-ws-dynamic-tertiary-alpha-strong-default focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex w-full items-center text-left"
        >
          <Avatar initials={ACCOUNT.initials} status="online" />
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="typography-label-strong-sm text-ws-static-base truncate">
              {ACCOUNT.name}
            </span>
            <span className="typography-label-sm text-ws-static-subtle truncate">
              {ACCOUNT.role}
            </span>
          </span>
          <RiArrowDownSLine aria-hidden="true" className="size-ws-9 text-ws-static-strong" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content side="top" align="start" className="w-[13.875rem]">
        <DropdownMenu.Item>
          <ListItem.Prefix>
            <Avatar initials={ACCOUNT.initials} status="online" />
          </ListItem.Prefix>
          <ListItem.Content>
            <ListItem.Label>{ACCOUNT.name}</ListItem.Label>
            <ListItem.Description>{ACCOUNT.email}</ListItem.Description>
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

/** The app sidebar (Canvas direction: no fill and no line, on the grey canvas beside the page). */
export function ReportSidebar() {
  const [active, setActive] = useState('revenue');

  const item = ({ id, label, icon, count }: (typeof NAVIGATION)[number]) => (
    <Sidebar.Item
      key={id}
      href={`#${id}`}
      icon={icon}
      label={label}
      suffix={count}
      active={active === id}
      onClick={() => setActive(id)}
    />
  );

  const nav = (
    <nav aria-label="Main" className="gap-ws-7 flex flex-col">
      <div className="flex flex-col">{NAVIGATION.map(item)}</div>
      <div role="group" aria-labelledby="sidebar-reports" className="gap-ws-2 flex flex-col">
        <Sidebar.SectionHeader id="sidebar-reports">Reports</Sidebar.SectionHeader>
        {REPORTS.map(item)}
      </div>
    </nav>
  );

  return (
    <Sidebar>
      <Sidebar.Header>
        <Sidebar.Expanded>
          <div className="gap-ws-7 py-ws-3 pl-ws-5 flex items-center">
            <BrandMark />
            <span className="typography-label-strong-sm text-ws-static-strong min-w-0 flex-1 truncate">
              {WORKSPACE.name}
            </span>
            <Sidebar.Trigger />
          </div>
        </Sidebar.Expanded>
        <Sidebar.Collapsed>
          <div className="gap-ws-7 flex flex-col items-center">
            <BrandMark label={WORKSPACE.name} />
            <Sidebar.Trigger />
          </div>
        </Sidebar.Collapsed>
      </Sidebar.Header>

      <Sidebar.Section scrollable>{nav}</Sidebar.Section>

      <Sidebar.Footer>
        <Sidebar.Expanded>
          <AccountMenu />
        </Sidebar.Expanded>
        <Sidebar.Collapsed>
          <Avatar initials={ACCOUNT.initials} status="online" aria-label={ACCOUNT.name} />
        </Sidebar.Collapsed>
      </Sidebar.Footer>
    </Sidebar>
  );
}

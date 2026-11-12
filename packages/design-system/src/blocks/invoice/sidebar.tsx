// TODO(custom): workspace switcher and account menu are composed by hand.
import {
  RiAddLine,
  RiArrowDownSLine,
  RiLogoutBoxRLine,
  RiSearchLine,
  RiSettingsLine,
} from '@remixicon/react';
import {
  Divider,
  DropdownMenu,
  IconButton,
  ListItem,
  Sidebar,
  type SidebarProps,
  TextInput,
} from '@wideset/react';
import { useState } from 'react';

import { BrandMark } from './brand-mark';
import {
  account,
  helpLink,
  mainLinks,
  type NavLink,
  product,
  settingsLinks,
  workspace,
} from './data';
import { PersonAvatar } from './person-avatar';

/**
 * The workspace sidebar: switcher, search, the app's pages, settings and the signed-in account.
 * Its toggle sits in the page bar, so the screen holds `collapsed` and passes it down; collapsed,
 * it keeps the mark, the page icons and the avatar.
 */
export function InvoiceSidebar(
  props: Pick<SidebarProps, 'id' | 'collapsed' | 'onCollapsedChange'>,
) {
  const [active, setActive] = useState('billing');

  const link = ({ id, label, icon, activeIcon }: NavLink) => (
    <Sidebar.Item
      key={id}
      href={`#${id}`}
      icon={active === id ? (activeIcon ?? icon) : icon}
      label={label}
      active={active === id}
      onClick={() => setActive(id)}
    />
  );

  const nav = (
    <nav aria-label="Workspace" className="gap-ws-9 flex flex-col">
      <div className="flex flex-col">{mainLinks.map(link)}</div>
      <Divider weight="thin" />
      <Sidebar.Group label="Settings">{settingsLinks.map(link)}</Sidebar.Group>
    </nav>
  );

  return (
    <Sidebar surface="frame" {...props}>
      <Sidebar.Header>
        <Sidebar.Expanded>
          <div className="gap-ws-9 flex flex-col">
            <div className="gap-ws-7 pt-ws-3 pb-ws-7 flex items-center">
              <BrandMark className="size-ws-15" />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="typography-label-strong-sm text-ws-static-strong truncate">
                  {workspace.name}
                </span>
                <span className="typography-caption-md text-ws-static-subtle truncate">
                  {product.name}
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenu.Trigger asChild>
                  <IconButton
                    icon={RiArrowDownSLine}
                    variant="secondary"
                    preset="ghost"
                    size="xs"
                    aria-label="Switch workspace"
                    className="mr-ws-3"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="end">
                  <DropdownMenu.Item data-state="checked">
                    <ListItem.Content>
                      <ListItem.Label>{workspace.name}</ListItem.Label>
                    </ListItem.Content>
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item>
                    <ListItem.Prefix>
                      <RiAddLine className="size-ws-9" />
                    </ListItem.Prefix>
                    <ListItem.Content>
                      <ListItem.Label>New workspace</ListItem.Label>
                    </ListItem.Content>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu>
            </div>
            <TextInput size="sm">
              <TextInput.Prefix inner>
                <TextInput.Icon icon={RiSearchLine} />
              </TextInput.Prefix>
              <TextInput.Input type="search" placeholder="Search" aria-label="Search" />
            </TextInput>
          </div>
        </Sidebar.Expanded>
        <Sidebar.Collapsed>
          <div className="pt-ws-3 pb-ws-7 flex justify-center">
            <BrandMark className="size-ws-15" />
          </div>
        </Sidebar.Collapsed>
      </Sidebar.Header>

      {/* A section draws only the slot for the state it is in, so the pages go in both. */}
      <Sidebar.Section scrollable>
        <Sidebar.Expanded>{nav}</Sidebar.Expanded>
        <Sidebar.Collapsed>{nav}</Sidebar.Collapsed>
      </Sidebar.Section>

      <Sidebar.Footer>
        <div className="gap-ws-9 flex flex-col">
          <div className="flex flex-col">{link(helpLink)}</div>
          {/* On the grey ground the line keeps the nav's inset: run edge to edge, it would stop
              short of the page and read as broken. */}
          <div className="border-ws-static-base pt-ws-5 border-t">
            <Sidebar.Expanded>
              <DropdownMenu>
                <DropdownMenu.Trigger asChild>
                  <button
                    type="button"
                    className="gap-ws-5 px-ws-5 py-ws-3 rounded-ws-control-lg hover:bg-ws-dynamic-tertiary-alpha-strong-default focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex w-full items-center text-left"
                  >
                    <PersonAvatar name={account.name} initials={account.initials} color="orange" />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="typography-label-strong-sm text-ws-static-base truncate">
                        {account.name}
                      </span>
                      <span className="typography-caption-md text-ws-static-subtle truncate">
                        {account.email}
                      </span>
                    </span>
                    <RiArrowDownSLine
                      aria-hidden="true"
                      className="size-ws-9 text-ws-static-strong"
                    />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content side="top" align="start" className="w-[14rem]">
                  <DropdownMenu.Item>
                    <ListItem.Prefix>
                      <RiSettingsLine className="size-ws-9" />
                    </ListItem.Prefix>
                    <ListItem.Content>
                      <ListItem.Label>Account settings</ListItem.Label>
                    </ListItem.Content>
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item variant="danger">
                    <ListItem.Prefix>
                      <RiLogoutBoxRLine className="size-ws-9" />
                    </ListItem.Prefix>
                    <ListItem.Content>
                      <ListItem.Label>Log out</ListItem.Label>
                    </ListItem.Content>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu>
            </Sidebar.Expanded>
            <Sidebar.Collapsed>
              <div className="flex justify-center">
                <PersonAvatar
                  name={account.name}
                  initials={account.initials}
                  color="orange"
                  alt={account.name}
                  title={account.name}
                />
              </div>
            </Sidebar.Collapsed>
          </div>
        </div>
      </Sidebar.Footer>
    </Sidebar>
  );
}

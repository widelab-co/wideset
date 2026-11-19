// TODO(custom): workspace switcher and account menu are composed by hand.
import { RiAddLine, RiArrowDownSLine, RiSearchLine } from '@remixicon/react';
import {
  Divider,
  DropdownMenu,
  IconButton,
  ListItem,
  Sidebar,
  type SidebarProps,
  TextInput,
} from '@wideset/react';
import { type ReactNode, useState } from 'react';

import { BrandMark } from './brand-mark';
import {
  type Account,
  helpLink,
  mainLinks,
  type NavLink,
  product,
  settingsLinks,
  type Workspace,
} from './data';
import { PersonAvatar } from './person-avatar';

/**
 * The workspace sidebar: switcher, search, the app's pages, settings and the signed-in account,
 * whose row opens the account menu (passed in, since the screen holds what it changes).
 * Its toggle sits in the page bar, so the screen holds `collapsed` and passes it down; collapsed,
 * it keeps the mark, the page icons and the avatar.
 */
export function WorkspaceSidebar({
  workspace,
  account,
  accountMenu,
  ...props
}: Pick<SidebarProps, 'id' | 'collapsed' | 'onCollapsedChange'> & {
  /** The workspace open now, named at the top. */
  workspace: Workspace;
  /** Who is signed in, for the avatar left when the sidebar is collapsed. */
  account: Account;
  /** The account row and the menu it opens, at the foot. */
  accountMenu: ReactNode;
}) {
  const [active, setActive] = useState('home');

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
      <div role="group" aria-labelledby="sidebar-settings" className="gap-ws-2 flex flex-col">
        <Sidebar.SectionHeader id="sidebar-settings">Settings</Sidebar.SectionHeader>
        {settingsLinks.map(link)}
      </div>
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
      <Sidebar.Section scrollable>{nav}</Sidebar.Section>

      <Sidebar.Footer>
        <div className="gap-ws-9 flex flex-col">
          <div className="flex flex-col">{link(helpLink)}</div>
          {/* On the grey ground the line keeps the nav's inset: run edge to edge, it would stop
              short of the page and read as broken. */}
          <div className="border-ws-static-base pt-ws-5 border-t">
            <Sidebar.Expanded>{accountMenu}</Sidebar.Expanded>
            <Sidebar.Collapsed>
              <div className="flex justify-center">
                <PersonAvatar
                  name={account.name}
                  initials={account.initials}
                  color={account.color}
                  title={account.name}
                  alt={account.name}
                />
              </div>
            </Sidebar.Collapsed>
          </div>
        </div>
      </Sidebar.Footer>
    </Sidebar>
  );
}

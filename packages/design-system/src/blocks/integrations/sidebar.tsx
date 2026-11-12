// TODO(custom): workspace switcher and account menu are composed by hand.
import { RiAddLine, RiArrowDownSLine, RiLogoutBoxRLine, RiSettingsLine } from '@remixicon/react';
import {
  Avatar,
  Divider,
  DropdownMenu,
  IconButton,
  ListItem,
  Sidebar,
  type SidebarProps,
} from '@wideset/react';
import { useState } from 'react';

import { BrandMark } from './brand-mark';
import {
  ACCOUNT,
  HELP_LINK,
  MAIN_LINKS,
  type NavLink,
  PRODUCT,
  SETTINGS_LINKS,
  WORKSPACE,
} from './data';

/**
 * The workspace sidebar: switcher, the app's pages, settings (Integrations is one of them) and the
 * signed-in account. `surface` follows the screen's direction: `page` in Flat, `tinted` in Frame,
 * `frame` in Inset. Its toggle sits in the page bar, so the screen holds `collapsed` and passes it
 * down; collapsed, it keeps the mark, the page icons and the avatar. It has no search of its own:
 * the page's search is the one on this screen.
 */
export function IntegrationsSidebar(
  props: Pick<SidebarProps, 'id' | 'surface' | 'collapsed' | 'onCollapsedChange'>,
) {
  const [active, setActive] = useState('integrations');

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
      <div className="flex flex-col">{MAIN_LINKS.map(link)}</div>
      <Divider weight="thin" />
      <Sidebar.Group label="Settings">{SETTINGS_LINKS.map(link)}</Sidebar.Group>
    </nav>
  );

  return (
    <Sidebar {...props}>
      <Sidebar.Header>
        <Sidebar.Expanded>
          <div className="gap-ws-7 py-ws-3 flex items-center">
            <BrandMark className="size-ws-15" />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="typography-label-strong-sm text-ws-static-strong truncate">
                {WORKSPACE.name}
              </span>
              <span className="typography-caption-md text-ws-static-subtle truncate">
                {PRODUCT.name}
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
                    <ListItem.Label>{WORKSPACE.name}</ListItem.Label>
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
        </Sidebar.Expanded>
        <Sidebar.Collapsed>
          <div className="py-ws-3 flex justify-center">
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
          <div className="flex flex-col">{link(HELP_LINK)}</div>
          {/* The line keeps the nav's inset in every direction: on Inset's grey ground, run edge to
              edge, it would stop short of the page and read as broken. */}
          <div className="border-ws-static-base pt-ws-5 border-t">
            <Sidebar.Expanded>
              <DropdownMenu>
                <DropdownMenu.Trigger asChild>
                  <button
                    type="button"
                    className="gap-ws-5 px-ws-5 py-ws-3 rounded-ws-control-lg hover:bg-ws-dynamic-tertiary-alpha-strong-default focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex w-full items-center text-left"
                  >
                    <Avatar initials={ACCOUNT.initials} color="orange" />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="typography-label-strong-sm text-ws-static-base truncate">
                        {ACCOUNT.name}
                      </span>
                      <span className="typography-caption-md text-ws-static-subtle truncate">
                        {ACCOUNT.email}
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
                <Avatar initials={ACCOUNT.initials} color="orange" title={ACCOUNT.name} />
              </div>
            </Sidebar.Collapsed>
          </div>
        </div>
      </Sidebar.Footer>
    </Sidebar>
  );
}

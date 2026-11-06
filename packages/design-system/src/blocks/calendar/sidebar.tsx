import {
  type RemixiconComponentType,
  RiAddFill,
  RiAddLine,
  RiArrowDownSLine,
  RiLogoutBoxRLine,
  RiSearchLine,
  RiSettingsLine,
} from '@remixicon/react';
import {
  Avatar,
  cn,
  Divider,
  DropdownMenu,
  IconButton,
  ListItem,
  Sidebar,
  TextInput,
} from '@wideset/react';
import { useState } from 'react';

import {
  account,
  footerLinks,
  inboxLinks,
  type NavLink,
  type ProjectColor,
  projects,
  sharedLinks,
  workspace,
} from './data';

const SWATCH: Record<ProjectColor, string> = {
  blue: 'bg-ws-non-semantic-blue-subtle',
  purple: 'bg-ws-non-semantic-purple-subtle',
  teal: 'bg-ws-non-semantic-teal-subtle',
};

/** Figma's Sidebar Item `Type=Thumbnail`: a project's colour square, passed as the item icon. */
const swatch = (color: ProjectColor): RemixiconComponentType => {
  const Swatch = ({ className }: { className?: string }) => (
    <span
      aria-hidden="true"
      className={cn(
        className,
        'rounded-ws-control-md border-ws-static-strong border',
        SWATCH[color],
      )}
    />
  );
  return Swatch;
};

const SWATCH_ICON: Record<ProjectColor, RemixiconComponentType> = {
  blue: swatch('blue'),
  purple: swatch('purple'),
  teal: swatch('teal'),
};

/** Figma's Shortcut chip: ⌘ and a digit. */
function Shortcut({ digit }: { digit: string }) {
  return (
    <kbd className="font-ws-body border-ws-static-base rounded-ws-control-md px-ws-4 py-ws-2 flex items-center border">
      <span className="w-ws-9 text-center">⌘</span>
      {digit}
    </kbd>
  );
}

/** The workspace sidebar: switcher, search, pages, projects and the signed-in account. */
export function CalendarSidebar() {
  const [active, setActive] = useState('documents');

  const link = ({ id, label, icon, activeIcon, shortcut }: NavLink) => (
    <Sidebar.Item
      key={id}
      href={`#${id}`}
      icon={active === id ? (activeIcon ?? icon) : icon}
      label={label}
      active={active === id}
      suffix={shortcut ? <Shortcut digit={shortcut} /> : undefined}
      onClick={() => setActive(id)}
    />
  );

  return (
    <Sidebar surface="frame">
      <Sidebar.Header>
        <div className="gap-ws-9 flex flex-col">
          <div className="gap-ws-7 pt-ws-3 pb-ws-7 flex items-center">
            <Avatar shape="square" initials={workspace.initials} color="brand" />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="typography-label-strong-sm text-ws-dynamic-secondary-default truncate">
                {workspace.name}
              </span>
              <span className="typography-caption-md text-ws-static-subtle truncate">
                {workspace.plan}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <IconButton
                  icon={RiArrowDownSLine}
                  variant="secondary"
                  preset="ghost"
                  size="sm"
                  aria-label="Switch workspace"
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
      </Sidebar.Header>

      <Sidebar.Section scrollable>
        <Sidebar.Expanded>
          <nav aria-label="Workspace" className="gap-ws-9 flex flex-col">
            <div className="flex flex-col">{inboxLinks.map(link)}</div>
            <Divider weight="thin" />
            <div className="relative">
              <Sidebar.Group label="Shared">{sharedLinks.map(link)}</Sidebar.Group>
              <IconButton
                icon={RiAddLine}
                variant="secondary"
                preset="ghost"
                size="xs"
                aria-label="Add a shared page"
                className="top-ws-0 right-ws-0 absolute"
              />
            </div>
            <Sidebar.Group label="Projects">
              {projects.map(({ id, label, color }) => (
                <Sidebar.Item
                  key={id}
                  href={`#${id}`}
                  icon={SWATCH_ICON[color]}
                  label={label}
                  active={active === id}
                  onClick={() => setActive(id)}
                />
              ))}
              <Sidebar.Item
                asChild
                icon={RiAddFill}
                label={<span className="text-ws-static-subtle">Add new project</span>}
              >
                <button type="button" />
              </Sidebar.Item>
            </Sidebar.Group>
          </nav>
        </Sidebar.Expanded>
      </Sidebar.Section>

      <Sidebar.Footer>
        <div className="gap-ws-9 flex flex-col">
          <div className="gap-ws-3 flex flex-col">{footerLinks.map(link)}</div>
          {/* The line runs edge to edge, out of the sidebar's own inset. */}
          <div className="border-ws-static-base -mr-ws-6 -ml-ws-5 pt-ws-5 pr-ws-6 pl-ws-5 border-t">
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  className="gap-ws-5 px-ws-5 py-ws-3 rounded-ws-control-lg hover:bg-ws-dynamic-tertiary-alpha-strong-default focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex w-full items-center text-left"
                >
                  <Avatar initials={account.initials} color="teal" status="online" />
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
          </div>
        </div>
      </Sidebar.Footer>
    </Sidebar>
  );
}

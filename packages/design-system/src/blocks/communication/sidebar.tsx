import { type RemixiconComponentType, RiAddLine, RiArrowDownSLine } from '@remixicon/react';
import {
  Avatar,
  Button,
  cn,
  Divider,
  DropdownMenu,
  ListItem,
  ProgressBar,
  Sidebar,
  Tag,
} from '@wideset/react';
import { useState } from 'react';

import {
  account,
  categories,
  type CategoryColor,
  navigation,
  spaces,
  usage,
  workspace,
} from './data';

const CATEGORY: Record<CategoryColor, { swatch: string; text: string }> = {
  indigo: {
    swatch: 'bg-ws-non-semantic-indigo-strong',
    text: 'text-ws-non-semantic-indigo-on-subtle',
  },
  blue: { swatch: 'bg-ws-non-semantic-blue-strong', text: 'text-ws-non-semantic-blue-on-subtle' },
  cyan: { swatch: 'bg-ws-non-semantic-cyan-strong', text: 'text-ws-non-semantic-cyan-on-subtle' },
};

/** A category's colour square, passed as the item icon. */
const swatch = (color: CategoryColor): RemixiconComponentType => {
  const Swatch = ({ className }: { className?: string }) => (
    <span
      aria-hidden="true"
      className={cn(className, 'rounded-ws-control-md', CATEGORY[color].swatch)}
    />
  );
  return Swatch;
};

const SWATCH_ICON: Record<CategoryColor, RemixiconComponentType> = {
  indigo: swatch('indigo'),
  blue: swatch('blue'),
  cyan: swatch('cyan'),
};

/** The account menu: who is signed in, settings, plan usage and sign-out. */
function AccountMenu() {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="gap-ws-5 px-ws-5 py-ws-3 rounded-ws-control-lg hover:bg-ws-dynamic-tertiary-alpha-strong-default focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex w-full items-center text-left"
        >
          <Avatar initials={account.initials} color={account.color} status="online" />
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
            <Avatar initials={account.initials} color={account.color} status="online" />
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
        <DropdownMenu.Item>
          <ListItem.Content>
            <ListItem.Label>Subscription</ListItem.Label>
          </ListItem.Content>
          <ListItem.Suffix>
            <Tag color="purple">Pro</Tag>
          </ListItem.Suffix>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <ListItem.Content>
            <ListItem.Label>Team</ListItem.Label>
          </ListItem.Content>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <div className="p-ws-7 gap-ws-5 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="typography-label-strong-sm text-ws-dynamic-secondary-default">
              {usage.label}
            </span>
            <span className="typography-body-sm text-ws-static-subtle tabular-nums">
              {usage.used.toLocaleString('en')} / {usage.limit / 1000}K
            </span>
          </div>
          <ProgressBar value={usage.used} max={usage.limit} aria-label={`${usage.label} used`} />
          <span className="typography-body-sm text-ws-static-subtle self-end">{usage.resets}</span>
        </div>
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

/** The app sidebar (Frame direction: it sits on the grey frame). */
export function CommunicationSidebar() {
  const [active, setActive] = useState('chats');

  const nav = (collapsed?: boolean) => (
    <nav aria-label="Main" className="gap-ws-7 flex flex-col">
      <div className="flex flex-col">
        {navigation.map(({ id, label, icon, count }) => (
          <Sidebar.Item
            key={id}
            href={`#${id}`}
            icon={icon}
            label={label}
            active={active === id}
            suffix={
              count ? (
                <Tag size="sm" shape="rounded" color="blue">
                  {count}
                </Tag>
              ) : undefined
            }
            onClick={() => setActive(id)}
          />
        ))}
      </div>
      <Sidebar.Group label="Spaces">
        {spaces.map(({ id, label, icon }) => (
          <Sidebar.Item
            key={id}
            href={`#${id}`}
            icon={icon}
            label={label}
            active={active === id}
            onClick={() => setActive(id)}
          />
        ))}
      </Sidebar.Group>
      {/* The line runs edge to edge, out of the sidebar's own inset. */}
      {!collapsed && <Divider weight="thin" className="-mr-ws-6 -ml-ws-5 w-auto" />}
      <Sidebar.Group label="Categories">
        {categories.map(({ id, label, color, count }) => (
          <Sidebar.Item
            key={id}
            href={`#${id}`}
            icon={SWATCH_ICON[color]}
            label={<span className={CATEGORY[color].text}>{label}</span>}
            aria-label={collapsed ? label : undefined}
            active={active === id}
            suffix={count}
            onClick={() => setActive(id)}
          />
        ))}
      </Sidebar.Group>
    </nav>
  );

  return (
    <Sidebar surface="tinted">
      <Sidebar.Header>
        <Sidebar.Expanded>
          <div className="gap-ws-9 flex flex-col">
            <div className="gap-ws-7 py-ws-3 pl-ws-5 flex items-center">
              <Avatar shape="square" initials={workspace.initials} color="brand" />
              <span className="typography-label-strong-sm text-ws-dynamic-secondary-default min-w-0 flex-1 truncate">
                {workspace.name}
              </span>
              <Sidebar.Trigger />
            </div>
            <Button variant="secondary" preset="border" size="sm" className="w-full">
              <Button.Icon icon={RiAddLine} />
              Add new
            </Button>
          </div>
        </Sidebar.Expanded>
        <Sidebar.Collapsed>
          <div className="gap-ws-7 flex flex-col items-center">
            <Avatar shape="square" initials={workspace.initials} color="brand" />
            <Sidebar.Trigger />
          </div>
        </Sidebar.Collapsed>
      </Sidebar.Header>

      <Sidebar.Section scrollable>
        <Sidebar.Expanded>{nav()}</Sidebar.Expanded>
        <Sidebar.Collapsed>{nav(true)}</Sidebar.Collapsed>
      </Sidebar.Section>

      <Sidebar.Footer>
        <Sidebar.Expanded>
          <AccountMenu />
        </Sidebar.Expanded>
        <Sidebar.Collapsed>
          <Avatar
            initials={account.initials}
            color={account.color}
            status="online"
            aria-label={account.name}
          />
        </Sidebar.Collapsed>
      </Sidebar.Footer>
    </Sidebar>
  );
}

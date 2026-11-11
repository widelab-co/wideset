// TODO(custom): the account menu is composed by hand; Sidebar.Group cannot fold and Sidebar has no search part, so the groups stay open and the search is a TextInput.
import {
  RiAddLine,
  RiArrowDownSLine,
  RiChat1Line,
  RiCodeSSlashLine,
  RiLogoutBoxRLine,
  RiSearchLine,
  RiSettingsLine,
} from '@remixicon/react';
import {
  Avatar,
  Button,
  DropdownMenu,
  IconButton,
  ListItem,
  SegmentedControl,
  Sidebar,
  type SidebarProps,
  TextInput,
} from '@wideset/react';
import { useState } from 'react';

import { BrandMark } from './brand-mark';
import type { Mode, ThreadGroup } from './model';
import { ThreadMark } from './thread-mark';

type AgentSidebarProps = Pick<SidebarProps, 'id' | 'collapsed' | 'onCollapsedChange'> & {
  product: string;
  workspace: string;
  account: { name: string; email: string; initials: string };
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  /** The mode's threads: projects or repositories, then Recents. */
  groups: ThreadGroup[];
  /** The thread on the page; none on the new-chat screen. */
  openId: string | null;
  /** The thread the agent is working in right now: its row shows the spinner. */
  workingId?: string;
  onOpen: (id: string) => void;
  /** Starts a new thread, in a group when its `+` was pressed. */
  onNew: (groupId?: string) => void;
};

/**
 * The app's sidebar on the grey frame: the brand, the Chat | Code switch, New chat (bordered: the
 * filled button is Send), a search that filters the list, then the mode's threads in their groups
 * with one state mark at the end of a row and a child thread indented under its parent. The
 * account sits at the foot. Its toggle is in the page bar, so the screen holds `collapsed`;
 * collapsed, it keeps the mark, New chat, Search and the avatar.
 */
export function AgentSidebar({
  product,
  workspace,
  account,
  mode,
  onModeChange,
  groups,
  openId,
  workingId,
  onOpen,
  onNew,
  ...props
}: AgentSidebarProps) {
  const [query, setQuery] = useState('');
  const thread = mode === 'chat' ? 'chat' : 'session';

  const needle = query.trim().toLowerCase();
  const shown = groups
    .map((group) => ({
      ...group,
      threads: group.threads.filter((item) => item.title.toLowerCase().includes(needle)),
    }))
    .filter((group) => group.threads.length > 0);

  return (
    <Sidebar surface="frame" {...props}>
      <Sidebar.Header>
        <Sidebar.Expanded>
          <div className="gap-ws-7 flex flex-col">
            <div className="gap-ws-7 pt-ws-3 pb-ws-3 flex items-center">
              <BrandMark className="size-ws-15" />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="typography-label-strong-sm text-ws-static-strong truncate">
                  {product}
                </span>
                <span className="typography-caption-md text-ws-static-subtle truncate">
                  {workspace}
                </span>
              </div>
            </div>
            <SegmentedControl
              size="sm"
              variant="fullWidth"
              aria-label="Mode"
              value={mode}
              onValueChange={(value) => onModeChange(value as Mode)}
            >
              <SegmentedControl.Item value="chat">
                <SegmentedControl.Icon icon={RiChat1Line} />
                Chat
              </SegmentedControl.Item>
              <SegmentedControl.Item value="code">
                <SegmentedControl.Icon icon={RiCodeSSlashLine} />
                Code
              </SegmentedControl.Item>
            </SegmentedControl>
            <Button
              variant="secondary"
              preset="border"
              size="sm"
              className="w-full"
              onClick={() => onNew()}
            >
              <Button.Icon icon={RiAddLine} />
              {`New ${thread}`}
            </Button>
            <TextInput size="sm" value={query} onChange={(event) => setQuery(event.target.value)}>
              <TextInput.Prefix inner>
                <TextInput.Icon icon={RiSearchLine} />
              </TextInput.Prefix>
              <TextInput.Input
                type="search"
                placeholder={`Search ${thread}s`}
                aria-label={`Search ${thread}s`}
              />
              <TextInput.Suffix inner>
                <TextInput.ClearButton aria-label="Clear search" />
              </TextInput.Suffix>
            </TextInput>
          </div>
        </Sidebar.Expanded>
        <Sidebar.Collapsed>
          <div className="pt-ws-3 pb-ws-3 flex justify-center">
            <BrandMark className="size-ws-15" label={product} />
          </div>
        </Sidebar.Collapsed>
      </Sidebar.Header>

      {/* A section draws only the slot for the state it is in. Thread rows have no icon, so the
          collapsed rail keeps the two actions and leaves the list to the expanded sidebar. The
          scroll area sizes its content to the longest row, so a long title would widen the whole
          list instead of truncating: `contain-inline-size` keeps the list as wide as its column. */}
      <Sidebar.Section scrollable>
        <Sidebar.Expanded>
          <nav
            aria-label={mode === 'chat' ? 'Chats' : 'Sessions'}
            className="gap-ws-9 flex flex-col contain-inline-size"
          >
            {shown.map((group) => (
              <Sidebar.Group
                key={group.id}
                label={group.label}
                action={
                  group.fixed ? undefined : (
                    <IconButton
                      icon={RiAddLine}
                      variant="secondary"
                      preset="ghost"
                      size="xs"
                      aria-label={`New ${thread} in ${group.label}`}
                      onClick={() => onNew(group.id)}
                    />
                  )
                }
              >
                {group.threads.map((item) => {
                  const working = item.id === workingId;
                  return (
                    <Sidebar.Item
                      key={item.id}
                      href={`#${item.id}`}
                      label={item.title}
                      nested={item.child}
                      active={item.id === openId}
                      suffix={
                        working || item.state || item.pullRequest ? (
                          <ThreadMark thread={item} working={working} />
                        ) : undefined
                      }
                      onClick={(event) => {
                        event.preventDefault();
                        onOpen(item.id);
                      }}
                    />
                  );
                })}
              </Sidebar.Group>
            ))}
            {shown.length === 0 && (
              <p className="typography-body-md text-ws-static-subtle px-ws-5">
                {`No ${thread}s match “${query.trim()}”`}
              </p>
            )}
          </nav>
        </Sidebar.Expanded>
        <Sidebar.Collapsed>
          <nav aria-label="Actions" className="flex flex-col">
            <Sidebar.Item
              href="#new"
              icon={RiAddLine}
              label={`New ${thread}`}
              onClick={(event) => {
                event.preventDefault();
                onNew();
              }}
            />
            <Sidebar.Item
              href="#search"
              icon={RiSearchLine}
              label={`Search ${thread}s`}
              onClick={(event) => {
                event.preventDefault();
                props.onCollapsedChange?.(false);
              }}
            />
          </nav>
        </Sidebar.Collapsed>
      </Sidebar.Section>

      <Sidebar.Footer>
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
                  <Avatar initials={account.initials} color="teal" />
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
              <Avatar initials={account.initials} color="teal" title={account.name} />
            </div>
          </Sidebar.Collapsed>
        </div>
      </Sidebar.Footer>
    </Sidebar>
  );
}

// TODO(custom): the account menu is composed by hand, and the Search row turns into a TextInput in place; a thread group cannot fold (Sidebar.SectionHeader is a heading only) and Sidebar has no search part.
import {
  RiAddLine,
  RiArrowDownSLine,
  RiChat1Line,
  RiCodeSSlashLine,
  RiLogoutBoxRLine,
  RiSearchLine,
  RiSettingsLine,
  RiStackLine,
} from '@remixicon/react';
import {
  DropdownMenu,
  IconButton,
  ListItem,
  SegmentedControl,
  Sidebar,
  type SidebarProps,
  TextInput,
} from '@wideset/react';
import { type MouseEvent, useEffect, useId, useRef, useState } from 'react';

import { BrandMark } from './brand-mark';
import { useModifier } from './keyboard-key';
import type { Mode, ThreadGroup } from './model';
import { PersonAvatar } from './person-avatar';
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
  /** Code: the page that lists every session is the one open. */
  allOpen?: boolean;
  /** Code: opens that page in place; without it the row is a plain link to `#sessions`. */
  onAll?: () => void;
};

/**
 * The app's sidebar on the grey frame: the brand, the Chat | Code switch, then a short list of
 * rows that read as navigation, icon and label, with no borders: New chat, Search and, in Code,
 * All sessions. Search turns into the search field in place, focused; Esc, clearing it or
 * leaving it empty brings the row back. Under them the mode's threads in their groups, with one
 * state mark at the end of a row and a child thread indented under its parent; a thread's name
 * starts on the same left edge as the rows' icons. The account sits at the foot. Its toggle is
 * in the page bar, so the screen holds `collapsed`; collapsed, it keeps the mark, the rows as
 * icons and the avatar.
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
  allOpen = false,
  onAll,
  ...props
}: AgentSidebarProps) {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const field = useRef<HTMLInputElement>(null);
  const searchRow = useRef<HTMLButtonElement>(null);
  /** Search was left from the keyboard: the cursor goes back to the Search row it came from. */
  const backToRow = useRef(false);
  const groupId = useId();
  const thread = mode === 'chat' ? 'chat' : 'session';
  const modifier = useModifier();
  /** A shortcut as a row's hint: "⌘K" on Apple keyboards, "Ctrl K" elsewhere. */
  const shortcut = (...keys: string[]) =>
    modifier === '⌘' ? `⌘${keys.join('')}` : `Ctrl ${keys.join(' ')}`;
  const { collapsed, onCollapsedChange } = props;

  const needle = query.trim().toLowerCase();
  const shown = groups
    .map((group) => ({
      ...group,
      threads: group.threads.filter((item) => item.title.toLowerCase().includes(needle)),
    }))
    // A search shows only the groups it found something in; without one, an empty project or
    // repository stays, with its `+` for the first thread in it.
    .filter((group) => group.threads.length > 0 || (needle === '' && !group.fixed));
  const nothingFound = needle !== '' && shown.length === 0;

  const search = () => {
    onCollapsedChange?.(false);
    setSearching(true);
  };

  const endSearch = (refocus = false) => {
    // Only ever set here: a blur as the field leaves must not cancel the way back.
    if (refocus) backToRow.current = true;
    setQuery('');
    setSearching(false);
  };

  // The row became the field to be typed in: the cursor is there. Back from the field by Escape
  // or Clear, the cursor goes to the Search row again rather than to the page.
  useEffect(() => {
    if (searching && !collapsed) field.current?.focus();
    else if (!searching && backToRow.current) {
      backToRow.current = false;
      searchRow.current?.focus();
    }
  }, [searching, collapsed]);

  // The rows' shortcuts, the ones their hints show.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.altKey) return;
      const key = event.key.toLowerCase();
      if (key === 'k' && !event.shiftKey) {
        event.preventDefault();
        onCollapsedChange?.(false);
        setSearching(true);
        // Already open (a query kept it after the field lost focus): the effect will not run again.
        field.current?.focus();
      } else if (key === 'o' && event.shiftKey) {
        event.preventDefault();
        onNew();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCollapsedChange, onNew]);

  /** A row is a link for its look and its place in the tab order; here it acts in place. */
  const act = (action: () => void) => (event: MouseEvent) => {
    event.preventDefault();
    action();
  };

  return (
    <Sidebar {...props}>
      <Sidebar.Header>
        <div className="gap-ws-7 flex flex-col">
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
            </div>
          </Sidebar.Expanded>
          <Sidebar.Collapsed>
            <div className="pt-ws-3 pb-ws-3 flex justify-center">
              <BrandMark className="size-ws-15" label={product} />
            </div>
          </Sidebar.Collapsed>

          <nav aria-label={mode === 'chat' ? 'Chat' : 'Code'} className="gap-ws-2 flex flex-col">
            {/* New and Search act in place, so they are buttons dressed as the rows around them. */}
            <Sidebar.Item
              asChild
              icon={RiAddLine}
              label={`New ${thread}`}
              suffix={shortcut('⇧', 'O')}
              suffixOnHover
            >
              <button type="button" onClick={() => onNew()} />
            </Sidebar.Item>
            {searching && !collapsed ? (
              <TextInput
                size="sm"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key !== 'Escape') return;
                  // Escape is spent closing the search: it does not also stop a running turn.
                  event.preventDefault();
                  endSearch(true);
                }}
                onBlur={() => query.trim() === '' && endSearch()}
              >
                <TextInput.Prefix inner>
                  <TextInput.Icon icon={RiSearchLine} />
                </TextInput.Prefix>
                <TextInput.Input
                  ref={field}
                  type="search"
                  placeholder={`Search ${thread}s`}
                  aria-label={`Search ${thread}s`}
                />
                <TextInput.Suffix inner>
                  <TextInput.ClearButton
                    aria-label="Clear search"
                    onClear={() => endSearch(true)}
                  />
                </TextInput.Suffix>
              </TextInput>
            ) : (
              <Sidebar.Item
                asChild
                icon={RiSearchLine}
                label="Search"
                suffix={shortcut('K')}
                suffixOnHover
              >
                <button ref={searchRow} type="button" onClick={search} />
              </Sidebar.Item>
            )}
            {mode === 'code' && (
              <Sidebar.Item
                href="#sessions"
                icon={RiStackLine}
                label="All sessions"
                active={allOpen}
                // With no handler it is a plain link to #sessions, for the app's router.
                onClick={onAll ? act(onAll) : undefined}
              />
            )}
          </nav>
        </div>
      </Sidebar.Header>

      {/* A section draws only the slot for the state it is in. Thread rows have no icon, so the
          collapsed rail leaves the list to the expanded sidebar. The scroll area sizes its
          content to the longest row, so a long title would widen the whole list instead of
          truncating: `contain-inline-size` keeps the list as wide as its column. */}
      <Sidebar.Section scrollable>
        <Sidebar.Expanded>
          <nav
            aria-label={mode === 'chat' ? 'Chats' : 'Sessions'}
            className="gap-ws-9 flex flex-col contain-inline-size"
          >
            {shown.map((group) => (
              <div
                key={group.id}
                role="group"
                aria-labelledby={`${groupId}-${group.id}`}
                className="gap-ws-2 flex flex-col"
              >
                {/* The header's one action ends the row 4px in, its icon on the suffixes' edge. */}
                <div className="flex items-end">
                  <Sidebar.SectionHeader id={`${groupId}-${group.id}`} className="flex-1">
                    {group.label}
                  </Sidebar.SectionHeader>
                  {!group.fixed && (
                    <IconButton
                      icon={RiAddLine}
                      variant="secondary"
                      preset="ghost"
                      size="xs"
                      aria-label={`New ${thread} in ${group.label}`}
                      className="mr-ws-3"
                      onClick={() => onNew(group.id)}
                    />
                  )}
                </div>
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
                      onClick={act(() => onOpen(item.id))}
                    />
                  );
                })}
              </div>
            ))}
            {/* Always there, so a screen reader hears when the search finds nothing. */}
            <p
              role="status"
              className={
                nothingFound ? 'typography-body-md text-ws-static-subtle px-ws-5' : 'sr-only'
              }
            >
              {nothingFound ? `No ${thread}s match “${query.trim()}”` : ''}
            </p>
          </nav>
        </Sidebar.Expanded>
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
                  <PersonAvatar name={account.name} initials={account.initials} color="teal" />
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
                color="teal"
                title={account.name}
                alt={account.name}
              />
            </div>
          </Sidebar.Collapsed>
        </div>
      </Sidebar.Footer>
    </Sidebar>
  );
}

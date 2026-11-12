import {
  type RemixiconComponentType,
  RiAddLine,
  RiArrowDownSLine,
  RiContrast2Line,
  RiKeyboardLine,
  RiLogoutBoxRLine,
  RiQuestionLine,
  RiSettingsLine,
  RiUserSharedLine,
} from '@remixicon/react';
import { Avatar, DropdownMenu, ListItem } from '@wideset/react';

import { type Account, type Theme, THEMES, type Workspace } from './data';
import { MenuChoice } from './menu-choice';
import { MenuSub } from './menu-sub';

/** ⌘ on Apple keyboards, Ctrl elsewhere. */
const MODIFIER =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘' : 'Ctrl';

type AccountMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: Account;
  accounts: Account[];
  onAccountChange: (id: string) => void;
  workspace: Workspace;
  workspaces: Workspace[];
  onWorkspaceChange: (id: string) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  onLogOut: () => void;
  /** Where the menu and its submenus portal to: the screen, so they take its theme. */
  container: HTMLElement | null;
};

/** One plain command row: an icon, a label, and what comes after it. */
function Command({
  icon: Icon,
  label,
  suffix,
}: {
  icon: RemixiconComponentType;
  label: string;
  suffix?: string;
}) {
  return (
    <DropdownMenu.Item>
      <ListItem.Prefix>
        <Icon className="size-ws-9" />
      </ListItem.Prefix>
      <ListItem.Content>
        <ListItem.Label>{label}</ListItem.Label>
      </ListItem.Content>
      {suffix && (
        <ListItem.Suffix>
          <span className="text-ws-static-subtle">{suffix}</span>
        </ListItem.Suffix>
      )}
    </DropdownMenu.Item>
  );
}

/**
 * The account menu, opened from the account row at the foot of the sidebar. It starts on the
 * row's left edge and is wider than the sidebar, so it reaches past the navigation over the page
 * and reads as a layer above both, with room for the shortcut and the theme beside their names.
 * Who is signed in heads it; then where they are (the
 * workspaces, the open one ticked), what is theirs (settings, shortcuts, theme, help), and last
 * who they are signed in as (switching account, logging out). Theme and Switch account are
 * submenus: three choices each that would otherwise double the menu's height. Log out asks
 * nothing, since signing in again undoes it.
 */
export function AccountMenu({
  open,
  onOpenChange,
  account,
  accounts,
  onAccountChange,
  workspace,
  workspaces,
  onWorkspaceChange,
  theme,
  onThemeChange,
  onLogOut,
  container,
}: AccountMenuProps) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="gap-ws-5 px-ws-5 py-ws-3 rounded-ws-control-lg hover:bg-ws-dynamic-tertiary-alpha-strong-default data-[state=open]:bg-ws-dynamic-tertiary-alpha-strong-default focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex w-full items-center text-left"
        >
          <Avatar initials={account.initials} color={account.color} />
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="typography-label-strong-sm text-ws-static-base truncate">
              {account.name}
            </span>
            <span className="typography-caption-md text-ws-static-subtle truncate">
              {account.email}
            </span>
          </span>
          <RiArrowDownSLine aria-hidden="true" className="size-ws-9 text-ws-static-strong" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        side="top"
        align="start"
        portalContainer={container}
        className="w-[18rem]"
      >
        {/* Who is signed in: a label, not an action. */}
        <DropdownMenu.Label className="gap-ws-5 flex items-center">
          <Avatar initials={account.initials} color={account.color} />
          <span className="flex min-w-0 flex-col">
            <span className="typography-label-strong-sm text-ws-static-strong truncate">
              {account.name}
            </span>
            <span className="typography-caption-md text-ws-static-subtle truncate">
              {account.email}
            </span>
          </span>
        </DropdownMenu.Label>
        <DropdownMenu.Separator />

        <DropdownMenu.RadioGroup
          aria-label="Workspaces"
          value={workspace.id}
          onValueChange={onWorkspaceChange}
        >
          {workspaces.map((item) => (
            <MenuChoice key={item.id} value={item.id}>
              <ListItem.Prefix>
                <Avatar size="xs" shape="square" initials={item.initials} color={item.color} />
              </ListItem.Prefix>
              <ListItem.Content>
                <ListItem.Label>{item.name}</ListItem.Label>
              </ListItem.Content>
            </MenuChoice>
          ))}
        </DropdownMenu.RadioGroup>
        <Command icon={RiAddLine} label="Create workspace" />
        <DropdownMenu.Separator />

        <Command icon={RiSettingsLine} label="Account settings" />
        <Command icon={RiKeyboardLine} label="Keyboard shortcuts" suffix={`${MODIFIER} /`} />
        <MenuSub
          icon={RiContrast2Line}
          label="Theme"
          value={THEMES.find((item) => item.value === theme)?.label}
          container={container}
        >
          <DropdownMenu.RadioGroup
            aria-label="Theme"
            value={theme}
            onValueChange={(value) => onThemeChange(value as Theme)}
          >
            {THEMES.map(({ value, label, icon: Icon }) => (
              <MenuChoice key={value} value={value}>
                <ListItem.Prefix>
                  <Icon className="size-ws-9" />
                </ListItem.Prefix>
                <ListItem.Content>
                  <ListItem.Label>{label}</ListItem.Label>
                </ListItem.Content>
              </MenuChoice>
            ))}
          </DropdownMenu.RadioGroup>
        </MenuSub>
        <Command icon={RiQuestionLine} label="Help and support" />
        <DropdownMenu.Separator />

        <MenuSub icon={RiUserSharedLine} label="Switch account" container={container}>
          <DropdownMenu.RadioGroup
            aria-label="Accounts"
            value={account.id}
            onValueChange={onAccountChange}
          >
            {accounts.map((item) => (
              <MenuChoice key={item.id} value={item.id}>
                <ListItem.Prefix>
                  <Avatar size="xs" initials={item.initials} color={item.color} />
                </ListItem.Prefix>
                <ListItem.Content>
                  <ListItem.Label>{item.name}</ListItem.Label>
                  <ListItem.Description>{item.email}</ListItem.Description>
                </ListItem.Content>
              </MenuChoice>
            ))}
          </DropdownMenu.RadioGroup>
          <DropdownMenu.Separator />
          <Command icon={RiAddLine} label="Add account" />
        </MenuSub>
        <DropdownMenu.Item variant="danger" onSelect={onLogOut}>
          <ListItem.Prefix>
            <RiLogoutBoxRLine className="size-ws-9" />
          </ListItem.Prefix>
          <ListItem.Content>
            <ListItem.Label>Log out</ListItem.Label>
          </ListItem.Content>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}

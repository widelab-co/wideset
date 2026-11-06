import { type RemixiconComponentType, RiMenuLine } from '@remixicon/react';
import { Avatar, cn, DropdownMenu, IconButton, ListItem } from '@wideset/react';
import { type AnchorHTMLAttributes, useState } from 'react';

import { ACCOUNT, NAV } from './data';

/** Figma "Navigation Bar" on the grey canvas, no fill and no line: brand, navigation, account. */
export function TopBar() {
  const [current, setCurrent] = useState(NAV[0].href);

  return (
    <header className="h-ws-22 px-ws-12 flex shrink-0 items-center justify-between">
      <div className="gap-ws-9 flex items-center">
        <div className="gap-ws-5 flex items-center">
          <IconButton
            variant="secondary"
            preset="ghost"
            size="sm"
            icon={RiMenuLine}
            aria-label="Open menu"
          />
          <Avatar shape="square" initials="W" color="brand" role="img" aria-label="Wideset" />
        </div>
        <nav aria-label="Main" className="gap-ws-3 flex items-center">
          {NAV.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              active={item.href === current}
              onClick={() => setCurrent(item.href)}
            >
              {item.label}
            </NavItem>
          ))}
        </nav>
      </div>

      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            className="typography-label-strong-sm text-ws-static-strong rounded-ws-control-lg gap-ws-5 px-ws-5 py-ws-3 hover:bg-ws-dynamic-secondary-alpha-hover focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex cursor-pointer items-center"
          >
            <Avatar initials={ACCOUNT.initials} aria-hidden />
            {ACCOUNT.name}
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          {['Profile', 'Settings', 'Log out'].map((label) => (
            <DropdownMenu.Item key={label}>
              <ListItem.Content>
                <ListItem.Label>{label}</ListItem.Label>
              </ListItem.Content>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu>
    </header>
  );
}

type NavItemProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  active: boolean;
  icon?: RemixiconComponentType;
};

/** Figma "Assets / Navigation Bar Page": a top-bar link, filled while it is the current page. */
function NavItem({ active, icon: Icon, className, children, ...props }: NavItemProps) {
  return (
    <a
      aria-current={active ? 'page' : undefined}
      className={cn(
        'typography-label-strong-sm rounded-ws-control-lg gap-ws-5 px-ws-5 py-ws-3 min-h-ws-14 flex items-center',
        'focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default',
        active
          ? 'bg-ws-dynamic-tertiary-alpha-strong-default text-ws-static-strong'
          : 'text-ws-static-base hover:bg-ws-dynamic-tertiary-alpha-strong-default hover:text-ws-static-strong',
        className,
      )}
      {...props}
    >
      {Icon && (
        <Icon
          aria-hidden
          className={cn('size-ws-10 shrink-0', !active && 'text-ws-static-subtle')}
        />
      )}
      {children}
    </a>
  );
}

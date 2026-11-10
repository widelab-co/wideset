// TODO(custom): top-bar navigation items and account trigger composed by hand (copied from sales-overview); no NavigationBar in Wideset.
import { RiNotification3Line } from '@remixicon/react';
import { Avatar, cn, DropdownMenu, IconButton, ListItem } from '@wideset/react';
import { type AnchorHTMLAttributes, useState } from 'react';

import { BrandMark } from './brand-mark';
import { ACCOUNT, NAV } from './data';

/** The top bar on the grey canvas, no fill and no line: product, navigation and account. */
export function TopBar() {
  const [current, setCurrent] = useState('#integrations');

  return (
    <header className="px-ws-12 shrink-0">
      {/* In line with the page below it: the bar has no fill, so only its content shows. */}
      <div className="h-ws-20 mx-auto flex w-full max-w-[80rem] items-center justify-between">
        <div className="gap-ws-12 flex items-center">
          <BrandMark label="Orbit" />
          <nav aria-label="Main" className="gap-ws-3 hidden items-center lg:flex">
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

        <div className="gap-ws-5 flex items-center">
          <IconButton
            variant="secondary"
            preset="ghost"
            size="sm"
            icon={RiNotification3Line}
            aria-label="Notifications"
          />
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
        </div>
      </div>
    </header>
  );
}

type NavItemProps = AnchorHTMLAttributes<HTMLAnchorElement> & { active: boolean };

/** Figma "Assets / Navigation Bar Page": a top-bar link, filled while it is the current page. */
function NavItem({ active, className, children, ...props }: NavItemProps) {
  return (
    <a
      aria-current={active ? 'page' : undefined}
      className={cn(
        'typography-label-strong-sm rounded-ws-control-lg px-ws-5 py-ws-3 min-h-ws-14 flex items-center',
        'focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default',
        active
          ? 'bg-ws-dynamic-tertiary-alpha-strong-default text-ws-static-strong'
          : 'text-ws-static-base hover:bg-ws-dynamic-tertiary-alpha-strong-default hover:text-ws-static-strong',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}

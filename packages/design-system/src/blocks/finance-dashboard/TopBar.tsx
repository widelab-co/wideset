import {
  type RemixiconComponentType,
  RiInbox2Line,
  RiMenuLine,
  RiMoonLine,
  RiNotification3Line,
  RiSettings4Line,
  RiSunFill,
} from '@remixicon/react';
import { cn, IconButton, SegmentedControl } from '@wideset/react';
import { type AnchorHTMLAttributes, useState } from 'react';

import { NAV } from './data';

/** Figma "Navigation Bar" on the white page, a line below it: menu, navigation, tools. */
export function TopBar() {
  const [current, setCurrent] = useState(NAV[0].href);

  return (
    <header className="h-ws-20 px-ws-12 flex shrink-0 items-center justify-between">
      <div className="gap-ws-9 flex items-center">
        <div className="gap-ws-5 flex items-center">
          <IconButton
            variant="secondary"
            preset="ghost"
            size="sm"
            icon={RiMenuLine}
            aria-label="Open menu"
          />
        </div>
        <nav aria-label="Main" className="gap-ws-3 flex items-center">
          {NAV.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              active={item.href === current}
              onClick={() => setCurrent(item.href)}
            >
              {item.label}
            </NavItem>
          ))}
        </nav>
      </div>

      <div className="gap-ws-9 flex items-center">
        <SegmentedControl size="sm" defaultValue="light" aria-label="Theme">
          <SegmentedControl.Item value="light" icon={RiSunFill} aria-label="Light" />
          <SegmentedControl.Item value="dark" icon={RiMoonLine} aria-label="Dark" />
        </SegmentedControl>
        <div className="gap-ws-3 flex items-center">
          {[
            { icon: RiSettings4Line, label: 'Settings' },
            { icon: RiInbox2Line, label: 'Inbox' },
            { icon: RiNotification3Line, label: 'Notifications' },
          ].map(({ icon, label }) => (
            <IconButton
              key={label}
              variant="secondary"
              preset="ghost"
              size="sm"
              icon={icon}
              aria-label={label}
            />
          ))}
        </div>
      </div>
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

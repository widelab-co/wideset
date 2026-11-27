import { RiNotification3Line, RiSearchLine } from '@remixicon/react';
import { DropdownMenu, IconButton, ListItem, NavigationBar } from '@wideset/react';
import { useState } from 'react';

import { BrandMark } from './brand-mark';
import { ACCOUNT, NAV } from './data';
import { PersonAvatar } from './person-avatar';

/** The top bar on the grey canvas, no fill and no line: product, navigation, tools and account. */
export function TopBar() {
  const [current, setCurrent] = useState('#sales');

  return (
    <div className="px-ws-12 shrink-0">
      {/* In line with the page below it: the bar has no fill, so only its content shows. */}
      <NavigationBar divider={false} className="gap-ws-12 mx-auto w-full max-w-[80rem] px-0">
        <NavigationBar.Start>
          <BrandMark label="Orbit" />
        </NavigationBar.Start>
        <NavigationBar.Nav>
          {NAV.map((item) => (
            <NavigationBar.Item
              key={item.href}
              href={item.href}
              active={item.href === current}
              onClick={() => setCurrent(item.href)}
            >
              <NavigationBar.Label>{item.label}</NavigationBar.Label>
            </NavigationBar.Item>
          ))}
        </NavigationBar.Nav>

        <NavigationBar.End className="gap-ws-5">
          <IconButton
            variant="secondary"
            preset="ghost"
            size="sm"
            icon={RiSearchLine}
            aria-label="Search"
          />
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
                <PersonAvatar name={ACCOUNT.name} initials={ACCOUNT.initials} aria-hidden />
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
        </NavigationBar.End>
      </NavigationBar>
    </div>
  );
}

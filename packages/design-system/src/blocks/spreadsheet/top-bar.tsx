import { RiArrowDownSLine, RiNotification3Line, RiSearchLine } from '@remixicon/react';
import { Avatar, IconButton, NavigationBar, TextInput } from '@wideset/react';
import { useState } from 'react';

import { BrandMark } from './brand-mark';
import { ACCOUNT, PAGES, TABLE } from './data';

/**
 * Figma's top bar on the white page, a line below it: the product mark, the table and its
 * switcher, the table's pages, then search and the account.
 */
export function TopBar() {
  const [current, setCurrent] = useState(PAGES[0].href);

  return (
    <NavigationBar className="px-ws-11 gap-ws-12">
      {/* One mark in every screen: this one has no sidebar, so the top bar carries it. */}
      <NavigationBar.Start className="gap-ws-7">
        <BrandMark label="Wideset" />
        <div className="gap-ws-5 flex items-center">
          <h1 className="typography-subtitle-xs text-ws-dynamic-secondary-default">{TABLE}</h1>
          <IconButton
            variant="secondary"
            preset="ghost"
            size="xs"
            icon={RiArrowDownSLine}
            aria-label="Switch table"
          />
        </div>
      </NavigationBar.Start>
      <NavigationBar.Nav aria-label={TABLE}>
        {PAGES.map((page) => (
          <NavigationBar.Item
            key={page.href}
            href={page.href}
            active={page.href === current}
            onClick={() => setCurrent(page.href)}
          >
            <NavigationBar.Label>{page.label}</NavigationBar.Label>
          </NavigationBar.Item>
        ))}
      </NavigationBar.Nav>

      <NavigationBar.End className="gap-ws-5">
        <TextInput size="sm" className="w-[16rem]">
          <TextInput.Prefix inner>
            <TextInput.Icon icon={RiSearchLine} />
          </TextInput.Prefix>
          <TextInput.Input type="search" placeholder="Search" aria-label="Search clients" />
        </TextInput>
        <Avatar
          initials={ACCOUNT.initials}
          color={ACCOUNT.color}
          status="online"
          aria-label={ACCOUNT.name}
        />
        <IconButton
          variant="secondary"
          preset="ghost"
          size="sm"
          icon={RiNotification3Line}
          aria-label="Notifications"
        />
      </NavigationBar.End>
    </NavigationBar>
  );
}

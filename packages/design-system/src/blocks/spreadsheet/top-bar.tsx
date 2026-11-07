import { RiArrowDownSLine, RiNotification3Line, RiSearchLine } from '@remixicon/react';
import { Avatar, cn, IconButton, TextInput } from '@wideset/react';
import { type AnchorHTMLAttributes, useState } from 'react';

import { ACCOUNT, PAGES, TABLE } from './data';

/**
 * Figma's top bar on the white page, a line below it: the table and its switcher, the table's
 * pages, then search and the account.
 */
export function TopBar() {
  const [current, setCurrent] = useState(PAGES[0].href);

  return (
    <header className="border-ws-static-base h-ws-19 px-ws-11 flex shrink-0 items-center justify-between border-b">
      <div className="gap-ws-12 flex items-center">
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
        <nav aria-label={TABLE} className="gap-ws-3 flex items-center">
          {PAGES.map((page) => (
            <PageLink
              key={page.href}
              href={page.href}
              active={page.href === current}
              onClick={() => setCurrent(page.href)}
            >
              {page.label}
            </PageLink>
          ))}
        </nav>
      </div>

      <div className="gap-ws-5 flex items-center">
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
      </div>
    </header>
  );
}

type PageLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { active: boolean };

/** Figma "Assets / Navigation Bar Page": a top-bar link, filled while it is the current page. */
function PageLink({ active, className, children, ...props }: PageLinkProps) {
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

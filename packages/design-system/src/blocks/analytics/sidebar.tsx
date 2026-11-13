// TODO(custom): workspace switcher and account menu are composed by hand (copied from kanban).
import { RiArrowDownSLine } from '@remixicon/react';
import { Avatar, Sidebar } from '@wideset/react';
import { useState } from 'react';

import { BrandMark } from './brand-mark';
import { ACCOUNT, DASHBOARDS, NAVIGATION, WORKSPACE } from './data';

/** The workspace sidebar: product, workspace switcher, pages, saved dashboards and the account. */
export function AppSidebar() {
  const [active, setActive] = useState('analytics');

  const links = (
    <nav aria-label="Workspace" className="gap-ws-11 flex flex-col">
      <div className="flex flex-col">
        {NAVIGATION.map((item) => (
          <Sidebar.Item
            key={item.id}
            href={`#${item.id}`}
            icon={item.icon}
            label={item.label}
            suffix={item.count}
            active={active === item.id}
            onClick={() => setActive(item.id)}
          />
        ))}
      </div>
      <div role="group" aria-labelledby="sidebar-dashboards" className="gap-ws-2 flex flex-col">
        <Sidebar.SectionHeader id="sidebar-dashboards">Dashboards</Sidebar.SectionHeader>
        {DASHBOARDS.map((item) => (
          <Sidebar.Item
            key={item.id}
            href={`#${item.id}`}
            icon={item.icon}
            label={item.label}
            active={active === item.id}
            onClick={() => setActive(item.id)}
          />
        ))}
      </div>
    </nav>
  );

  return (
    <Sidebar>
      <Sidebar.Header>
        <Sidebar.Expanded>
          <div className="gap-ws-7 flex flex-col">
            <div className="gap-ws-7 py-ws-3 pl-ws-5 flex items-center">
              <BrandMark />
              <span className="typography-label-strong-sm text-ws-static-strong min-w-0 flex-1 truncate">
                Orbit
              </span>
              <Sidebar.Trigger />
            </div>
            {/* No workspace switcher in Wideset yet: a bordered button, as Figma draws it. */}
            <button
              type="button"
              className="border-ws-dynamic-secondary-default bg-ws-static-highlight-base shadow-ws-forms-base rounded-ws-control-lg h-ws-19 px-ws-7 hover:border-ws-dynamic-secondary-hover focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex w-full items-center border text-left"
            >
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="typography-label-strong-sm text-ws-static-strong truncate">
                  {WORKSPACE.name}
                </span>
                <span className="typography-label-sm text-ws-static-subtle truncate">
                  {WORKSPACE.plan} · {WORKSPACE.seats} seats
                </span>
              </span>
              <span className="size-ws-11 flex shrink-0 items-center justify-center">
                <RiArrowDownSLine aria-hidden className="size-ws-9 text-ws-static-strong" />
              </span>
            </button>
          </div>
        </Sidebar.Expanded>
        <Sidebar.Collapsed>
          <div className="py-ws-3 flex items-center">
            <Sidebar.Trigger />
          </div>
        </Sidebar.Collapsed>
      </Sidebar.Header>

      <Sidebar.Section scrollable>{links}</Sidebar.Section>

      <Sidebar.Footer>
        <Sidebar.Expanded>
          <button
            type="button"
            className="gap-ws-5 px-ws-5 py-ws-3 rounded-ws-control-lg hover:bg-ws-dynamic-tertiary-alpha-strong-default focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex w-full items-center text-left"
          >
            <Avatar initials={ACCOUNT.initials} status="online" />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="typography-label-strong-sm text-ws-static-base truncate">
                {ACCOUNT.name}
              </span>
              <span className="typography-label-sm text-ws-static-subtle truncate">
                {ACCOUNT.email}
              </span>
            </span>
            <span className="size-ws-11 flex shrink-0 items-center justify-center">
              <RiArrowDownSLine aria-hidden className="size-ws-9 text-ws-static-strong" />
            </span>
          </button>
        </Sidebar.Expanded>
        <Sidebar.Collapsed>
          <Avatar initials={ACCOUNT.initials} status="online" title={ACCOUNT.name} />
        </Sidebar.Collapsed>
      </Sidebar.Footer>
    </Sidebar>
  );
}

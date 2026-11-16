import { type RemixiconComponentType, RiArrowDownSLine, RiFlashlightFill } from '@remixicon/react';
import { Avatar, cn, Sidebar } from '@wideset/react';
import { useState } from 'react';

import { BrandMark } from './brand-mark';
import { account, navigation, type SpaceColor, spaceGroups, workspace } from './data';

const TILE: Record<SpaceColor, string> = {
  purple: 'bg-ws-non-semantic-purple-strong text-ws-non-semantic-purple-on-strong',
  indigo: 'bg-ws-non-semantic-indigo-strong text-ws-non-semantic-indigo-on-strong',
  blue: 'bg-ws-non-semantic-blue-strong text-ws-non-semantic-blue-on-strong',
  cyan: 'bg-ws-non-semantic-cyan-strong text-ws-non-semantic-cyan-on-strong',
  teal: 'bg-ws-non-semantic-teal-strong text-ws-non-semantic-teal-on-strong',
  green: 'bg-ws-non-semantic-green-strong text-ws-non-semantic-green-on-strong',
};

/** Figma's Sidebar Item `Type=Thumbnail`: a 20px colour tile with a white glyph, as the item icon. */
const spaceTile = (color: SpaceColor): RemixiconComponentType => {
  const SpaceTile = () => (
    <span
      aria-hidden="true"
      className={cn(
        'rounded-ws-control-md size-ws-11 flex shrink-0 items-center justify-center',
        TILE[color],
      )}
    >
      <RiFlashlightFill className="size-ws-7" />
    </span>
  );
  return SpaceTile;
};

const SPACE_ICON: Record<SpaceColor, RemixiconComponentType> = {
  purple: spaceTile('purple'),
  indigo: spaceTile('indigo'),
  blue: spaceTile('blue'),
  cyan: spaceTile('cyan'),
  teal: spaceTile('teal'),
  green: spaceTile('green'),
};

/** The workspace sidebar: brand, workspace switcher, pages, spaces and the signed-in account. */
export function KanbanSidebar() {
  const [active, setActive] = useState('explore');

  const links = (
    <nav aria-label="Workspace" className="gap-ws-11 flex flex-col">
      <div className="flex flex-col">
        {navigation.map((item) => (
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
      {spaceGroups.map((group) => (
        <div
          key={group.id}
          role="group"
          aria-labelledby={`sidebar-${group.id}`}
          className="gap-ws-2 flex flex-col"
        >
          <Sidebar.SectionHeader id={`sidebar-${group.id}`}>{group.label}</Sidebar.SectionHeader>
          {group.spaces.map((space) => (
            <Sidebar.Item
              key={space.id}
              href={`#${space.id}`}
              icon={SPACE_ICON[space.color]}
              label={space.label}
              active={active === space.id}
              onClick={() => setActive(space.id)}
            />
          ))}
        </div>
      ))}
    </nav>
  );

  return (
    <Sidebar>
      <Sidebar.Header>
        <Sidebar.Expanded>
          <div className="gap-ws-7 flex flex-col">
            <div className="gap-ws-7 py-ws-3 pl-ws-5 flex items-center">
              <BrandMark />
              <span className="typography-label-strong-sm text-ws-dynamic-secondary-default min-w-0 flex-1 truncate">
                Wideset
              </span>
              <Sidebar.Trigger />
            </div>
            <button
              type="button"
              className="border-ws-dynamic-secondary-default bg-ws-static-highlight-base shadow-ws-forms-base rounded-ws-control-lg h-ws-19 px-ws-7 hover:border-ws-dynamic-secondary-hover focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex w-full items-center border text-left"
            >
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="typography-label-strong-sm text-ws-dynamic-secondary-default truncate">
                  {workspace.name}
                </span>
                <span className="typography-label-sm text-ws-static-subtle truncate">
                  {workspace.seats} seats
                </span>
              </span>
              <span className="size-ws-11 flex shrink-0 items-center justify-center">
                <RiArrowDownSLine aria-hidden="true" className="size-ws-9 text-ws-static-strong" />
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
            <Avatar initials={account.initials} status="online" />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="typography-label-strong-sm text-ws-static-base truncate">
                {account.name}
              </span>
              <span className="typography-label-sm text-ws-static-subtle truncate">
                {account.email}
              </span>
            </span>
            <span className="size-ws-11 flex shrink-0 items-center justify-center">
              <RiArrowDownSLine aria-hidden="true" className="size-ws-9 text-ws-static-strong" />
            </span>
          </button>
        </Sidebar.Expanded>
        <Sidebar.Collapsed>
          <Avatar initials={account.initials} status="online" title={account.name} />
        </Sidebar.Collapsed>
      </Sidebar.Footer>
    </Sidebar>
  );
}

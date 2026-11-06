import { type RemixiconComponentType, RiCornerUpRightFill } from '@remixicon/react';
import { Avatar, cn, Sidebar } from '@wideset/react';
import { useState } from 'react';

import { navigation, type ShortcutColor, shortcuts } from './data';

const TILE: Record<ShortcutColor, string> = {
  purple: 'bg-ws-non-semantic-purple-strong text-ws-non-semantic-purple-on-strong',
  indigo: 'bg-ws-non-semantic-indigo-strong text-ws-non-semantic-indigo-on-strong',
  blue: 'bg-ws-non-semantic-blue-strong text-ws-non-semantic-blue-on-strong',
  cyan: 'bg-ws-non-semantic-cyan-strong text-ws-non-semantic-cyan-on-strong',
  teal: 'bg-ws-non-semantic-teal-strong text-ws-non-semantic-teal-on-strong',
  green: 'bg-ws-non-semantic-green-strong text-ws-non-semantic-green-on-strong',
};

/** Figma's Sidebar Item `Type=Thumbnail`: a 20px colour tile with a white glyph, as the item icon. */
const shortcutTile = (color: ShortcutColor): RemixiconComponentType => {
  const ShortcutTile = () => (
    <span
      aria-hidden="true"
      className={cn(
        'rounded-ws-control-md size-ws-11 flex shrink-0 items-center justify-center',
        TILE[color],
      )}
    >
      <RiCornerUpRightFill className="size-ws-7" />
    </span>
  );
  return ShortcutTile;
};

const SHORTCUT_ICON: Record<ShortcutColor, RemixiconComponentType> = {
  purple: shortcutTile('purple'),
  indigo: shortcutTile('indigo'),
  blue: shortcutTile('blue'),
  cyan: shortcutTile('cyan'),
  teal: shortcutTile('teal'),
  green: shortcutTile('green'),
};

/** The product sidebar: brand, the studio's pages and the shortcuts to recent experiences. */
export function ProcessSidebar() {
  const [active, setActive] = useState('fit-restarts');

  const links = (
    <nav aria-label="Studio" className="gap-ws-11 flex flex-col">
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
      <Sidebar.Group label="Shortcuts">
        {shortcuts.map((shortcut) => (
          <Sidebar.Item
            key={shortcut.id}
            href={`#${shortcut.id}`}
            icon={SHORTCUT_ICON[shortcut.color]}
            label={shortcut.label}
            active={active === shortcut.id}
            onClick={() => setActive(shortcut.id)}
          />
        ))}
      </Sidebar.Group>
    </nav>
  );

  return (
    <Sidebar>
      <Sidebar.Header>
        <Sidebar.Expanded>
          <div className="gap-ws-7 py-ws-3 pl-ws-5 flex items-center">
            <Avatar shape="square" initials="W" color="brand" />
            <span className="typography-label-strong-sm text-ws-dynamic-secondary-default min-w-0 flex-1 truncate">
              Wideset
            </span>
            <Sidebar.Trigger />
          </div>
        </Sidebar.Expanded>
        <Sidebar.Collapsed>
          <div className="py-ws-3 flex items-center">
            <Sidebar.Trigger />
          </div>
        </Sidebar.Collapsed>
      </Sidebar.Header>

      <Sidebar.Section scrollable>
        <Sidebar.Expanded>{links}</Sidebar.Expanded>
        <Sidebar.Collapsed>{links}</Sidebar.Collapsed>
      </Sidebar.Section>
    </Sidebar>
  );
}

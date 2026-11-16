import {
  RiArrowDownSLine,
  RiDeleteBinLine,
  RiFileCopyLine,
  RiMore2Line,
  RiPencilLine,
  RiShareLine,
} from '@remixicon/react';
import { Button, DropdownMenu, IconButton, ListItem } from '@wideset/react';

import { options, playground, type Values } from '../lib/playground-kit';

/**
 * No generated controls: the menu's look lives in its items (ListItem), and placement is a
 * Radix prop the types table does not list. The stage shows the closed trigger; the menu
 * lives in a portal, and an open one on the gallery page would cover the other cards.
 */
const ITEMS = [
  { label: 'Rename', icon: RiPencilLine, name: 'RiPencilLine' },
  { label: 'Duplicate', icon: RiFileCopyLine, name: 'RiFileCopyLine' },
  { label: 'Share', icon: RiShareLine, name: 'RiShareLine' },
];
/** DropdownMenu.Content's own surface, for the menus drawn open in place. */
const SURFACE =
  'flex min-w-ws-28 flex-col rounded-ws-container-sm bg-ws-static-overlay p-ws-3 text-ws-dynamic-secondary-default shadow-ws-medium';

const item = (v: Values, label: string, Icon: typeof RiPencilLine, danger = false) => (
  <DropdownMenu.Item key={label} variant={danger ? 'danger' : undefined}>
    {v.icons && (
      <ListItem.Prefix>
        <Icon className="size-ws-9" />
      </ListItem.Prefix>
    )}
    <ListItem.Content>
      <ListItem.Label>{label}</ListItem.Label>
    </ListItem.Content>
  </DropdownMenu.Item>
);

const itemCode = (v: Values, label: string, icon: string, danger = false) =>
  [
    `    <DropdownMenu.Item${danger ? ' variant="danger"' : ''}>`,
    ...(v.icons
      ? [
          '      <ListItem.Prefix>',
          `        <${icon} className="size-ws-9" />`,
          '      </ListItem.Prefix>',
        ]
      : []),
    '      <ListItem.Content>',
    `        <ListItem.Label>${label}</ListItem.Label>`,
    '      </ListItem.Content>',
    '    </DropdownMenu.Item>',
  ].join('\n');

/** A static row with DropdownMenu.Item's look: the real item only works inside open content. */
const row = (label: string, Icon?: typeof RiPencilLine, extra: Record<string, string> = {}) => (
  <ListItem key={label} className="min-h-ws-14" {...extra}>
    {Icon && (
      <ListItem.Prefix>
        <Icon className="size-ws-9" />
      </ListItem.Prefix>
    )}
    <ListItem.Content>
      <ListItem.Label>{label}</ListItem.Label>
    </ListItem.Content>
  </ListItem>
);

const trigger = (
  <Button variant="secondary" preset="border">
    Actions
    <Button.Icon icon={RiArrowDownSLine} />
  </Button>
);

export default playground({
  from: [],
  content: [
    {
      key: 'trigger',
      label: 'Trigger',
      type: 'select',
      options: [
        { label: 'Button', value: 'button' },
        { label: 'Icon button', value: 'icon' },
      ],
      default: 'button',
      group: 'Appearance',
    },
    {
      key: 'align',
      label: 'Align',
      type: 'select',
      options: options('start', 'center', 'end'),
      default: 'start',
      group: 'Appearance',
    },
    { key: 'icons', label: 'Icons', type: 'switch', default: true },
    { key: 'destructive', label: 'Delete item', type: 'switch', default: true },
  ],
  render: (v) => (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        {v.trigger === 'icon' ? (
          <IconButton
            icon={RiMore2Line}
            aria-label="File actions"
            variant="secondary"
            preset="border"
          />
        ) : (
          trigger
        )}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align={v.align as 'start' | 'center' | 'end'}>
        {ITEMS.map((i) => item(v, i.label, i.icon))}
        {v.destructive && <DropdownMenu.Separator />}
        {v.destructive && item(v, 'Delete', RiDeleteBinLine, true)}
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
  code: (v) => {
    const triggerCode =
      v.trigger === 'icon'
        ? '    <IconButton icon={RiMore2Line} aria-label="File actions" variant="secondary" preset="border" />'
        : [
            '    <Button variant="secondary" preset="border">',
            '      Actions',
            '      <Button.Icon icon={RiArrowDownSLine} />',
            '    </Button>',
          ].join('\n');
    return [
      '<DropdownMenu>',
      '  <DropdownMenu.Trigger asChild>',
      triggerCode,
      '  </DropdownMenu.Trigger>',
      `  <DropdownMenu.Content${v.align === 'center' ? '' : ` align="${v.align}"`}>`,
      ...ITEMS.map((i) => itemCode(v, i.label, i.name)),
      ...(v.destructive
        ? ['    <DropdownMenu.Separator />', itemCode(v, 'Delete', 'RiDeleteBinLine', true)]
        : []),
      '  </DropdownMenu.Content>',
      '</DropdownMenu>',
    ].join('\n');
  },
  // The menu drawn open under its trigger, in place: the real one portals to the body.
  preview: () => (
    <DropdownMenu>
      <div className="flex flex-col items-start gap-ws-2">
        <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
        <div className={SURFACE}>
          {ITEMS.map((i) => row(i.label, i.icon))}
          <DropdownMenu.Separator />
          <ListItem variant="danger" className="min-h-ws-14">
            <ListItem.Prefix>
              <RiDeleteBinLine className="size-ws-9" />
            </ListItem.Prefix>
            <ListItem.Content>
              <ListItem.Label>Delete</ListItem.Label>
            </ListItem.Content>
          </ListItem>
        </div>
      </div>
    </DropdownMenu>
  ),
  // Every part drawn open in place. Items are static rows with the item's look (the real one
  // needs open content); the root and the portal render no element of their own, and the
  // content's surface is drawn by hand for the same reason.
  anatomy: () => (
    <DropdownMenu>
      <div className="flex flex-col items-start gap-ws-2">
        <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
        <div data-slot="dropdown-menu-content" className={SURFACE}>
          <DropdownMenu.Group>
            {row('Rename', RiPencilLine, { 'data-slot': 'dropdown-menu-item' })}
            {row('Duplicate', RiFileCopyLine)}
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.Label>Sort by</DropdownMenu.Label>
          <DropdownMenu.RadioGroup value="name">
            {row('Name', undefined, { 'data-state': 'checked' })}
            {row('Last modified')}
          </DropdownMenu.RadioGroup>
        </div>
      </div>
    </DropdownMenu>
  ),
});

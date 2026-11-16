import { RiCloudLine, RiRocketLine, RiTeamLine } from '@remixicon/react';
import { Tile } from '@wideset/react';

import { playground, type Values } from '../lib/playground-kit';

const PLAN = [
  { value: 'starter', title: 'Starter', description: 'Up to 3 projects', icon: RiCloudLine },
  { value: 'pro', title: 'Pro', description: 'Unlimited projects', icon: RiRocketLine },
];
const ICON_NAMES: Record<string, string> = { starter: 'RiCloudLine', pro: 'RiRocketLine' };

/** The body props one tile gets, as JSX attributes, in the order the snippet prints them. */
const bodyAttrs = (v: Values, tile: (typeof PLAN)[number]) =>
  [
    `title="${tile.title}"`,
    v.description ? `description="${tile.description}"` : '',
    v.icon ? `icon={${ICON_NAMES[tile.value]}}` : '',
  ].filter(Boolean);

/**
 * The tile types carry no unions or booleans of their own (`disabled` and `checked` come from
 * Radix), so every control is written here. `Tile` itself is static; selection lives in
 * `Tile.Checkbox` and `Tile.Radio`, so the kind of tile is the first choice in the rail.
 */
export default playground({
  from: [],
  content: [
    {
      key: 'kind',
      label: 'Kind',
      type: 'select',
      options: [
        { label: 'Checkbox', value: 'checkbox' },
        { label: 'Radio group', value: 'radio' },
        { label: 'Static', value: 'static' },
      ],
      default: 'checkbox',
      group: 'Appearance',
    },
    { key: 'icon', label: 'Icon', type: 'switch', default: true },
    { key: 'description', label: 'Description', type: 'switch', default: true },
    { key: 'checked', label: 'Selected', type: 'switch', default: true, group: 'State' },
    { key: 'disabled', label: 'Disabled', type: 'switch', default: false, group: 'State' },
  ],
  render: (v) => {
    const body = (tile: (typeof PLAN)[number]) => ({
      title: tile.title,
      description: v.description ? tile.description : undefined,
      icon: v.icon ? tile.icon : undefined,
    });
    // Remount on every change: defaultChecked and defaultValue are read once.
    const key = JSON.stringify(v);
    if (v.kind === 'static')
      return <Tile key={key} className="w-[20rem] max-w-full" {...body(PLAN[1])} />;
    if (v.kind === 'radio')
      return (
        <Tile.RadioGroup
          key={key}
          aria-label="Plan"
          className="w-[20rem] max-w-full"
          defaultValue={v.checked ? 'pro' : undefined}
          disabled={Boolean(v.disabled)}
        >
          {PLAN.map((tile) => (
            <Tile.Radio key={tile.value} value={tile.value} {...body(tile)}>
              <Tile.Indicator />
            </Tile.Radio>
          ))}
        </Tile.RadioGroup>
      );
    return (
      <Tile.Checkbox
        key={key}
        className="w-[20rem] max-w-full"
        defaultChecked={Boolean(v.checked)}
        disabled={Boolean(v.disabled)}
        {...body(PLAN[1])}
      >
        <Tile.Indicator />
      </Tile.Checkbox>
    );
  },
  code: (v) => {
    const state = [v.checked ? 'defaultChecked' : '', v.disabled ? 'disabled' : ''].filter(Boolean);
    const lines = (props: string[], indent: string) => props.map((p) => `${indent}${p}`).join('\n');
    if (v.kind === 'static') return `<Tile\n${lines(bodyAttrs(v, PLAN[1]), '  ')}\n/>`;
    if (v.kind === 'radio') {
      const group = [
        'aria-label="Plan"',
        v.checked ? 'defaultValue="pro"' : '',
        v.disabled ? 'disabled' : '',
      ].filter(Boolean);
      const items = PLAN.map(
        (tile) => `  <Tile.Radio
${lines([`value="${tile.value}"`, ...bodyAttrs(v, tile)], '    ')}
  >
    <Tile.Indicator />
  </Tile.Radio>`,
      ).join('\n');
      return `<Tile.RadioGroup ${group.join(' ')}>\n${items}\n</Tile.RadioGroup>`;
    }
    return `<Tile.Checkbox
${lines([...bodyAttrs(v, PLAN[1]), ...state], '  ')}
>
  <Tile.Indicator />
</Tile.Checkbox>`;
  },
  // Each part is its own kind of tile, so the anatomy stacks one of each.
  anatomy: () => (
    <div className="flex w-[20rem] flex-col gap-ws-13">
      <Tile icon={RiTeamLine} title="Team" description="8 members" />
      <Tile.Checkbox
        icon={RiCloudLine}
        title="Backups"
        description="Daily, kept 30 days"
        defaultChecked
      >
        <Tile.Indicator />
      </Tile.Checkbox>
      <Tile.RadioGroup aria-label="Plan" defaultValue="pro">
        <Tile.Radio value="pro" icon={RiRocketLine} title="Pro">
          <Tile.Indicator />
        </Tile.Radio>
      </Tile.RadioGroup>
    </div>
  ),
});

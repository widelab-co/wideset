import { RiCalendarLine, RiLayoutColumnLine, RiListCheck2 } from '@remixicon/react';
import { SegmentedControl } from '@wideset/react';

import { playground } from '../lib/playground-kit';

const ITEMS = [
  { value: 'list', label: 'List', Icon: RiListCheck2, icon: 'RiListCheck2' },
  { value: 'board', label: 'Board', Icon: RiLayoutColumnLine, icon: 'RiLayoutColumnLine' },
  { value: 'calendar', label: 'Calendar', Icon: RiCalendarLine, icon: 'RiCalendarLine' },
];

/**
 * Variant and size come from `SegmentedControlProps` (items read them from the root);
 * this file adds the view names, the icon mode and Radix's `disabled`.
 */
export default playground({
  from: 'SegmentedControlProps',
  content: [
    {
      key: 'icons',
      label: 'Icons',
      type: 'select',
      options: [
        { label: 'None', value: 'none' },
        { label: 'With label', value: 'label' },
        { label: 'Icon only', value: 'only' },
      ],
      default: 'none',
    },
    // Inherited from the Radix toggle group, so not in the generated controls.
    { key: 'disabled', label: 'Disabled', type: 'switch', default: false, group: 'State' },
  ],
  render: (v, { props }) => (
    <div className={v.variant === 'fullWidth' ? 'w-[20rem] max-w-full' : undefined}>
      <SegmentedControl
        aria-label="View"
        defaultValue="board"
        {...props()}
        disabled={Boolean(v.disabled)}
      >
        {ITEMS.map(({ value, label, Icon }) =>
          v.icons === 'only' ? (
            <SegmentedControl.Item key={value} value={value} icon={Icon} aria-label={label} />
          ) : (
            <SegmentedControl.Item key={value} value={value}>
              {v.icons === 'label' && <SegmentedControl.Icon icon={Icon} />}
              {label}
            </SegmentedControl.Item>
          ),
        )}
      </SegmentedControl>
    </div>
  ),
  code: (v, { attrs }) => {
    const open = `<SegmentedControl aria-label="View" defaultValue="board"${attrs()}${v.disabled ? ' disabled' : ''}>`;
    const items = ITEMS.map(({ value, label, icon }) => {
      if (v.icons === 'only')
        return `  <SegmentedControl.Item value="${value}" icon={${icon}} aria-label="${label}" />`;
      if (v.icons === 'label')
        return `  <SegmentedControl.Item value="${value}">\n    <SegmentedControl.Icon icon={${icon}} />\n    ${label}\n  </SegmentedControl.Item>`;
      return `  <SegmentedControl.Item value="${value}">${label}</SegmentedControl.Item>`;
    });
    const body = items.join('\n');
    const wrapped = v.variant === 'fullWidth';
    const control = `${open}\n${body}\n</SegmentedControl>`;
    return wrapped
      ? `<div className="w-[20rem] max-w-full">\n${control
          .split('\n')
          .map((line) => `  ${line}`)
          .join('\n')}\n</div>`
      : control;
  },
  anatomy: () => (
    <SegmentedControl aria-label="View" defaultValue="board" size="lg">
      {ITEMS.map(({ value, label, Icon }) => (
        <SegmentedControl.Item key={value} value={value}>
          <SegmentedControl.Icon icon={Icon} />
          {label}
        </SegmentedControl.Item>
      ))}
    </SegmentedControl>
  ),
});

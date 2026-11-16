import { RiCloseLine, RiMapPinLine } from '@remixicon/react';
import { Chip } from '@wideset/react';

import { playground } from '../lib/playground-kit';

/**
 * Variant, style, size and disabled come from `ChipProps`; this file only decides the label
 * and where the icon goes.
 */
const LABEL = 'Remote only';

export default playground({
  from: 'ChipProps',
  content: [
    {
      key: 'icon',
      label: 'Icon',
      type: 'select',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Prefix', value: 'prefix' },
        { label: 'Remove (suffix)', value: 'suffix' },
      ],
      default: 'none',
    },
  ],
  render: (v, { props }) => (
    <Chip {...props()}>
      {v.icon === 'prefix' && <Chip.Icon icon={RiMapPinLine} />}
      {LABEL}
      {v.icon === 'suffix' && <Chip.Icon icon={RiCloseLine} />}
    </Chip>
  ),
  code: (v, { attrs }) => {
    const open = `<Chip${attrs()}>`;
    if (v.icon === 'none') return `${open}${LABEL}</Chip>`;
    const body =
      v.icon === 'prefix'
        ? `  <Chip.Icon icon={RiMapPinLine} />\n  ${LABEL}`
        : `  ${LABEL}\n  <Chip.Icon icon={RiCloseLine} />`;
    return `${open}\n${body}\n</Chip>`;
  },
  // With an icon, which the stage starts without; a bordered chip keeps the outline readable.
  anatomy: () => (
    <Chip variant="secondary" style="border" size="lg">
      <Chip.Icon icon={RiMapPinLine} />
      Remote only
    </Chip>
  ),
});

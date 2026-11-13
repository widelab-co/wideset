import { RiMapPinLine } from '@remixicon/react';
import { Chip } from '@wideset/react';

import { playground } from '../lib/playground-kit';

/**
 * Variant, style, size and disabled come from `ChipProps`; this file only decides the label
 * and independently enables the optional main action, leading icon, and removal button.
 */
const LABEL = 'Remote only';

export default playground({
  from: 'ChipProps',
  content: [
    {
      key: 'mainAction',
      label: 'Main action',
      type: 'switch',
      default: true,
    },
    {
      key: 'leadingIcon',
      label: 'Leading icon',
      type: 'switch',
      default: false,
    },
    {
      key: 'removable',
      label: 'Removal button',
      type: 'switch',
      default: true,
    },
  ],
  render: (v, { props }) => (
    <Chip {...props()}>
      {v.mainAction ? (
        <Chip.Action>
          {v.leadingIcon && <Chip.Icon icon={RiMapPinLine} />}
          <Chip.Label>{LABEL}</Chip.Label>
        </Chip.Action>
      ) : (
        <>
          {v.leadingIcon && <Chip.Icon icon={RiMapPinLine} />}
          <Chip.Label>{LABEL}</Chip.Label>
        </>
      )}
      {v.removable && <Chip.IconButton aria-label="Remove Remote only filter" />}
    </Chip>
  ),
  code: (v, { attrs }) => {
    const open = `<Chip${attrs()}>`;
    const indent = v.mainAction ? '    ' : '  ';
    const icon = v.leadingIcon ? `${indent}<Chip.Icon icon={RiMapPinLine} />\n` : '';
    const label = `${indent}<Chip.Label>${LABEL}</Chip.Label>`;
    const content = `${icon}${label}`;
    const main = v.mainAction ? `  <Chip.Action>\n${content}\n  </Chip.Action>` : content;
    const remove = v.removable
      ? `\n  <Chip.IconButton aria-label="Remove Remote only filter" />`
      : '';
    const body = `${main}${remove}`;
    return `${open}\n${body}\n</Chip>`;
  },
  // With an icon, which the stage starts without; a bordered chip keeps the outline readable.
  anatomy: () => (
    <Chip variant="secondary" style="border" size="lg">
      <Chip.Action>
        <Chip.Icon icon={RiMapPinLine} />
        <Chip.Label>Remote only</Chip.Label>
      </Chip.Action>
      <Chip.IconButton aria-label="Remove Remote only filter" />
    </Chip>
  ),
});

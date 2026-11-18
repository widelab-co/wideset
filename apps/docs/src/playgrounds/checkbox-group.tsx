import { Checkbox, CheckboxGroup } from '@wideset/react';

import { playground } from '../lib/playground-kit';

/**
 * Orientation comes from `CheckboxGroupProps` and the checkbox size from `CheckboxProps`;
 * this file only decides the channels and whether they carry descriptions.
 */
const CHANNELS = [
  { label: 'Email', description: 'A daily digest at 8:00', checked: true },
  { label: 'Push', description: 'Mentions and replies only', checked: true },
  { label: 'SMS', description: 'Security alerts only', checked: false },
];

export default playground({
  from: ['CheckboxGroupProps', 'CheckboxProps'],
  // A danger checkbox is a per-field validation state, not a look of the group.
  only: ['orientation', 'size'],
  content: [{ key: 'description', label: 'Descriptions', type: 'switch', default: true }],
  render: (v, { props }) => (
    <CheckboxGroup aria-label="Notification channels" {...props()}>
      {CHANNELS.map((channel) => (
        <Checkbox
          key={channel.label}
          {...props('CheckboxProps')}
          label={channel.label}
          description={v.description ? channel.description : undefined}
          defaultChecked={channel.checked}
        />
      ))}
    </CheckboxGroup>
  ),
  code: (v, { attrs }) =>
    [
      `<CheckboxGroup aria-label="Notification channels"${attrs()}>`,
      ...CHANNELS.map(
        (channel) =>
          `  <Checkbox label="${channel.label}"${
            v.description ? ` description="${channel.description}"` : ''
          }${channel.checked ? ' defaultChecked' : ''}${attrs('CheckboxProps')} />`,
      ),
      '</CheckboxGroup>',
    ].join('\n'),
});

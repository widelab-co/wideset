import { RiMapPinLine } from '@remixicon/react';
import { ComboBox } from '@wideset/react';

import { playground } from '../lib/playground-kit';

/**
 * Variant, style, size, clear button and disabled come from `ComboBoxProps`. The list opens
 * in a portal, so the stage shows the closed field with a city chosen.
 */
const CITIES = [
  { value: 'lisbon', label: 'Lisbon' },
  { value: 'berlin', label: 'Berlin' },
  { value: 'warsaw', label: 'Warsaw' },
  { value: 'amsterdam', label: 'Amsterdam' },
];
const PLACEHOLDER = 'Select a city';

export default playground({
  from: 'ComboBoxProps',
  // Restricting the value to the options changes typing, not anything on the stage.
  hide: ['disallowCustomValue'],
  labels: { clearable: 'Clear button' },
  group: { clearable: 'Content' },
  // The size is inherited from another component's variants, so the types cannot see its default.
  defaults: { size: 'md' },
  content: [{ key: 'value', label: 'With a value', type: 'switch', default: true }],
  render: (v, { props }) => (
    <ComboBox
      key={String(v.value)}
      options={CITIES}
      placeholder={PLACEHOLDER}
      defaultValue={v.value ? 'lisbon' : undefined}
      {...props()}
    />
  ),
  code: (v, { attrs }) => {
    const lines = [
      'options={[',
      ...CITIES.map((city) => `  { value: '${city.value}', label: '${city.label}' },`),
      ']}',
      `placeholder="${PLACEHOLDER}"`,
      ...(v.value ? ['defaultValue="lisbon"'] : []),
      ...attrs().split(' ').filter(Boolean),
    ];
    return `<ComboBox\n${lines.map((line) => `  ${line}`).join('\n')}\n/>`;
  },
  // Parts the picture cannot draw. Only while typing: the highlighted match in an option's label.
  absent: {
    ComboBoxHighlightedLabel: 'Only while typing',
  },
  // The list drawn open under the trigger, in place: the real one portals to the body and
  // only mounts while open. The root renders no element of its own.
  anatomy: () => (
    <div className="flex w-[16rem] flex-col gap-ws-2">
      <ComboBox options={CITIES} defaultValue="lisbon">
        <ComboBox.Trigger hasPrefix className="w-full">
          <ComboBox.Prefix>
            <ComboBox.Icon icon={RiMapPinLine} />
          </ComboBox.Prefix>
        </ComboBox.Trigger>
        <div
          data-slot="combo-box-content"
          className="rounded-ws-container-sm bg-ws-static-overlay shadow-ws-medium"
        >
          <ul role="listbox" className="p-ws-3">
            <ComboBox.Item value="lisbon" />
            <ComboBox.Item value="berlin" />
            <ComboBox.Item value="warsaw" />
          </ul>
        </div>
      </ComboBox>
    </div>
  ),
});

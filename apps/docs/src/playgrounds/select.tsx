import { Select } from '@wideset/react';

import { playground } from '../lib/playground-kit';

const TEAMS = [
  { value: 'design', label: 'Design' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'support', label: 'Customer support' },
];

/** The list drawn in place: the real one portals over the page and traps focus while open. */
const LIST =
  'flex w-[16rem] flex-col rounded-ws-container-sm bg-ws-static-overlay p-ws-3 shadow-ws-medium';

/**
 * Style, size, variant, arrow, clear button and search come from `SelectProps`. The stage
 * shows the closed trigger with a value chosen; clicking it opens the list.
 */
export default playground({
  from: 'SelectProps',
  // Size comes from the trigger's variants, so the types do not know its `md` default.
  defaults: { size: 'md' },
  labels: { clearable: 'Clear button', hasSearch: 'Search in list' },
  group: { clearable: 'Behavior', hasSearch: 'Behavior' },
  content: [
    { key: 'selected', label: 'Value chosen', type: 'switch', default: true },
    // Inherited from the Radix root, so not in the generated controls.
    { key: 'disabled', label: 'Disabled', type: 'switch', default: false, group: 'State' },
  ],
  render: (v, { props }) => (
    <Select
      key={String(v.selected)}
      options={TEAMS}
      defaultValue={v.selected ? 'engineering' : undefined}
      placeholder="Choose a team"
      aria-label="Team"
      {...props()}
      disabled={Boolean(v.disabled)}
    />
  ),
  code: (v, { attrs }) => {
    const list = TEAMS.map(({ value, label }) => `    { value: '${value}', label: '${label}' },`);
    const lines = [
      v.selected ? 'defaultValue="engineering"' : '',
      'placeholder="Choose a team"',
      'aria-label="Team"',
      ...attrs().trim().split(' '),
      v.disabled ? 'disabled' : '',
    ].filter(Boolean);
    return `<Select\n  options={[\n${list.join('\n')}\n  ]}\n${lines.map((line) => `  ${line}`).join('\n')}\n/>`;
  },
  preview: () => (
    <div className="flex flex-col gap-ws-3">
      <Select options={TEAMS} defaultValue="engineering" aria-label="Team" className="w-[16rem]" />
      <div className={LIST}>
        {TEAMS.map(({ value, label }) => (
          <Select.Option
            key={value}
            shouldUsePrimitive={false}
            data-state={value === 'engineering' ? 'checked' : undefined}
          >
            {label}
          </Select.Option>
        ))}
      </div>
    </div>
  ),
});

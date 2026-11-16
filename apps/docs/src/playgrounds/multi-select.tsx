import { Checkbox, ListItem, MultiSelect } from '@wideset/react';

import { options, playground } from '../lib/playground-kit';

/**
 * The stage shows the closed trigger with two teams chosen: the option list portals to the
 * body. Clicking the trigger on the page opens it, with search and select all when they are
 * on. Size, style, variant and the switches come from `MultiSelectProps`.
 */
const TEAMS = [
  { value: 'design', label: 'Design' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
];
const CHOSEN = ['design', 'engineering'];

export default playground({
  from: 'MultiSelectProps',
  // Open state and modality are plumbing; the stage opens on click.
  hide: ['open', 'modal'],
  labels: {
    clearable: 'Clear button',
    hasSearch: 'Search',
    hasSelectAll: 'Select all',
  },
  group: { clearable: 'Content', hasSearch: 'Content', hasSelectAll: 'Content' },
  // The size default lives in the Select trigger's variants, which MultiSelectProps does not
  // reference; without this the size would start at small.
  defaults: { size: 'md' },
  content: [
    {
      key: 'display',
      label: 'Selection',
      type: 'select',
      options: options('tags', 'summary'),
      default: 'tags',
    },
  ],
  render: (v, { props }) => (
    <div className="w-[20rem] max-w-full">
      <MultiSelect
        {...props()}
        options={TEAMS}
        defaultValue={CHOSEN}
        placeholder="Select teams"
        multiValuesLabel={v.display === 'summary' ? 'teams' : undefined}
        maxVisibleTags={v.display === 'summary' ? 0 : undefined}
      />
    </div>
  ),
  code: (v, { attrs }) => {
    const lines = [
      'options={[',
      ...TEAMS.map((t) => `  { value: '${t.value}', label: '${t.label}' },`),
      ']}',
      `defaultValue={[${CHOSEN.map((c) => `'${c}'`).join(', ')}]}`,
      'placeholder="Select teams"',
      ...(v.display === 'summary' ? ['maxVisibleTags={0}', 'multiValuesLabel="teams"'] : []),
      ...attrs().trim().split(' ').filter(Boolean),
    ];
    return `<MultiSelect\n${lines.map((l) => `  ${l}`).join('\n')}\n/>`;
  },
  // The trigger is the real one (root props land on it). The open list is drawn in place
  // with the same parts: the real content portals to the body, and MultiSelect.Option needs
  // an open menu, so its rows are the List items it renders.
  anatomy: () => (
    <div className="flex w-[20rem] max-w-full flex-col gap-ws-3">
      <MultiSelect options={TEAMS} defaultValue={CHOSEN} placeholder="Select teams" />
      <div
        data-slot="multi-select-content"
        className="flex flex-col rounded-ws-container-sm bg-ws-static-overlay p-ws-3 text-ws-dynamic-secondary-default shadow-ws-medium"
      >
        <MultiSelect.Group>
          <MultiSelect.Label>Product</MultiSelect.Label>
          {TEAMS.slice(0, 2).map((team, index) => (
            <ListItem
              key={team.value}
              data-state="checked"
              shouldDisplayCheckmark={false}
              {...(index === 0 ? { 'data-slot': 'multi-select-option' } : {})}
            >
              <ListItem.Prefix>
                <Checkbox checked tabIndex={-1} className="pointer-events-none" />
              </ListItem.Prefix>
              <ListItem.Label>{team.label}</ListItem.Label>
            </ListItem>
          ))}
        </MultiSelect.Group>
        <MultiSelect.Separator />
        <MultiSelect.Group>
          <MultiSelect.Label>Go to market</MultiSelect.Label>
          {TEAMS.slice(2).map((team) => (
            <ListItem key={team.value}>
              <ListItem.Prefix>
                <Checkbox tabIndex={-1} className="pointer-events-none" />
              </ListItem.Prefix>
              <ListItem.Label>{team.label}</ListItem.Label>
            </ListItem>
          ))}
        </MultiSelect.Group>
      </div>
    </div>
  ),
});

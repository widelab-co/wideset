import { RiArrowRightSLine, RiFolderLine } from '@remixicon/react';
import { ListItem } from '@wideset/react';

import { options, playground } from '../lib/playground-kit';

/**
 * Variant and disabled come from `ListItemProps`. Selected is `data-state="checked"`, which
 * the menus that wrap a list item set for you; here it is a switch so the tint and checkmark
 * can be compared.
 */
export default playground({
  from: 'ListItemProps',
  labels: { shouldDisplayCheckmark: 'Checkmark' },
  // Only shows while selected, so it sits next to Selected.
  group: { shouldDisplayCheckmark: 'State' },
  content: [
    { key: 'prefix', label: 'Icon', type: 'switch', default: true },
    { key: 'description', label: 'Description', type: 'switch', default: true },
    {
      key: 'suffix',
      label: 'Suffix',
      type: 'select',
      options: options('none', 'text', 'chevron'),
      default: 'none',
    },
    { key: 'checked', label: 'Selected', type: 'switch', default: false, group: 'State' },
  ],
  render: (v, { props }) => (
    <div className="w-[20rem] max-w-full">
      <ListItem {...props()} data-state={v.checked ? 'checked' : undefined}>
        {v.prefix && (
          <ListItem.Prefix>
            <RiFolderLine className="size-ws-9" />
          </ListItem.Prefix>
        )}
        <ListItem.Content>
          <ListItem.Label>Marketing assets</ListItem.Label>
          {v.description && <ListItem.Description>24 files, edited today</ListItem.Description>}
        </ListItem.Content>
        {v.suffix === 'text' && <ListItem.Suffix>2.4 MB</ListItem.Suffix>}
        {v.suffix === 'chevron' && (
          <ListItem.Suffix>
            <RiArrowRightSLine className="size-ws-9" />
          </ListItem.Suffix>
        )}
      </ListItem>
    </div>
  ),
  code: (v, { attrs }) => {
    const parts = [
      v.prefix &&
        '  <ListItem.Prefix>\n    <RiFolderLine className="size-ws-9" />\n  </ListItem.Prefix>',
      [
        '  <ListItem.Content>',
        '    <ListItem.Label>Marketing assets</ListItem.Label>',
        v.description && '    <ListItem.Description>24 files, edited today</ListItem.Description>',
        '  </ListItem.Content>',
      ]
        .filter(Boolean)
        .join('\n'),
      v.suffix === 'text' && '  <ListItem.Suffix>2.4 MB</ListItem.Suffix>',
      v.suffix === 'chevron' &&
        '  <ListItem.Suffix>\n    <RiArrowRightSLine className="size-ws-9" />\n  </ListItem.Suffix>',
    ].filter(Boolean);
    const state = v.checked ? ' data-state="checked"' : '';
    return `<ListItem${attrs()}${state}>\n${parts.join('\n')}\n</ListItem>`;
  },
  anatomy: () => (
    <div className="w-[20rem] max-w-full">
      <ListItem>
        <ListItem.Prefix>
          <RiFolderLine className="size-ws-9" />
        </ListItem.Prefix>
        <ListItem.Content>
          <ListItem.Label>Marketing assets</ListItem.Label>
          <ListItem.Description>24 files, edited today</ListItem.Description>
        </ListItem.Content>
        <ListItem.Suffix>2.4 MB</ListItem.Suffix>
      </ListItem>
    </div>
  ),
});

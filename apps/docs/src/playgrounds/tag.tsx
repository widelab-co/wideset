import { RiHashtag, RiPaletteLine, RiRocketLine, RiSearchLine } from '@remixicon/react';
import { Tag } from '@wideset/react';

import { playground } from '../lib/playground-kit';

/** A tag rarely comes alone: the stage shows the set a project card would carry. */
const TAGS = [
  { label: 'Design', icon: RiPaletteLine, name: 'RiPaletteLine' },
  { label: 'Research', icon: RiSearchLine, name: 'RiSearchLine' },
  { label: 'Q4 launch', icon: RiRocketLine, name: 'RiRocketLine' },
];

/**
 * Color, style, size, shape and icon-only come from `TagProps`; this file only decides the
 * labels and whether a leading icon is shown.
 */
export default playground({
  from: 'TagProps',
  // Truncation only shows in a container narrower than the label.
  hide: ['truncate'],
  labels: { iconOnly: 'Icon only' },
  content: [{ key: 'icon', label: 'Icon', type: 'switch', default: false }],
  render: (v, { props }) => (
    <div className="flex flex-wrap items-center justify-center gap-ws-4">
      {TAGS.map((tag) => (
        <Tag key={tag.label} {...props()}>
          {(v.icon || v.iconOnly) && <Tag.Icon icon={tag.icon} />}
          {v.iconOnly ? <span className="sr-only">{tag.label}</span> : tag.label}
        </Tag>
      ))}
    </div>
  ),
  code: (v, { attrs }) =>
    TAGS.map((tag) => {
      const open = `<Tag${attrs()}>`;
      if (v.iconOnly)
        return `${open}\n  <Tag.Icon icon={${tag.name}} />\n  <span className="sr-only">${tag.label}</span>\n</Tag>`;
      if (v.icon) return `${open}\n  <Tag.Icon icon={${tag.name}} />\n  ${tag.label}\n</Tag>`;
      return `${open}${tag.label}</Tag>`;
    }).join('\n'),
  // Both parts on one mid-size tag.
  anatomy: () => (
    <Tag size="lg" color="blue">
      <Tag.Icon icon={RiHashtag} />
      Research
    </Tag>
  ),
});

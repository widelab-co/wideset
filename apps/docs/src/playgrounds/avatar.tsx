import { RiUserLine } from '@remixicon/react';
import { Avatar, type AvatarProps } from '@wideset/react';

import { options, playground } from '../lib/playground-kit';

const PHOTOS = [
  'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?&w=128&h=128&dpr=2&q=80',
];
const INITIALS = ['AK', 'TS', 'ML', 'JB'];

/** One entry per avatar on the stage: the props it renders with and the same props as JSX. */
type Person = { props: AvatarProps; code: string };

const person = (content: unknown, index: number): Person => {
  if (content === 'image' && index < PHOTOS.length)
    return {
      props: { src: PHOTOS[index], alt: '', initials: INITIALS[index] },
      code: `src="${PHOTOS[index]}" initials="${INITIALS[index]}"`,
    };
  if (content === 'icon') return { props: { icon: <RiUserLine /> }, code: 'icon={<RiUserLine />}' };
  if (content === 'agent' && index === 0) return { props: { agent: true }, code: 'agent' };
  return { props: { initials: INITIALS[index] }, code: `initials="${INITIALS[index]}"` };
};

/** Which avatar each generated prop goes on when they are shown as a group. */
const ON_GROUP = ['size', 'shape', 'color'];
const ON_FIRST = ['status', 'selected'];
/** `attrs()` split back into ` name="value"` / ` name` pieces, kept for the given props. */
const pick = (text: string, names: string[]) =>
  (text.match(/ \w+(="[^"]*")?/g) ?? [])
    .filter((attr) => names.includes(attr.trim().split('=')[0]))
    .join('');

/**
 * Size, shape, colour, status and selected come from `AvatarProps`. Colour and status are
 * optional: left unset, the hue comes from the initials and there is no dot. As a group,
 * size, shape and colour go on `Avatar.Group`; status and selected mark the first avatar only.
 */
export default playground({
  from: 'AvatarProps',
  optional: { color: 'From initials', status: 'None' },
  group: { status: 'State' },
  defaults: { size: 'lg' },
  content: [
    {
      key: 'content',
      label: 'Content',
      type: 'select',
      options: [
        { label: 'Initials', value: 'initials' },
        { label: 'Image', value: 'image' },
        { label: 'Icon', value: 'icon' },
        { label: 'Agent', value: 'agent' },
      ],
      default: 'initials',
    },
    {
      key: 'shown',
      label: 'Shown',
      type: 'select',
      options: options('single', 'group'),
      default: 'group',
    },
  ],
  render: (v, { props }) => {
    if (v.shown === 'single') return <Avatar {...person(v.content, 0).props} {...props()} />;
    const { size, shape, color, status, selected } = props();
    return (
      <Avatar.Group size={size as never} shape={shape as never} color={color as never}>
        {INITIALS.map((initials, index) => (
          <Avatar
            key={initials}
            {...person(v.content, index).props}
            status={index === 0 ? (status as never) : undefined}
            selected={index === 0 && Boolean(selected)}
          />
        ))}
        <Avatar.More>+5</Avatar.More>
      </Avatar.Group>
    );
  },
  code: (v, { attrs }) => {
    if (v.shown === 'single') return `<Avatar ${person(v.content, 0).code}${attrs()} />`;
    return [
      `<Avatar.Group${pick(attrs(), ON_GROUP)}>`,
      ...INITIALS.map((_, index) => {
        const code = person(v.content, index).code;
        return `  <Avatar ${code}${index === 0 ? pick(attrs(), ON_FIRST) : ''} />`;
      }),
      '  <Avatar.More>+5</Avatar.More>',
      '</Avatar.Group>',
    ].join('\n');
  },
  // A group so the overflow badge has a place; the first avatar carries the status dot.
  anatomy: () => (
    <Avatar.Group size="xl">
      <Avatar initials="AK" status="online" />
      <Avatar initials="TS" />
      <Avatar initials="ML" />
      <Avatar.More>+5</Avatar.More>
    </Avatar.Group>
  ),
});

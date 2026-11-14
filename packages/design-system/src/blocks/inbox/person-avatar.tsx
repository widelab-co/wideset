import { Avatar, type AvatarProps } from '@wideset/react';

import { PHOTOS } from './people.assets';

type PersonAvatarProps = Pick<
  AvatarProps,
  'size' | 'shape' | 'status' | 'color' | 'className' | 'style' | 'title' | 'aria-hidden'
> & {
  name: string;
  initials: string;
  /** The photo's text: empty beside the person's name, their name where the avatar stands alone. */
  alt?: string;
};

/**
 * A person's avatar: their photo when `people.assets.ts` has one, with the initials as its
 * fallback, otherwise the initials on their colour. Every place that draws a person uses it, so
 * someone has the same face across the screen and photos mix with initials as in a real product.
 */
export function PersonAvatar({ name, initials, color, alt = '', ...props }: PersonAvatarProps) {
  const photo = PHOTOS[name];
  return photo ? (
    <Avatar src={photo} alt={alt} initials={initials} {...props} />
  ) : (
    <Avatar initials={initials} color={color} {...props} />
  );
}

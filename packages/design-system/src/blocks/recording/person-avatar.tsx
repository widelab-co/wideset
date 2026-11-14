import type { AvatarProps } from '@wideset/react';
import { Avatar } from '@wideset/react';

import { PHOTOS } from './people.assets';

type PersonAvatarProps = Pick<
  AvatarProps,
  | 'size'
  | 'shape'
  | 'status'
  | 'color'
  | 'className'
  | 'style'
  | 'title'
  | 'aria-hidden'
  | 'aria-label'
> & {
  /** The person's full name: the key their photo is filed under. */
  name: string;
  initials: string;
  /** Leave empty beside the person's name; pass the name where the avatar stands alone. */
  alt?: string;
};

/**
 * A person's avatar: their photo when the sample people have one, otherwise their initials in
 * their colour. A real product mixes the two, so every place the block draws a person asks here
 * and the choice is made once. The initials stay as the fallback if the image fails to load.
 * `style` is passed on because `Avatar.Group` sets the stacking order on each of its avatars.
 */
export function PersonAvatar({ name, initials, color, alt = '', ...props }: PersonAvatarProps) {
  const photo = PHOTOS[name];
  return photo ? (
    <Avatar src={photo} alt={alt} initials={initials} {...props} />
  ) : (
    <Avatar initials={initials} color={color} {...props} />
  );
}

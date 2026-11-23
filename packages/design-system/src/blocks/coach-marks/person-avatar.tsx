import type { AvatarColor, AvatarProps } from '@wideset/react';
import { Avatar } from '@wideset/react';

import { PHOTOS } from './people.assets';

type PersonAvatarProps = Pick<
  AvatarProps,
  'size' | 'status' | 'className' | 'title' | 'aria-hidden'
> & {
  /** The person's full name: the key their photo is stored under. */
  name: string;
  initials: string;
  /** The colour of the initials. A photo takes none. */
  color?: AvatarColor;
  /** Empty beside the person's name (the default); their name when the avatar stands alone. */
  alt?: string;
};

/**
 * A person's avatar: their photo when there is one, their initials otherwise, which is also what
 * shows if the photo fails to load. The one place the block makes that choice, so a list that
 * mixes photos and initials is still drawn the same way everywhere.
 */
export function PersonAvatar({ name, initials, color, alt = '', ...avatar }: PersonAvatarProps) {
  const photo = PHOTOS[name];
  return photo ? (
    <Avatar src={photo} alt={alt} initials={initials} {...avatar} />
  ) : (
    <Avatar initials={initials} color={color} {...avatar} />
  );
}

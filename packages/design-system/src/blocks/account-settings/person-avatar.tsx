import { Avatar, type AvatarColor, type AvatarProps } from '@wideset/react';

import { PHOTOS } from './people.assets';

type PersonAvatarProps = Pick<
  AvatarProps,
  'size' | 'shape' | 'status' | 'className' | 'style' | 'title' | 'aria-hidden' | 'aria-label'
> & {
  /** The person's full name: the key their photo is filed under. */
  name: string;
  initials: string;
  /** The colour of the initials. A photo takes none. */
  color?: AvatarColor;
  /** Empty beside the person's name (the default); their name when the avatar stands alone. */
  alt?: string;
};

/**
 * A person's avatar: their photo when they have one, their initials when not. The choice lives
 * here so every place the block draws a person mixes the two the same way. The rest of the props
 * go to the `Avatar`, so it also sits in an `Avatar.Group`.
 */
export function PersonAvatar({ name, initials, color, alt = '', ...avatar }: PersonAvatarProps) {
  const photo = PHOTOS[name];
  return photo ? (
    <Avatar src={photo} alt={alt} initials={initials} {...avatar} />
  ) : (
    <Avatar initials={initials} color={color} {...avatar} />
  );
}

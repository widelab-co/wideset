import { Children, cloneElement, type CSSProperties, isValidElement } from 'react';
import { cn } from 'src/lib/utils';

import { type AvatarColor, getAvatarColor } from './Avatar.colors';
import type { GroupProps } from './Avatar.types';
import { groupVariants } from './Avatar.variants';
import { AvatarGroupContext } from './AvatarGroup.context';

type AvatarChild = {
  color?: AvatarColor;
  initials?: string;
  src?: string;
  style?: CSSProperties;
};

const paintsAHue = (props: AvatarChild) => !!props.initials && !props.src;

/**
 * Lays avatars out in a row or a grid, and gives each one a distinct colour.
 * Place `Avatar.More` last for an overflow badge.
 */
const AvatarGroup = ({
  size = 'md',
  shape = 'round',
  layout = 'row',
  color,
  className,
  children,
  ...props
}: GroupProps) => {
  const displayedAvatars = Children.toArray(children);

  const taken = new Set<AvatarColor>();
  for (const avatar of displayedAvatars) {
    if (isValidElement<AvatarChild>(avatar) && avatar.props.color) taken.add(avatar.props.color);
  }

  const preparedAvatars = displayedAvatars.map((avatar, index) => {
    if (!isValidElement<AvatarChild>(avatar)) return avatar;

    const next: AvatarChild = {};

    if (!color && !avatar.props.color && paintsAHue(avatar.props)) {
      next.color = getAvatarColor(avatar.props.initials as string, taken);
      taken.add(next.color);
    }

    if (layout === 'row') {
      next.style = { zIndex: displayedAvatars.length - index, ...avatar.props.style };
    }

    return cloneElement(avatar, next);
  });

  return (
    <AvatarGroupContext.Provider value={{ size, shape, color, layout }}>
      <div
        data-slot="avatar-group"
        className={cn('w-full', groupVariants({ size, layout, className }))}
        {...props}
      >
        {preparedAvatars}
      </div>
    </AvatarGroupContext.Provider>
  );
};

AvatarGroup.displayName = 'Avatar.Group';

export { AvatarGroup };

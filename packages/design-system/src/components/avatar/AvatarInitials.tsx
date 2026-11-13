import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from 'src/lib/utils';

import { getAvatarColor, initialsColorVariants } from './Avatar.colors';
import { getVisibleInitials } from './Avatar.logic';
import type { InitialsProps } from './Avatar.types';
import { avatarVariants } from './Avatar.variants';
import { useAvatarGroupContext } from './AvatarGroup.context';

const AvatarInitials = ({ initials, size, shape, status, color, className }: InitialsProps) => {
  const context = useAvatarGroupContext();
  const resolvedSize = size || context?.size;
  const shown = getVisibleInitials(initials, resolvedSize);

  // `Avatar.Group` resolves its own avatars together so it can keep them
  // distinct, and passes the result down; anything else derives its hue here.
  const resolved = color ?? context?.color ?? getAvatarColor(initials);

  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-initials"
      className={cn(
        avatarVariants({
          size: resolvedSize,
          shape: shape || context?.shape,
          hasStatus: !!status,
        }),
        initialsColorVariants({ color: resolved, className }),
      )}
    >
      {shown}
    </AvatarPrimitive.Fallback>
  );
};

AvatarInitials.displayName = 'Avatar.Initials';

export { AvatarInitials };

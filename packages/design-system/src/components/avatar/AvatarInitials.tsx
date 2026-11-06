import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from 'src/lib/utils';

import { getAvatarColor, initialsColorVariants } from './Avatar.colors';
import type { InitialsProps } from './Avatar.types';
import { avatarVariants } from './Avatar.variants';
import { useAvatarGroupContext } from './AvatarGroup.context';

/** Below 32px two letters crowd the circle: Figma draws one letter there, so xs and sm show the first. */
const ONE_LETTER_SIZES = new Set(['xs', 'sm']);

const AvatarInitials = ({ initials, size, shape, status, color, className }: InitialsProps) => {
  const context = useAvatarGroupContext();
  const resolvedSize = size || context?.size;
  // Array.from keeps a letter such as "Ł" or an emoji whole instead of cutting a surrogate pair.
  const shown = ONE_LETTER_SIZES.has(resolvedSize ?? 'md')
    ? (Array.from(initials.trim())[0] ?? '')
    : initials;

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

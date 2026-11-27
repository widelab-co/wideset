import { RiUser3Line } from '@remixicon/react';
import { cn } from 'src/lib/utils';

import type { IconProps } from './Avatar.types';
import { avatarVariants } from './Avatar.variants';
import { useAvatarGroupContext } from './AvatarGroup.context';

const AvatarIcon = ({ size, shape, icon, className, status }: IconProps) => {
  const context = useAvatarGroupContext();

  return (
    <div
      data-slot="avatar-icon"
      // Decorative: the name comes from `aria-label` on the Avatar root.
      aria-hidden="true"
      className={cn(
        'flex items-center justify-center',
        avatarVariants({
          size: size || context?.size,
          shape: shape || context?.shape,
          hasStatus: !!status,
          className,
        }),
      )}
    >
      {icon || <RiUser3Line aria-hidden="true" focusable="false" className="fill-ws-static-base" />}
    </div>
  );
};

AvatarIcon.displayName = 'Avatar.Icon';

export { AvatarIcon };

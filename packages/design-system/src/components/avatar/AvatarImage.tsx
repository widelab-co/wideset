import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { RiUser3Line } from '@remixicon/react';
import { cn } from 'src/lib/utils';

import { getVisibleInitials } from './Avatar.logic';
import type { ImageProps } from './Avatar.types';
import { avatarVariants } from './Avatar.variants';
import { useAvatarGroupContext } from './AvatarGroup.context';

const AvatarImage = ({
  src,
  alt,
  size,
  shape,
  status,
  initials,
  fallback,
  className,
}: ImageProps) => {
  const context = useAvatarGroupContext();

  const FallbackComponent = () =>
    fallback ||
    (initials && getVisibleInitials(initials, size || context?.size)) || (
      <RiUser3Line aria-hidden="true" focusable="false" className="fill-ws-static-base" />
    );

  return (
    <>
      <AvatarPrimitive.Image
        data-slot="avatar-image"
        src={src}
        alt={alt}
        className={cn(
          avatarVariants({
            size: size || context?.size,
            shape: shape || context?.shape,
            hasStatus: !!status,
            className,
          }),
        )}
      />
      <AvatarPrimitive.Fallback
        data-slot="avatar-fallback"
        className={cn(
          avatarVariants({
            size: size || context?.size,
            shape: shape || context?.shape,
            hasStatus: !!status,
            className,
          }),
        )}
      >
        <FallbackComponent />
      </AvatarPrimitive.Fallback>
    </>
  );
};

AvatarImage.displayName = 'Avatar.Image';

export { AvatarImage };

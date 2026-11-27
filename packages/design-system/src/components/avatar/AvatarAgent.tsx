import { cn } from 'src/lib/utils';

import { avatarRoundedOrb, avatarSquareOrb } from './Avatar.assets';
import type { AgentProps } from './Avatar.types';
import { avatarVariants } from './Avatar.variants';
import { useAvatarGroupContext } from './AvatarGroup.context';

/**
 * Avatar for an agent, rendered as the orb.
 */
const AvatarAgent = ({ size, shape, status, alt = 'Agent', className }: AgentProps) => {
  const context = useAvatarGroupContext();
  const resolvedShape = shape || context?.shape || 'round';

  return (
    <img
      data-slot="avatar-agent"
      alt={alt}
      className={cn(
        avatarVariants({
          size: size || context?.size,
          shape: resolvedShape,
          hasStatus: !!status,
          grouped: context?.layout === 'row',
          className,
        }),
      )}
      src={resolvedShape === 'square' ? avatarSquareOrb : avatarRoundedOrb}
    />
  );
};

AvatarAgent.displayName = 'Avatar.Agent';

export { AvatarAgent };

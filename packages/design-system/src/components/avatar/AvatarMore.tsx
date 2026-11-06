import { cn } from 'src/lib/utils';

import type { MoreProps } from './Avatar.types';
import { moreVariants } from './Avatar.variants';
import { useAvatarGroupContext } from './AvatarGroup.context';

/**
 * Trailing slot in an `Avatar.Group` — an overflow badge, or an action. Inherits
 * `size` and `shape` from the group. Inert without an `onClick`.
 */
const AvatarMore = ({ size, shape, className, children, onClick, ...props }: MoreProps) => {
  const context = useAvatarGroupContext();

  const styles = cn(
    onClick
      ? [
          'focus-visible:wds-focus-visible focus-visible:outline-ws-dynamic-primary-strong-default cursor-pointer',
          'hover:bg-ws-dynamic-secondary-alpha-strong-hover',
          'active:bg-ws-dynamic-secondary-alpha-strong-pressed',
        ].join(' ')
      : 'cursor-default',
    moreVariants({
      size: size || context?.size,
      shape: shape || context?.shape,
      className,
    }),
  );

  // Without an action it is a label, not a control — a `button` here would be
  // focusable and announced as pressable while doing nothing.
  if (!onClick) {
    return (
      <span data-slot="avatar-more" className={styles} {...props}>
        {children}
      </span>
    );
  }

  return (
    <button data-slot="avatar-more" className={styles} onClick={onClick} type="button" {...props}>
      {children}
    </button>
  );
};

AvatarMore.displayName = 'Avatar.More';

export { AvatarMore };

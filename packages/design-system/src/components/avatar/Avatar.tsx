import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { forwardRef } from 'react';
import { cn } from 'src/lib/utils';

import type { AvatarProps, AvatarWithSubComponents } from './Avatar.types';
import { selectionRingVariants } from './Avatar.variants';
import { AvatarAgent } from './AvatarAgent';
import { AvatarGroup } from './AvatarGroup';
import { useAvatarGroupContext } from './AvatarGroup.context';
import { AvatarIcon } from './AvatarIcon';
import { AvatarImage } from './AvatarImage';
import { AvatarInitials } from './AvatarInitials';
import { AvatarMore } from './AvatarMore';
import { AvatarStatus } from './AvatarStatus';

/**
 * Represents a user or an agent. The content mode follows the prop you pass:
 * `src` for a photo, `initials` for a monogram, `icon` for a custom glyph,
 * `agent` for the orb, and nothing for the default user icon.
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  (
    {
      className,
      src,
      alt,
      initials,
      icon,
      agent,
      fallback,
      status,
      selected,
      size,
      shape,
      color,
      onClick,
      ...rest
    },
    ref,
  ) => {
    const context = useAvatarGroupContext();

    const renderAvatarContent = () => {
      if (agent) {
        return (
          <AvatarAgent alt={alt} size={size} shape={shape} status={status} className={className} />
        );
      }
      if (src) {
        return (
          <AvatarImage
            src={src}
            alt={alt ?? ''}
            initials={initials}
            fallback={fallback}
            size={size}
            shape={shape}
            status={status}
            className={className}
          />
        );
      }
      if (initials) {
        return (
          <AvatarInitials
            initials={initials}
            size={size}
            shape={shape}
            status={status}
            color={color}
            className={className}
          />
        );
      }
      return (
        <AvatarIcon icon={icon} size={size} shape={shape} status={status} className={className} />
      );
    };

    return (
      <AvatarPrimitive.Root
        ref={ref}
        className={cn(
          'relative inline-flex',
          onClick &&
            'focus-visible:wds-focus-visible focus-visible:outline-ws-dynamic-primary-strong-default cursor-pointer',
        )}
        onClick={onClick}
        onKeyDown={
          onClick
            ? (event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                // Dispatch a real click so `onClick` always receives a genuine
                // MouseEvent rather than a keyboard event wearing its type.
                event.currentTarget.click();
              }
            : undefined
        }
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        data-slot="avatar"
        {...rest}
      >
        {renderAvatarContent()}
        {selected && (
          <span
            aria-hidden="true"
            className={selectionRingVariants({
              size: size || context?.size,
              shape: shape || context?.shape,
              hasStatus: !!status,
            })}
          />
        )}
        {status && <AvatarStatus status={status} size={size} />}
      </AvatarPrimitive.Root>
    );
  },
) as AvatarWithSubComponents;

Avatar.displayName = 'Avatar';
Avatar.Agent = AvatarAgent;
Avatar.Group = AvatarGroup;
Avatar.More = AvatarMore;
Avatar.Image = AvatarImage;
Avatar.Icon = AvatarIcon;
Avatar.Initials = AvatarInitials;
Avatar.Status = AvatarStatus;

import { forwardRef } from 'react';
import { cn } from 'src/lib/utils';

import { useThumbnailContext } from './Thumbnail.context';
import type { ThumbnailIconProps } from './Thumbnail.types';
import { thumbnailIconVariants } from './Thumbnail.variants';

/** A Remix glyph on the tile, sized for the thumbnail it sits in. Decorative: hidden from screen readers. */
export const ThumbnailIcon = forwardRef<SVGSVGElement, ThumbnailIconProps>(
  ({ size, icon: Icon, className, ...props }, ref) => {
    const context = useThumbnailContext();

    return (
      <Icon
        ref={ref}
        data-slot="thumbnail-icon"
        aria-hidden="true"
        focusable="false"
        className={cn(thumbnailIconVariants({ size: size ?? context.size }), className)}
        {...props}
      />
    );
  },
);

ThumbnailIcon.displayName = 'Thumbnail.Icon';

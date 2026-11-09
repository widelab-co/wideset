import { forwardRef } from 'react';
import { cn } from 'src/lib/utils';

import type { ThumbnailImageProps } from './Thumbnail.types';

/** A picture that fills the tile edge to edge, cropped to cover it. */
export const ThumbnailImage = forwardRef<HTMLImageElement, ThumbnailImageProps>(
  ({ src, alt, className, ...props }, ref) => (
    <img
      ref={ref}
      data-slot="thumbnail-image"
      src={src}
      alt={alt}
      className={cn('size-full object-cover', className)}
      {...props}
    />
  ),
);

ThumbnailImage.displayName = 'Thumbnail.Image';

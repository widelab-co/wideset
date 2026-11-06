import {
  type RemixiconComponentType,
  RiBarChartFill,
  RiFilePdf2Fill,
  RiFileTextFill,
  RiImage2Fill,
  RiTableFill,
  RiVideoOnFill,
} from '@remixicon/react';
import { forwardRef, isValidElement } from 'react';
import { cn } from 'src/lib/utils';

import { ThumbnailContext } from './Thumbnail.context';
import type {
  ThumbnailFileType,
  ThumbnailProps,
  ThumbnailWithSubComponents,
} from './Thumbnail.types';
import {
  thumbnailIconVariants,
  thumbnailTextVariants,
  thumbnailVariants,
} from './Thumbnail.variants';
import { ThumbnailIcon } from './ThumbnailIcon';
import { ThumbnailImage } from './ThumbnailImage';

/**
 * Figma draws Material glyphs here (`picture_as_pdf`, `table_chart`,
 * `description`, `videocam`, `image`, Round style); these are the closest Remix
 * shapes: filled, the video camera without a dot, the picture as a filled frame.
 */
const FILE_TYPE_ICONS: Record<ThumbnailFileType, RemixiconComponentType> = {
  pdf: RiFilePdf2Fill,
  spreadsheet: RiTableFill,
  document: RiFileTextFill,
  video: RiVideoOnFill,
  picture: RiImage2Fill,
};

/**
 * A small square tile that stands for a thing: a file, a project, an integration.
 * The content mode follows the prop you pass: `icon` for a glyph, `src` for a
 * picture, `text` for a letter, or `type` for a logo or one of the fixed file kinds.
 */
export const Thumbnail = forwardRef<HTMLDivElement, ThumbnailProps>(
  ({ className, size, children, type, icon: Icon, src, alt, text, ...props }, ref) => {
    // A composed `Thumbnail.Image` fills the tile like `src` does, so it gets no purple behind it.
    const imageChild = isValidElement(children) && children.type === ThumbnailImage;
    const resolvedType =
      type ?? (src || imageChild ? 'image' : text !== undefined ? 'text' : 'icon');

    const renderContent = () => {
      if (children) return children;

      switch (resolvedType) {
        case 'image':
          return <ThumbnailImage src={src as string} alt={alt ?? ''} />;
        case 'logo':
          return (
            <img
              src={src}
              alt={alt ?? ''}
              className={cn(thumbnailIconVariants({ size }), 'object-contain')}
            />
          );
        case 'text':
          return <span className={thumbnailTextVariants({ size })}>{text}</span>;
        case 'icon':
          return <ThumbnailIcon icon={Icon ?? RiBarChartFill} />;
        default:
          return <ThumbnailIcon icon={FILE_TYPE_ICONS[resolvedType]} />;
      }
    };

    return (
      <ThumbnailContext.Provider value={{ size }}>
        <div
          ref={ref}
          data-slot="thumbnail"
          className={cn(thumbnailVariants({ size, type: resolvedType }), className)}
          {...props}
        >
          {renderContent()}
        </div>
      </ThumbnailContext.Provider>
    );
  },
) as ThumbnailWithSubComponents;

Thumbnail.displayName = 'Thumbnail';
Thumbnail.Icon = ThumbnailIcon;
Thumbnail.Image = ThumbnailImage;

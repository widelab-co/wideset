import type { RemixiconComponentType } from '@remixicon/react';
import type { VariantProps } from 'class-variance-authority';
import type {
  ForwardRefExoticComponent,
  HTMLAttributes,
  ImgHTMLAttributes,
  PropsWithoutRef,
  RefAttributes,
} from 'react';

import type { RemixiconProps } from '../../types/icon.types';
import type { thumbnailVariants } from './Thumbnail.variants';
import type { ThumbnailIcon } from './ThumbnailIcon';
import type { ThumbnailImage } from './ThumbnailImage';

/** Figma's `Size` axis: `xs` 16, `sm` 20, `md` 24, `lg` 32, `xl` 40px. */
export type ThumbnailSize = NonNullable<VariantProps<typeof thumbnailVariants>['size']>;

/**
 * Figma's `Type` axis. `icon`, `image`, `logo` and `text` show content you pass; the file
 * kinds (`pdf`, `spreadsheet`, `document`, `video`, `picture`) carry a fixed glyph and hue,
 * so a list of files reads at a glance.
 */
export type ThumbnailType = NonNullable<VariantProps<typeof thumbnailVariants>['type']>;

/** The `Type` values that stand for a kind of file rather than for content you pass in. */
export type ThumbnailFileType = Extract<
  ThumbnailType,
  'pdf' | 'spreadsheet' | 'document' | 'video' | 'picture'
>;

export type ThumbnailContextType = {
  size?: ThumbnailSize;
};

export type ThumbnailCommonProps = {
  /**
   * Figma's `Size` axis: `xs` 16, `sm` 20, `md` 24, `lg` 32, `xl` 40px. The corner radius,
   * the glyph and the text style step with it.
   * @default 'md'
   */
  size?: ThumbnailSize;
};

type ThumbnailIconContent = {
  /** A glyph on the purple tile. The default when no content prop is passed. */
  type?: 'icon';
  /** Remix icon drawn on the tile, as a component (`icon={RiFolder3Fill}`). Defaults to a bar chart, as in Figma. */
  icon?: RemixiconComponentType;
  src?: never;
  alt?: never;
  text?: never;
};

type ThumbnailImageContent = {
  /** A picture that fills the tile edge to edge. Implied by `src`. */
  type?: 'image';
  /** URL of the picture (`image`) or of the logo (`logo`). */
  src: string;
  /** Alternative text for `src`. Pass `""` when a name next to the thumbnail already says what it is. */
  alt: string;
  icon?: never;
  text?: never;
};

type ThumbnailLogoContent = {
  /** A logo drawn at glyph size on a white tile with a subtle border, so any mark reads on any surface. */
  type: 'logo';
  /** URL of the picture (`image`) or of the logo (`logo`). */
  src: string;
  /** Alternative text for `src`. Pass `""` when a name next to the thumbnail already says what it is. */
  alt: string;
  icon?: never;
  text?: never;
};

type ThumbnailTextContent = {
  /** A letter or two on the purple tile. Implied by `text`. */
  type?: 'text';
  /** The letters drawn on the tile: an initial or two, never a word. */
  text: string;
  icon?: never;
  src?: never;
  alt?: never;
};

type ThumbnailFileContent = {
  /** A kind of file: `pdf`, `spreadsheet`, `document`, `video` or `picture`. Glyph and hue are fixed per kind. */
  type: ThumbnailFileType;
  icon?: never;
  src?: never;
  alt?: never;
  text?: never;
};

export type ThumbnailContent =
  | ThumbnailIconContent
  | ThumbnailImageContent
  | ThumbnailLogoContent
  | ThumbnailTextContent
  | ThumbnailFileContent;

/**
 * A small square tile that stands for a thing: a file, a project, an integration. What it
 * shows follows the content prop: `icon`, `src`, `text`, or a file kind in `type`.
 */
export type ThumbnailProps = HTMLAttributes<HTMLDivElement> &
  ThumbnailCommonProps &
  ThumbnailContent;

/** A Remix glyph on the tile, sized for the thumbnail it sits in. */
export type ThumbnailIconProps = RemixiconProps & {
  /** Remix icon to draw, as a component (`icon={RiFolder3Fill}`). */
  icon: RemixiconComponentType;
  /** Glyph size. Follows the `size` of the thumbnail it sits in; set it only to override that. */
  size?: ThumbnailSize;
};

/** A picture that fills the tile edge to edge. */
export type ThumbnailImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  /** URL of the picture. */
  src: string;
  /** Alternative text. Pass `""` when a name next to the thumbnail already says what it is. */
  alt: string;
};

export type ThumbnailWithSubComponents = ForwardRefExoticComponent<
  PropsWithoutRef<ThumbnailProps> & RefAttributes<HTMLDivElement>
> & {
  Icon: typeof ThumbnailIcon;
  Image: typeof ThumbnailImage;
};

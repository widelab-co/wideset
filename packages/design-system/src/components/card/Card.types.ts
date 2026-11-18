import type { VariantProps } from 'class-variance-authority';
import type {
  ForwardRefExoticComponent,
  HTMLAttributes,
  PropsWithoutRef,
  ReactNode,
  RefAttributes,
} from 'react';

import type { cardVariants } from './Card.variants';
import type { CardAction } from './CardAction';
import type { CardContent } from './CardContent';
import type { CardDescription } from './CardDescription';
import type { CardFooter } from './CardFooter';
import type { CardHeader } from './CardHeader';
import type { CardMedia } from './CardMedia';
import type { CardTitle } from './CardTitle';

/** A surface grouping related content, media, and actions. */
export type CardProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants> & {
    /** Card content composed from the available Card subcomponents. */
    children?: ReactNode;
    /** Additional CSS classes merged with the card root. */
    className?: string;
    /**
     * Draws a line under the header and above the footer. Use it when the content below the
     * header is heavy: a table, a list, a form with a footer of actions. Bordered cards only; a
     * flat card has no frame to divide.
     * @default false
     */
    divider?: boolean;
  };

/** The media area with a configurable aspect ratio. */
export type CardMediaProps = HTMLAttributes<HTMLDivElement> & {
  /** Additional CSS classes merged with the media container. */
  className?: string;
  /** Media rendered inside the card, typically an image, illustration, or video. */
  children?: ReactNode;
  /** Aspect ratio applied to the media container. Accepts CSS ratio strings like `16/9` or numeric values. */
  ratio?: string | number;
};

/** The content surface rendered within `Card`. */
export type CardContentProps = HTMLAttributes<HTMLDivElement> & {
  /** Card body content rendered inside the scrollable content area. */
  children?: ReactNode;
  /** Additional CSS classes merged with the scroll container wrapping the content. */
  className?: string;
  /** Additional CSS classes merged with the inner content wrapper. Useful for overriding default padding. */
  contentClassName?: string;
};

/** The header area for a title and supporting content. */
export type CardHeaderProps = HTMLAttributes<HTMLDivElement> & {
  /** Header content, usually Card.Title, Card.Description, and optional Card.Action elements. */
  children?: ReactNode;
  /** Additional CSS classes merged with the header styling. */
  className?: string;
};

/** The action area beneath the main content. */
export type CardFooterProps = HTMLAttributes<HTMLDivElement> & {
  /** Footer content, usually action buttons or supplementary controls. */
  children?: ReactNode;
  /** Additional CSS classes merged with the footer styling. */
  className?: string;
};

/** The primary title text. */
export type CardTitleProps = HTMLAttributes<HTMLHeadingElement> & {
  /** Renders onto the child instead of the default `<h3>`, to set the heading level. */
  asChild?: boolean;
  /** Card title content. */
  children?: ReactNode;
  /** Additional CSS classes merged with the title styling. */
  className?: string;
};

/** Supporting descriptive text. */
export type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement> & {
  /** Supporting description shown below the card title. */
  children?: ReactNode;
  /** Additional CSS classes merged with the description styling. */
  className?: string;
};

/** An action styled for `Card`. */
export type CardActionProps = HTMLAttributes<HTMLDivElement> & {
  /** Action content aligned with the card header, such as an icon button, badge, or tag. */
  children?: ReactNode;
  /** Additional CSS classes merged with the action container. */
  className?: string;
};

export type CardWithSubComponents = ForwardRefExoticComponent<
  PropsWithoutRef<CardProps> & RefAttributes<HTMLDivElement>
> & {
  Content: typeof CardContent;
  Footer: typeof CardFooter;
  Header: typeof CardHeader;
  Media: typeof CardMedia;
  Title: typeof CardTitle;
  Description: typeof CardDescription;
  Action: typeof CardAction;
};

export type CardContextType = Pick<CardProps, 'variant' | 'divider'>;

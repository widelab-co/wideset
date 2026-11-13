import type { VariantProps } from 'class-variance-authority';
import type {
  ButtonHTMLAttributes,
  ForwardRefExoticComponent,
  HTMLAttributes,
  MouseEvent,
  PropsWithChildren,
  PropsWithoutRef,
  ReactNode,
  RefAttributes,
} from 'react';

import type { AvatarColor } from './Avatar.colors';
import type { avatarVariants, statusVariants } from './Avatar.variants';
import type { AvatarAgent } from './AvatarAgent';
import type { AvatarGroup } from './AvatarGroup';
import type { AvatarIcon } from './AvatarIcon';
import type { AvatarImage } from './AvatarImage';
import type { AvatarInitials } from './AvatarInitials';
import type { AvatarMore } from './AvatarMore';
import type { AvatarStatus } from './AvatarStatus';

export type AvatarGroupContextType = AvatarCommonProps;

/** Shared visual options used by all content modes. */
export type AvatarCommonProps = {
  /** The size of the avatar. */
  size?: VariantProps<typeof avatarVariants>['size'];
  /** The shape of the avatar. */
  shape?: VariantProps<typeof avatarVariants>['shape'];
  /** The status indicator displayed on the avatar. */
  status?: VariantProps<typeof statusVariants>['status'];
  /**
   * Pins the background/text pair for the initials. Left unset, the hue is
   * derived from the initials, and `Avatar.Group` keeps its avatars distinct.
   */
  color?: AvatarColor;
};

type AvatarImageContent = {
  /** The image source URL for the avatar. Use instead of `icon` or `agent`. */
  src: string;
  /** Alternative text for the image. Defaults to "" (decorative). */
  alt?: string;
  /** Fallback content shown when the image fails to load. Accepts a `ReactNode` (custom icon) or a `string` (initials). */
  fallback?: ReactNode | string;
  /** Initials displayed alongside the image fallback when available. */
  initials?: string;
  icon?: never;
  agent?: never;
};

type AvatarInitialsContent = {
  /**
   * The initials to display when no image is provided: one or two letters. At `xs` and `sm`
   * only the first is drawn, as in Figma, since two crowd a 20–24px circle.
   */
  initials: string;
  src?: never;
  alt?: never;
  fallback?: never;
  icon?: never;
  agent?: never;
};

type AvatarIconContent = {
  /** Custom icon to display in the avatar. Use instead of `src`, `initials` or `agent`. */
  icon?: ReactNode;
  src?: never;
  alt?: never;
  fallback?: never;
  initials?: never;
  agent?: never;
};

type AvatarAgentContent = {
  /** Renders the agent orb. Figma calls this content mode `Variant=Orb`. Use instead of `src`, `initials` or `icon`. */
  agent: true;
  /** Alternative text for the orb. Defaults to "Agent". */
  alt?: string;
  src?: never;
  fallback?: never;
  initials?: never;
  icon?: never;
};

type AvatarContent =
  AvatarImageContent | AvatarInitialsContent | AvatarIconContent | AvatarAgentContent;

/** An image, initials, icon, or agent identity. */
export type AvatarProps = HTMLAttributes<HTMLSpanElement> &
  AvatarCommonProps & {
    /** Additional CSS classes to apply to the avatar. */
    className?: string;
    /** Callback fired when the avatar is clicked. */
    onClick?: (event: MouseEvent<HTMLSpanElement>) => void;
    /** Draws the selection ring. Figma's `Selected=True`. */
    selected?: boolean;
  } & AvatarContent;

/** A container grouping related items. */
export type GroupProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>> &
  AvatarCommonProps & {
    /** Layout strategy for the group: `row` overlaps avatars on a single line; `grid` wraps with consistent spacing. */
    layout?: 'row' | 'grid';
  };

/** Trailing button of `Avatar.Group`: an overflow count or an action. Inert without `onClick`. */
export type MoreProps = ButtonHTMLAttributes<HTMLButtonElement> &
  Pick<AvatarCommonProps, 'size' | 'shape'>;

/** Image content of an avatar, with initials or custom content as the fallback. */
export type ImageProps = {
  /** The image source URL for the avatar. */
  src: string;
  /** Alternative text for the image. */
  alt: string;
  /** Initials displayed alongside the image fallback when available. */
  initials?: string;
  /** Additional CSS classes to apply to the image. */
  className?: string;
  /** Fallback content shown when the image fails to load. */
  fallback?: ReactNode | string;
} & AvatarCommonProps;

/** The agent orb. */
export type AgentProps = {
  /** Additional CSS classes to apply to the agent avatar. */
  className?: string;
  /** Alternative text for the orb. Defaults to "Agent". */
  alt?: string;
} & AvatarCommonProps;

/** An icon rendered within `Avatar`. */
export type IconProps = {
  /** Additional CSS classes to apply to the icon avatar. */
  className?: string;
  /** Custom icon to display in the avatar. */
  icon?: ReactNode;
} & AvatarCommonProps;

/** Initials content of an avatar. */
export type InitialsProps = {
  /** The initials to display; at `xs` and `sm` only the first letter is drawn. */
  initials: string;
  /** Additional CSS classes to apply to the initials avatar. */
  className?: string;
} & AvatarCommonProps;

/** The status dot drawn on the avatar. */
export type StatusProps = {
  /** Additional CSS classes to apply to the status indicator. */
  className?: string;
} & Pick<AvatarCommonProps, 'size' | 'status'>;

export type AvatarWithSubComponents = ForwardRefExoticComponent<
  PropsWithoutRef<AvatarProps> & RefAttributes<HTMLSpanElement>
> & {
  Agent: typeof AvatarAgent;
  Group: typeof AvatarGroup;
  More: typeof AvatarMore;
  Image: typeof AvatarImage;
  Icon: typeof AvatarIcon;
  Initials: typeof AvatarInitials;
  Status: typeof AvatarStatus;
};
